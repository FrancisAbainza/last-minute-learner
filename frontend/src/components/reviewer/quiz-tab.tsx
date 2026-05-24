"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, ChevronRight, RotateCcw, HelpCircle, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface QuizTabProps {
  quiz: {
    question: string;
    choices: string[];
    answer: string;
  }[];
}

const LABELS = ["A", "B", "C", "D"];

export function QuizTab({ quiz }: QuizTabProps) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = quiz[current];
  const isCorrect = selected === q.answer;

  const handleSelect = (choice: string) => {
    if (selected) return;
    setSelected(choice);
    if (choice === q.answer) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (current + 1 >= quiz.length) {
      setDone(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  };

  const handleReset = () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  };

  if (done) {
    const pct = Math.round((score / quiz.length) * 100);
    const passed = pct >= 70;

    return (
      <Card>
        <CardContent className="py-10 flex flex-col items-center text-center gap-4">
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center",
            passed ? "bg-primary/10" : "bg-destructive/10"
          )}>
            <Trophy size={28} className={passed ? "text-primary" : "text-destructive"} />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-foreground">Quiz Complete!</h3>
            <p className="text-sm text-muted-foreground">
              You answered {score} out of {quiz.length} correctly
            </p>
          </div>
          <div className="w-full max-w-xs space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Score</span>
              <span className={cn("font-semibold", passed ? "text-primary" : "text-destructive")}>
                {pct}%
              </span>
            </div>
            <Progress value={pct} className="h-2" />
          </div>
          <Badge variant={passed ? "default" : "destructive"} className="text-xs">
            {passed ? "Passed" : "Needs Review"}
          </Badge>
          <Button onClick={handleReset} variant="outline" size="sm" className="gap-2 mt-1">
            <RotateCcw size={13} />
            Retry Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle size={16} className="text-primary" />
          <span className="text-sm font-semibold text-foreground">Quiz</span>
        </div>
        <Badge variant="secondary" className="text-xs">
          {current + 1} / {quiz.length}
        </Badge>
      </div>

      <Progress value={(current / quiz.length) * 100} className="h-1.5" />

      {/* Question */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Question {current + 1}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base font-medium text-foreground leading-relaxed">
            {q.question}
          </p>
        </CardContent>
      </Card>

      {/* Choices */}
      <div className="space-y-2">
        {q.choices.map((choice, i) => {
          const isSelected = selected === choice;
          const isAnswerCorrect = choice === q.answer;

          let variant: string;
          if (!selected) {
            variant = "border-border bg-card text-foreground hover:border-primary/50 hover:bg-primary/5";
          } else if (isAnswerCorrect) {
            variant = "border-green-500/60 bg-green-500/10 text-foreground";
          } else if (isSelected) {
            variant = "border-destructive/60 bg-destructive/10 text-foreground";
          } else {
            variant = "border-border bg-card text-muted-foreground opacity-60";
          }

          return (
            <button
              key={i}
              disabled={!!selected}
              onClick={() => handleSelect(choice)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-sm text-left transition-colors",
                variant
              )}
            >
              <span className={cn(
                "shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold transition-colors",
                !selected && "border-border text-muted-foreground",
                selected && isAnswerCorrect && "border-green-500 text-green-600",
                selected && isSelected && !isAnswerCorrect && "border-destructive text-destructive",
                selected && !isSelected && !isAnswerCorrect && "border-border text-muted-foreground"
              )}>
                {LABELS[i]}
              </span>
              <span className="flex-1">{choice}</span>
              {selected && isAnswerCorrect && (
                <CheckCircle2 size={15} className="shrink-0 text-green-500" />
              )}
              {selected && isSelected && !isAnswerCorrect && (
                <XCircle size={15} className="shrink-0 text-destructive" />
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {selected && (
        <div className={cn(
          "flex items-start gap-2.5 p-3 rounded-lg border text-sm",
          isCorrect
            ? "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-300"
            : "bg-destructive/10 border-destructive/30 text-destructive"
        )}>
          {isCorrect
            ? <CheckCircle2 size={15} className="mt-0.5 shrink-0" />
            : <XCircle size={15} className="mt-0.5 shrink-0" />}
          <span>
            {isCorrect
              ? "Correct! Well done."
              : `Incorrect. The correct answer is: ${q.answer}`}
          </span>
        </div>
      )}

      {/* Next */}
      <div className="flex justify-end">
        <Button
          onClick={handleNext}
          disabled={!selected}
          size="sm"
          className="gap-1.5"
        >
          {current + 1 >= quiz.length ? "Finish" : "Next"}
          <ChevronRight size={14} />
        </Button>
      </div>
    </div>
  );
}
