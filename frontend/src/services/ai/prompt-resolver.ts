// app/actions/chat.ts
"use server";

import { gateway, generateText, tool } from "ai";
import { z } from "zod";
import { generateReviewer } from "./reviewer-generator";
const model = gateway("openai/gpt-4o-mini")

const createReviewerTool = tool({
  description: "Create a new reviewer",

  inputSchema: z.object({
    prompt: z.string(),
  }),

  execute: async ({ prompt }) => {
    // Generate reviewer from prompt
    const reviewer = await generateReviewer(prompt);

    // Save reviewer to database
    console.log(reviewer);

    return {
      success: true,
    };
  },
});

const deleteReviewerTool = tool({
  description: "Delete a reviewer",

  inputSchema: z.object({
    reviewerId: z.string(),
  }),

  execute: async ({ reviewerId }) => {
    console.log("Deleting reviewer:", reviewerId);

    return {
      success: true,
    };
  },
});

export async function resolvePrompt(prompt: string) {
  // Fetch all reviewers
  // const reviewers = await getReviewers();

  const systemMessage = `You are a helpful assistant with access to reviewer management tools.
  When users ask you to create, make, or add reviewers, use the createReviewer tool.
  When users ask you to delete, remove, or destroy reviewers, use the deleteReviewer tool.
  Always use the appropriate tools when the user's request involves reviewer operations.
  
  Available tools:
  - createReviewer: Creates a new reviewer from prompt
  - deleteReviewer: Deletes a reviewer by its ID number

  When creating a reviewer,
  - ALWAYS pass the full user request inside the "prompt" field.
  
  When deleting a reviewer:
  - match the best reviewer by its field.
  - use deleteReviewer tool with the correct reviewerId.
  `;

  const result = await generateText({
    model: model,
    system: systemMessage,
    prompt,
    tools: {
      createReviewer: createReviewerTool,
      deleteReviewer: deleteReviewerTool,
    },
    allowSystemInMessages: true,
  });

  return {
    text: result.text,
    toolCalls: result.toolCalls,
    toolResults: result.toolResults,
  };
}