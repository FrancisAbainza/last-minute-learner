import { reviewerCommands } from "./commands/reviewer";

export const commandRegistry = {
  reviewer: reviewerCommands
} as const;