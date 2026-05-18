import { z } from "zod";

export const reviewerCommands = {
  create: {
    schema: z.object({
      prompt: z.string()
    }),
    handler: async (prompt: string) => {
      console.log("Creating reviewer:", prompt);
    }
  },

  read: {
    schema: z.object({
      reviewer_id: z.string()
    }),

    handler: async ({ reviewer_id }: { reviewer_id: string }) => {
      console.log("Reading reviewer:", reviewer_id);
    }
  },

  delete: {
    schema: z.object({
      reviewer_id: z.string()
    }),

    handler: async (reviewer_id: string) => {
      console.log("Deleting reviewer:", reviewer_id);
    }
  }
} as const;