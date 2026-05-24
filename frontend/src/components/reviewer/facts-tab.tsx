"use client";

import { Hash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FactsTabProps {
  essentialFacts: string[];
}

export function FactsTab({ essentialFacts }: FactsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
          <Hash size={16} className="text-primary" />
          Essential Facts
          <Badge variant="secondary" className="ml-auto text-xs">
            {essentialFacts.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {essentialFacts.map((fact, i) => (
          <div
            key={i}
            className="flex gap-3 items-start p-3 rounded-lg bg-muted/50 border border-border hover:border-primary/30 transition-colors"
          >
            <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center text-[10px] font-bold text-primary">
              {i + 1}
            </span>
            <p className="text-sm text-foreground leading-relaxed">{fact}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
