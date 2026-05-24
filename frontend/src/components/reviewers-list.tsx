"use client"

import { Calendar, BookOpen, GraduationCap, ArrowRight, ScrollText, FlaskConical } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { ReviewerData } from "@/schemas/reviewer-schema"

type Props = {
  reviewers: ReviewerData[]
}

const FIELD_PALETTES = [
  { bg: "bg-emerald-950/60", text: "text-emerald-400", dot: "bg-emerald-400" },
  { bg: "bg-amber-950/60",   text: "text-amber-400",   dot: "bg-amber-400"   },
  { bg: "bg-blue-950/60",    text: "text-blue-400",    dot: "bg-blue-400"    },
  { bg: "bg-violet-950/60",  text: "text-violet-400",  dot: "bg-violet-400"  },
  { bg: "bg-rose-950/60",    text: "text-rose-400",    dot: "bg-rose-400"    },
  { bg: "bg-cyan-950/60",    text: "text-cyan-400",    dot: "bg-cyan-400"    },
  { bg: "bg-orange-950/60",  text: "text-orange-400",  dot: "bg-orange-400"  },
  { bg: "bg-pink-950/60",    text: "text-pink-400",    dot: "bg-pink-400"    },
  { bg: "bg-teal-950/60",    text: "text-teal-400",    dot: "bg-teal-400"    },
  { bg: "bg-indigo-950/60",  text: "text-indigo-400",  dot: "bg-indigo-400"  },
]

function hashField(field: string): number {
  let hash = 0
  for (let i = 0; i < field.length; i++) {
    hash = (hash * 31 + field.charCodeAt(i)) >>> 0
  }
  return hash
}

function getFieldStyle(field: string) {
  return FIELD_PALETTES[hashField(field) % FIELD_PALETTES.length]
}

export default function ReviewersList({ reviewers }: Props) {
  if (reviewers.length === 0) {
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
            No reviewers yet
          </h2>
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
            Upload a document to generate your first AI-powered study reviewer.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Study Materials
            </p>
            <h2 className="text-3xl font-bold text-foreground tracking-tight">
              Your Reviewers
            </h2>
          </div>
          <span className="text-sm text-muted-foreground font-medium tabular-nums">
            {reviewers.length} {reviewers.length === 1 ? "reviewer" : "reviewers"}
          </span>
        </div>
        <Separator />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviewers.map((reviewer) => {
          const fieldStyle = getFieldStyle(reviewer.field)
          return (
            <Link key={reviewer.id} href={`/reviewers/${reviewer.id}`} className="group block">
              <Card className="relative flex flex-col h-full overflow-hidden border border-border/50 bg-card hover:border-primary hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 transition-all duration-200">
                <CardHeader className=" px-5">
                  {/* Field badge */}
                  <Badge
                    variant="outline"
                    className={`w-fit gap-1.5 border-0 text-[11px] font-semibold tracking-wide ${fieldStyle.bg} ${fieldStyle.text}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${fieldStyle.dot}`} />
                    {reviewer.field}
                  </Badge>

                  {/* Title & description */}
                  <div className="space-y-1.5 pt-1">
                    <h3 className="text-base font-semibold text-foreground line-clamp-2 leading-snug tracking-tight">
                      {reviewer.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {reviewer.description}
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="mt-auto px-5 space-y-4">
                  {/* Stats row */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5" strokeWidth={1.75} />
                      {reviewer.flashcards?.length ?? 0} flashcards
                    </span>
                    <span className="text-border">·</span>
                    <span className="flex items-center gap-1.5">
                      <FlaskConical className="h-3.5 w-3.5" strokeWidth={1.75} />
                      {reviewer.quiz?.length ?? 0} quiz items
                    </span>
                    <span className="text-border">·</span>
                    <span className="flex items-center gap-1.5">
                      <ScrollText className="h-3.5 w-3.5" strokeWidth={1.75} />
                      {reviewer.reviewer?.terminologies?.length ?? 0} terms
                    </span>
                  </div>

                  <Separator className="bg-border/50" />

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" strokeWidth={1.75} />
                      {new Date(reviewer.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs font-semibold text-muted-foreground group-hover:text-foreground gap-1 transition-colors duration-200"
                      tabIndex={-1}
                    >
                      Study
                      <ArrowRight
                        className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform duration-200"
                        strokeWidth={2}
                      />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}