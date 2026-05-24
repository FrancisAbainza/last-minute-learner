"use client";

import { BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";

interface OverviewTabProps {
  content: string;
}

export function OverviewTab({ content }: OverviewTabProps) {
  return (
    <Card className="gap-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
          <BookOpen size={16} className="text-primary" />
          Detailed Reviewer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose-reviewer space-y-3 text-sm text-foreground leading-relaxed [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-foreground [&_h1]:mt-4 [&_h1]:mb-2 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-primary [&_h2]:mt-4 [&_h2]:mb-1.5 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-accent [&_h3]:mt-3 [&_h3]:mb-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_li]:text-foreground [&_li]:text-sm [&_strong]:text-foreground [&_strong]:font-semibold [&_p]:text-foreground [&_p]:leading-relaxed">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
}
