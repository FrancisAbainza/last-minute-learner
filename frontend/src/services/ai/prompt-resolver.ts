"use server";

import { auth } from "@clerk/nextjs/server";
import { gateway, generateText, tool } from "ai";
import { z } from "zod";
import { generateReviewer } from "./reviewer-generator";
import { redirect } from "next/navigation";

const model = gateway("openai/gpt-4o-mini");
const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:5000";
const SERVICE_SECRET = process.env.INTERNAL_SERVICE_SECRET ?? "";

type ToolResponse = {
  success: boolean;
  message: string;
  redirectTo?: string;
};

type Reviewer = {
  id: string;
  title: string;
  description: string;
  field: string;
};

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

export async function resolvePrompt(prompt: string) {
  const { userId } = await auth();
  if (!userId) return { success: false, message: "Unauthorized" };

  const serviceHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    "X-User-Id": userId,
    "X-Service-Secret": SERVICE_SECRET,
  };

  // Fetched once and reused across tools that need it
  const getReviewers = (() => {
    let cache: Reviewer[] | null = null;
    return async () => {
      if (cache) return cache;
      const res = await fetch(`${BACKEND_URL}/reviewers`, { headers: serviceHeaders });
      if (!res.ok) return [];
      cache = (await res.json()) as Reviewer[];
      return cache;
    };
  })();

  const tools = {
    createReviewer: tool({
      description: "Create a new reviewer from a natural language prompt",
      inputSchema: z.object({ prompt: z.string() }),
      execute: async ({ prompt }): Promise<ToolResponse> => {
        try {
          const reviewer = await generateReviewer(prompt);
          const res = await fetch(`${BACKEND_URL}/reviewers`, {
            method: "POST",
            headers: serviceHeaders,
            body: JSON.stringify(reviewer),
          });
          if (!res.ok) {
            const err = (await res.json().catch(() => ({}))) as { message?: string };
            throw new Error(err.message ?? `HTTP ${res.status}`);
          }
          return { success: true, message: "Reviewer created successfully." };
        } catch (err) {
          return { success: false, message: err instanceof Error ? err.message : "Failed to create reviewer." };
        }
      },
    }),

    deleteReviewer: tool({
      description: "Delete a reviewer by ID",
      // The model now resolves the correct ID itself, given the reviewer list in context
      inputSchema: z.object({ reviewerId: z.string().uuid() }),
      execute: async ({ reviewerId }): Promise<ToolResponse> => {
        try {
          const res = await fetch(`${BACKEND_URL}/reviewers/${reviewerId}`, {
            method: "DELETE",
            headers: serviceHeaders,
          });
          if (!res.ok) {
            const err = (await res.json().catch(() => ({}))) as { message?: string };
            throw new Error(err.message ?? `HTTP ${res.status}`);
          }
          return { success: true, message: "Reviewer deleted successfully." };
        } catch (err) {
          return { success: false, message: err instanceof Error ? err.message : "Failed to delete reviewer." };
        }
      },
    }),

    openReviewer: tool({
      description: "Open a reviewer page by ID",
      inputSchema: z.object({ reviewerId: z.string().uuid() }),
      execute: async ({ reviewerId }): Promise<ToolResponse> => {
        return { success: true, message: "Opening reviewer...", redirectTo: `/reviewers/${reviewerId}` };
      },
    }),
  };

  // Inject the reviewer list into the prompt so the model can resolve IDs directly
  const reviewers = await getReviewers();
  const reviewerContext = reviewers.length
    ? `\n\nAvailable reviewers:\n${JSON.stringify(reviewers.map(({ id, title, description, field }) => ({ id, title, description, field })), null, 2)}`
    : "\n\nNo reviewers exist yet.";

  try {
    const result = await generateText({
      model,
      system: SYSTEM_MESSAGE + reviewerContext,
      prompt,
      tools,
      allowSystemInMessages: false,
    });

    const output = result.toolResults?.[0]?.output as Partial<ToolResponse> | undefined;

    if (!output) {
      return {
        success: false,
        message: "I couldn't determine the correct action. Please specify whether you want to create, delete, or open a reviewer.",
      };
    }

    if (output.redirectTo) redirect(output.redirectTo);

    return {
      success: output.success ?? true,
      message: output.message ?? "Action completed.",
    };
  } catch (err) {
    if (err instanceof Error && (err as { digest?: string }).digest?.startsWith("NEXT_REDIRECT")) throw err;
    return { success: false, message: err instanceof Error ? err.message : "An unexpected error occurred." };
  }
}