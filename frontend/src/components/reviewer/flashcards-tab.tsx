"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FlashcardsTabProps {
  flashcards: { front: string; back: string }[];
}

export function FlashcardsTab({ flashcards }: FlashcardsTabProps) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [animating, setAnimating] = useState(false);

  const navigate = (dir: 1 | -1) => {
    if (animating) return;
    setAnimating(true);
    setFlipped(false);
    setTimeout(() => {
      setIndex((i) => (i + dir + flashcards.length) % flashcards.length);
      setAnimating(false);
    }, 200);
  };

  const card = flashcards[index];
  const progress = ((index + 1) / flashcards.length) * 100;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-primary" />
          <span className="text-sm font-semibold text-foreground">Flashcards</span>
        </div>
        <Badge variant="secondary" className="text-xs">
          {index + 1} / {flashcards.length}
        </Badge>
      </div>

      <Progress value={progress} className="h-1.5" />

      {/* Flip Card */}
      <div
        className="relative w-full cursor-pointer"
        style={{ perspective: "1000px" }}
        onClick={() => setFlipped((f) => !f)}
      >
        <div
          className={cn(
            "relative w-full transition-transform duration-500",
            "transform-style-3d"
          )}
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {/* Front */}
          <Card
            className="w-full"
            style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
          >
            <CardContent className="min-h-52 flex flex-col items-center justify-center p-6 text-center gap-3">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                Question
              </span>
              <p className="text-base font-medium text-foreground leading-relaxed">
                {card.front}
              </p>
              <span className="text-xs text-muted-foreground mt-2">
                Tap to reveal answer
              </span>
            </CardContent>
          </Card>

          {/* Back */}
          <Card
            className="w-full absolute inset-0 bg-primary/5 border-primary/30"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <CardContent className="min-h-52 flex flex-col items-center justify-center p-6 text-center gap-3">
              <span className="text-xs font-medium text-primary uppercase tracking-widest">
                Answer
              </span>
              <p className="text-sm text-foreground leading-relaxed">{card.back}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          disabled={animating}
          className="gap-1.5"
        >
          <ChevronLeft size={15} />
          Prev
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setFlipped((f) => !f)}
          className="gap-1.5 text-muted-foreground"
        >
          <RotateCcw size={13} />
          Flip
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(1)}
          disabled={animating}
          className="gap-1.5"
        >
          Next
          <ChevronRight size={15} />
        </Button>
      </div>

      {/* Dot indicators — show up to 10 */}
      <div className="flex justify-center gap-1.5 flex-wrap">
        {flashcards.slice(0, 10).map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setFlipped(false);
              setIndex(i);
            }}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              i === index
                ? "bg-primary w-4"
                : "bg-border hover:bg-muted-foreground"
            )}
            aria-label={`Go to card ${i + 1}`}
          />
        ))}
        {flashcards.length > 10 && (
          <span className="text-xs text-muted-foreground self-center">
            +{flashcards.length - 10}
          </span>
        )}
      </div>
    </div>
  );
}
