"use server";

import { auth } from "@clerk/nextjs/server";
import { gateway, generateText, tool } from "ai";
import { z } from "zod";
import { generateReviewer } from "./reviewer-generator";

const model = gateway("openai/gpt-4o-mini");
const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:5000";
const SERVICE_SECRET = process.env.INTERNAL_SERVICE_SECRET ?? "";

/** -------------------------
 * TYPES
 * ------------------------- */

type ToolResponse = {
  success: boolean;
  message: string;
};

/** -------------------------
 * SYSTEM PROMPT
 * ------------------------- */

const SYSTEM_MESSAGE = `
You are a helpful assistant with access to reviewer management tools.

When users ask you to create, make, or add reviewers, use the createReviewer tool.
When users ask you to delete, remove, or destroy reviewers, use the deleteReviewer tool.

Always use tools for reviewer operations.

Available tools:
- createReviewer: Creates a new reviewer from a user prompt
- deleteReviewer: Deletes a reviewer by its ID

Rules:
- When creating, pass the full user request into "prompt"
- When deleting, extract the correct reviewerId and use deleteReviewer
`.trim();

/** -------------------------
 * MAIN RESOLVER
 * Clerk verifies the user here (server-side, instant).
 * Flask trusts this server via INTERNAL_SERVICE_SECRET — no short-lived
 * JWT is forwarded, so long AI operations never cause token expiry.
 * ------------------------- */

export async function resolvePrompt(prompt: string) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, message: "Unauthorized" };
  }

  const serviceHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    "X-User-Id": userId,
    "X-Service-Secret": SERVICE_SECRET,
  };

  /** -------------------------
   * TOOLS
   * ------------------------- */

  const createReviewerTool = tool({
    description: "Create a new reviewer",
    inputSchema: z.object({
      prompt: z.string(),
    }),
    execute: async ({ prompt }): Promise<ToolResponse> => {
      try {
        const reviewer = await generateReviewer(prompt);

        const res = await fetch(`${BACKEND_URL}/reviewers`, {
          method: "POST",
          headers: serviceHeaders,
          body: JSON.stringify(reviewer),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({})) as { message?: string };
          throw new Error(err.message ?? `HTTP ${res.status}`);
        }

        return { success: true, message: "A reviewer has been created successfully." };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create reviewer.";
        return { success: false, message };
      }
    },
  });

  const deleteReviewerTool = tool({
    description: "Delete a reviewer by its ID",
    inputSchema: z.object({
      reviewerId: z.string(),
    }),
    execute: async ({ reviewerId }): Promise<ToolResponse> => {
      try {
        const res = await fetch(`${BACKEND_URL}/reviewers/${reviewerId}`, {
          method: "DELETE",
          headers: serviceHeaders,
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({})) as { message?: string };
          throw new Error(err.message ?? `HTTP ${res.status}`);
        }

        return { success: true, message: "A reviewer has been deleted successfully." };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to delete reviewer.";
        return { success: false, message };
      }
    },
  });

  /** -------------------------
   * GENERATE
   * ------------------------- */

  try {
    const result = await generateText({
      model,
      system: SYSTEM_MESSAGE,
      prompt,
      tools: {
        createReviewer: createReviewerTool,
        deleteReviewer: deleteReviewerTool,
      },
      allowSystemInMessages: false,
    });

    const firstToolResult = result.toolResults?.[0];

    if (firstToolResult) {
      const output = firstToolResult.output as Partial<ToolResponse> | undefined;
      return {
        success: output?.success ?? true,
        message: output?.message ?? "Action completed.",
      };
    }

    return {
      success: false,
      message: "I couldn't determine the correct action. Please specify whether you want to create or delete a reviewer.",
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    return { success: false, message };
  }
}
