"use client";

import { executeConfirmedAction } from "@/services/ai/prompt-resolver";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useExecuteActionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: executeConfirmedAction,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reviewers"],
      });
    },
  });
}

