"use client";

import { ReviewerData } from "@/schemas/reviewer-schema";
import { useQuery } from "@tanstack/react-query";
import { GraduationCap, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { ReviewerCard } from "./reviewer/reviewer-card";

export default function Reviewer() {
  const { reviewerId } = useParams<{ reviewerId: string }>();

  const { data: reviewer, isPending, error } = useQuery({
    queryKey: ['reviewers', reviewerId],
    queryFn: (): Promise<ReviewerData> => fetch(`/api/reviewers/${reviewerId}`).then(r => r.json()),
    enabled: !!reviewerId,
  })

  if (!reviewerId || isPending) return (
    <div className="flex items-center justify-center py-24 gap-2 text-muted-foreground">
      <Loader2 className="h-5 w-5 animate-spin" />
      <span className="text-sm">Loading reviewer…</span>
    </div>
  )

  if (error) return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-sm text-destructive font-medium">Failed to load reviewer</p>
      <p className="text-xs text-muted-foreground mt-1">{error.message}</p>
    </div>
  )

  if (!reviewer) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center gap-4">
        <div className="relative">
          <div className="h-20 w-20 rounded-2xl bg-muted flex items-center justify-center">
            <GraduationCap className="h-9 w-9 text-muted-foreground" strokeWidth={1.5} />
          </div>
          <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-muted border-2 border-background" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-foreground tracking-tight">
            Reviewer does not exist
          </h2>
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
            The reviewer you are looking for does not exist in the database.
          </p>
        </div>
      </div>
    )
  }

  return (
    <ReviewerCard data={reviewer} />
  )
}