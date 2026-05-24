"use client";

import {
  BookOpen,
  Tag,
  Hash,
  Layers,
  HelpCircle,
  CalendarDays,
} from "lucide-react";
import { FieldBadge } from "@/components/ui/field-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { OverviewTab } from "./overview-tab";
import { TermsTab } from "./terms-tab";
import { FactsTab } from "./facts-tab";
import { FlashcardsTab } from "./flashcards-tab";
import { QuizTab } from "./quiz-tab";
import { ReviewerData } from "@/schemas/reviewer-schema";


interface ReviewerCardProps {
  data: ReviewerData;
}

export function ReviewerCard({ data }: ReviewerCardProps) {
  const createdAt = new Date(data.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 space-y-5">
      {/* ── Header ── */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <FieldBadge field={data.field} />
        </div>

        <h1 className="text-2xl font-bold text-primary leading-tight tracking-tight">
          {data.title}
        </h1>

        <p className="text-sm leading-relaxed">
          {data.description}
        </p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <CalendarDays size={11} />
            {createdAt}
          </span>
          <span className="flex items-center gap-1">
            <Tag size={11} />
            {data.reviewer.terminologies.length} terms
          </span>
          <span className="flex items-center gap-1">
            <Hash size={11} />
            {data.reviewer.essentialFacts.length} facts
          </span>
          <span className="flex items-center gap-1">
            <Layers size={11} />
            {data.flashcards.length} flashcards
          </span>
          <span className="flex items-center gap-1">
            <HelpCircle size={11} />
            {data.quiz.length} questions
          </span>
        </div>
      </div>

      <Separator />

      {/* ── Tabs ── */}
      <Tabs defaultValue="overview" className="w-full mb-20">
        <TabsList className="w-full h-auto flex flex-wrap gap-1 bg-muted p-1 rounded-lg mb-4">
          <TabsTrigger
            value="overview"
            className="flex-1 min-w-fit flex items-center gap-1.5 text-xs py-2"
          >
            <BookOpen size={13} />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger
            value="terms"
            className="flex-1 min-w-fit flex items-center gap-1.5 text-xs py-2"
          >
            <Tag size={13} />
            <span className="hidden sm:inline">Terms</span>
          </TabsTrigger>
          <TabsTrigger
            value="facts"
            className="flex-1 min-w-fit flex items-center gap-1.5 text-xs py-2"
          >
            <Hash size={13} />
            <span className="hidden sm:inline">Facts</span>
          </TabsTrigger>
          <TabsTrigger
            value="flashcards"
            className="flex-1 min-w-fit flex items-center gap-1.5 text-xs py-2"
          >
            <Layers size={13} />
            <span className="hidden sm:inline">Flashcards</span>
          </TabsTrigger>
          <TabsTrigger
            value="quiz"
            className="flex-1 min-w-fit flex items-center gap-1.5 text-xs py-2"
          >
            <HelpCircle size={13} />
            <span className="hidden sm:inline">Quiz</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0">
          <OverviewTab content={data.reviewer.detailedReviewer} />
        </TabsContent>

        <TabsContent value="terms" className="mt-0">
          <TermsTab terminologies={data.reviewer.terminologies} />
        </TabsContent>

        <TabsContent value="facts" className="mt-0">
          <FactsTab essentialFacts={data.reviewer.essentialFacts} />
        </TabsContent>

        <TabsContent value="flashcards" className="mt-0">
          <FlashcardsTab flashcards={data.flashcards} />
        </TabsContent>

        <TabsContent value="quiz" className="mt-0">
          <QuizTab quiz={data.quiz} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
