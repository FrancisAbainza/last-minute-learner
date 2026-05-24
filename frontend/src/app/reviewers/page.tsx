"use client"

import { ChatUpload } from "@/components/chat-upload"
import ReviewersList from "@/components/reviewers-list"
import { fetchReviewers } from "@/services/reviewer-service";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export default function ReviewersPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['reviewers'],
    queryFn: fetchReviewers,
  })

  if (isLoading) (
    <div className="flex items-center justify-center py-24 gap-2 text-muted-foreground">
      <Loader2 className="h-5 w-5 animate-spin" />
      <span className="text-sm">Loading reviewers…</span>
    </div>
  )

  if (error) (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-sm text-destructive font-medium">Failed to load reviewers.</p>
      <p className="text-xs text-muted-foreground mt-1">Please try refreshing the page.</p>
    </div>
  )

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8 lg:px-8 space-y-10">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">Dashboard</h1>
          <p className="text-muted-foreground">Upload PDFs and manage your reviewers</p>
        </div>

        {/* Chat Upload Component */}
        <ChatUpload />

        <ReviewersList reviewers={data ?? []} />
      </div>
    </div>
  )
}
