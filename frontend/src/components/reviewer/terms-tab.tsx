"use client";

import { useState } from "react";
import { Search, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface TermsTabProps {
  terminologies: { term: string; definition: string }[];
}

export function TermsTab({ terminologies }: TermsTabProps) {
  const [search, setSearch] = useState("");

  const filtered = terminologies.filter(
    (t) =>
      t.term.toLowerCase().includes(search.toLowerCase()) ||
      t.definition.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
            <Tag size={16} className="text-primary" />
            Key Terminologies
            <Badge variant="secondary" className="ml-auto text-xs">
              {terminologies.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-8 text-sm"
              placeholder="Search terms…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground text-sm py-10">
          No terms match your search.
        </p>
      ) : (
        <div className="space-y-2">
          {filtered.map((t, i) => (
            <Card key={i} className="transition-colors hover:border-primary/40">
              <CardContent className="px-4 flex gap-3 items-start">
                <span className="mt-0.5 shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Tag size={11} className="text-primary" />
                </span>
                <div className="min-w-0">
                  <p className="text-base font-semibold text-primary">{t.term}</p>
                  <p className="text-sm mt-0.5 leading-relaxed">
                    {t.definition}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
