"use server";

import { auth } from "@clerk/nextjs/server";
import { gateway, generateText, tool } from "ai";
import { z } from "zod";
import { generateReviewer } from "./reviewer-generator";
import { redirect } from "next/navigation";
import { ReviewerData, ReviewerOutput } from "@/schemas/reviewer-schema";

const model = gateway("openai/gpt-4o-mini");
const BACKEND_URL = process.env.FLASK_API_URL ?? "http://localhost:5000";
const SERVICE_SECRET = process.env.INTERNAL_SERVICE_SECRET ?? "";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PendingAction =
  | { type: "createReviewer"; prompt: string; reviewerTitle: string; reviewerData: ReviewerOutput }
  | { type: "deleteReviewer"; reviewerId: string; reviewerTitle?: string }
  | { type: "openReviewer"; reviewerId: string; reviewerTitle?: string };

export type DoneResult = { status: "done"; success: boolean; message: string }

export type ResolveResult =
  | DoneResult
  | { status: "confirm"; pendingAction: PendingAction; message: string };

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SYSTEM_MESSAGE = `
You are a helpful assistant with access to reviewer management tools.

When users ask you to create, make, or add reviewers, use the createReviewer tool.
When users ask you to delete, remove, or destroy reviewers, use the deleteReviewer tool.
When users ask you to open, access, or view reviewers, use the openReviewer tool.

Always use tools for reviewer operations.

Available tools:
- createReviewer: Creates a new reviewer from a user prompt
- deleteReviewer: Deletes a reviewer by its ID
- openReviewer: Opens a reviewer by its ID

Rules:
- When creating, pass the full user request into "prompt"
- When deleting, use the deleteReviewer tool
- When opening, use the openReviewer tool
`.trim();

// ---------------------------------------------------------------------------
// resolvePrompt — plans the action, does NOT execute it
// ---------------------------------------------------------------------------

export async function resolvePrompt(prompt: string): Promise<ResolveResult> {
  const { userId } = await auth();
  if (!userId) return { status: "done", success: false, message: "Unauthorized" };

  const serviceHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    "X-User-Id": userId,
    "X-Service-Secret": SERVICE_SECRET,
  };

  const getReviewers = (() => {
    let cache: ReviewerData[] | null = null;
    return async () => {
      if (cache) return cache;
      const res = await fetch(`${BACKEND_URL}/reviewers`, { headers: serviceHeaders });
      if (!res.ok) return [];
      cache = (await res.json()) as ReviewerData[];
      return cache;
    };
  })();

  // Tools WITHOUT execute — model plans but does not run anything
  const tools = {
    createReviewer: tool({
      description: "Create a new reviewer from a natural language prompt",
      inputSchema: z.object({ prompt: z.string() }),
    }),
    deleteReviewer: tool({
      description: "Delete a reviewer by ID",
      inputSchema: z.object({ reviewerId: z.string().uuid() }),
    }),
    openReviewer: tool({
      description: "Open a reviewer page by ID",
      inputSchema: z.object({ reviewerId: z.string().uuid() }),
    }),
  };

  try {
    const reviewers = await getReviewers();
    const reviewerContext = reviewers.length
      ? `\n\nAvailable reviewers:\n${JSON.stringify(
        reviewers.map(({ id, title, description, field }) => ({ id, title, description, field })),
        null,
        2
      )}`
      : "\n\nNo reviewers exist yet.";

    const result = await generateText({
      model,
      system: SYSTEM_MESSAGE + reviewerContext,
      prompt,
      tools,
      maxRetries: 0,
      allowSystemInMessages: false,
    });

    const toolCall = result.toolCalls?.[0];
    if (!toolCall) {
      return {
        status: "done",
        success: false,
        message: "I couldn't determine the correct action. Please specify whether you want to create, delete, or open a reviewer.",
      };
    }

    // -- openReviewer: enrich with title from already-fetched reviewer list --
    if (toolCall.toolName === "openReviewer") {
      const input = toolCall.input as { reviewerId: string }
      const reviewer = reviewers.find((r) => r.id === input.reviewerId)
      
      if (!reviewer) {
        return {
          status: "done",
          success: false,
          message: reviewers.length === 0
            ? "You don't have any reviewers yet. Create one first!"
            : "That reviewer could not be found.",
        }
      }

      return {
        status: "confirm",
        pendingAction: {
          type: "openReviewer",
          reviewerId: input.reviewerId,
          reviewerTitle: reviewer?.title,
        },
        message: `Open reviewer "${reviewer?.title ?? input.reviewerId}"?`,
      }
    }

    // -- createReviewer: run generateReviewer now so title is ready for dialog --
    if (toolCall.toolName === "createReviewer") {
      const input = toolCall.input as { prompt: string }
      const reviewerData = await generateReviewer(input.prompt)
      return {
        status: "confirm",
        pendingAction: {
          type: "createReviewer",
          prompt: input.prompt,
          reviewerTitle: reviewerData.title,
          reviewerData,
        },
        message: `Create reviewer "${reviewerData.title}"?`,
      }
    }

    // -- deleteReviewer: enrich with title from already-fetched reviewer list --
    if (toolCall.toolName === "deleteReviewer") {
      const input = toolCall.input as { reviewerId: string }
      const reviewer = reviewers.find((r) => r.id === input.reviewerId)
      return {
        status: "confirm",
        pendingAction: {
          type: "deleteReviewer",
          reviewerId: input.reviewerId,
          reviewerTitle: reviewer?.title,
        },
        message: `Permanently delete reviewer "${reviewer?.title ?? input.reviewerId}"?`,
      }
    }

    return { status: "done", success: false, message: "Unknown action." };
  } catch (err) {
    return {
      status: "done",
      success: false,
      message: err instanceof Error ? err.message : "An unexpected error occurred.",
    };
  }
}

// ---------------------------------------------------------------------------
// executeConfirmedAction — runs the action after the user confirms
// ---------------------------------------------------------------------------

export async function executeConfirmedAction(action: PendingAction): Promise<DoneResult> {
  const { userId } = await auth();
  if (!userId) return { status: "done", success: false, message: "Unauthorized" };

  const serviceHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    "X-User-Id": userId,
    "X-Service-Secret": SERVICE_SECRET,
  };

  try {
    switch (action.type) {
      case "createReviewer": {
        // Reuse pre-generated reviewerData — no second generateReviewer() call needed
        const res = await fetch(`${BACKEND_URL}/reviewers`, {
          method: "POST",
          headers: serviceHeaders,
          body: JSON.stringify(action.reviewerData),
        });
        if (!res.ok) {
          const err = (await res.json().catch(() => ({}))) as { message?: string };
          throw new Error(err.message ?? `HTTP ${res.status}`);
        }
        return { status: "done", success: true, message: "Reviewer created successfully." };
      }

      case "deleteReviewer": {
        const res = await fetch(`${BACKEND_URL}/reviewers/${action.reviewerId}`, {
          method: "DELETE",
          headers: serviceHeaders,
        });
        if (!res.ok) {
          const err = (await res.json().catch(() => ({}))) as { message?: string };
          throw new Error(err.message ?? `HTTP ${res.status}`);
        }
        return { status: "done", success: true, message: "Reviewer deleted successfully." };
      }

      case "openReviewer": {
        redirect(`/reviewers/${action.reviewerId}`);
      }
    }
  } catch (err) {
    if (err instanceof Error && (err as { digest?: string }).digest?.startsWith("NEXT_REDIRECT")) throw err;
    return {
      status: "done",
      success: false,
      message: err instanceof Error ? err.message : "An unexpected error occurred.",
    };
  }
}