// app/actions/chat.ts
"use server";

import { gateway, generateText, tool } from "ai";
import { z } from "zod";
import { generateReviewer } from "./reviewer-generator";

const model = gateway("openai/gpt-4o-mini");

/** -------------------------
 * TOOLS
 * ------------------------- */

type ToolResponse = {
  success: boolean;
  message: string;
};

const createReviewerTool = tool({
  description: "Create a new reviewer",

  inputSchema: z.object({
    prompt: z.string(),
  }),

  execute: async ({ prompt }): Promise<ToolResponse> => {
    // Generate reviewer from prompt
    const reviewer = await generateReviewer(prompt);

    // Save reviewer to database
    console.log(reviewer);

    return {
      success: true,
      message: "A reviewer has been created successfully.",
    };
  },
});

const deleteReviewerTool = tool({
  description: "Delete a reviewer",

  inputSchema: z.object({
    reviewerId: z.string(),
  }),

  execute: async ({ reviewerId }): Promise<ToolResponse> => {
    console.log("Deleting reviewer:", reviewerId);

    return {
      success: true,
      message: "A reviewer has been deleted successfully.",
    };
  },
});

/** -------------------------
 * MAIN RESOLVER
 * ------------------------- */

export async function resolvePrompt(prompt: string) {
  const systemMessage = `
You are a helpful assistant with access to reviewer management tools.

When users ask you to create, make, or add reviewers, use the createReviewer tool.
When users ask you to delete, remove, or destroy reviewers, use the deleteReviewer tool.

Always use tools for reviewer operations.

Available tools:
- createReviewer: Creates a new reviewer from prompt
- deleteReviewer: Deletes a reviewer by its ID number

Rules:
- When creating, pass full user request into "prompt"
- When deleting, extract correct reviewerId and use deleteReviewer
`;

  const result = await generateText({
    model,
    system: systemMessage,
    prompt,
    tools: {
      createReviewer: createReviewerTool,
      deleteReviewer: deleteReviewerTool,
    },
    allowSystemInMessages: false,
  });

  /** -------------------------
   * TOOL RESULT HANDLING
   * ------------------------- */

  const firstToolResult = result.toolResults?.[0];

  if (firstToolResult) {
    const output = firstToolResult.output as Partial<ToolResponse> | undefined;

    return {
      success: true,
      message: output?.message ?? "Action completed.",
    };
  }

  /** -------------------------
   * NO TOOL CALLED
   * ------------------------- */

  return {
    success: false,
    message: "I couldn't determine the correct action. Please specify whether you want to create, delete, or access a reviewer.",
  };
}