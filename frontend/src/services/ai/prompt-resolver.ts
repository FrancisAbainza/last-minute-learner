"use server";

import { gateway, generateText, tool } from "ai";
import { z } from "zod";
import { generateReviewer } from "./reviewer-generator";

const model = gateway("openai/gpt-4o-mini");
const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:5000";

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
 * token is obtained client-side (useAuth → getToken) and passed in so
 * it is always fresh — server-side auth() cannot refresh tokens mid-action.
 * ------------------------- */

export async function resolvePrompt({ prompt, token }: { prompt: string; token: string }) {
  if (!token) {
    return { success: false, message: "Unauthorized" };
  }

  const authHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
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
          headers: authHeaders,
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
          headers: authHeaders,
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
