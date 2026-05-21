"use client";

import { resolvePrompt } from "@/services/ai/prompt-resolver";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useResolvePromptMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resolvePrompt,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reviewers"],
      });
    },
  });
}

