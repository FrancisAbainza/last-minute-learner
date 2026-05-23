"use client"

import { Calendar, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

type Props = {
  reviewers: {
    id: string,
    title: string,
    description: string,
    createdAt: string,
  }[]
}

export default function ReviewersList({ reviewers }: Props) {
  if (reviewers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">No reviewers yet</h2>
        <p className="text-sm text-muted-foreground">Upload a document to create your first reviewer.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-foreground">Your Reviewers</h2>
        <span className="text-sm text-muted-foreground">
          {reviewers.length} reviewer{reviewers.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviewers.map((reviewer) => (
          <Card key={reviewer.id} className="hover:shadow-lg transition-shadow border border-border/60">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg line-clamp-2 mb-1">{reviewer.title}</CardTitle>
                  <CardDescription className="text-sm line-clamp-3">{reviewer.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(reviewer.createdAt).toLocaleDateString()}
                </div>
                <Link href={`/reviewers/${reviewer.id}`}>
                  <Button size="sm" className="h-8 gap-1">
                    <BookOpen className="h-4 w-4" />
                    Study
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
