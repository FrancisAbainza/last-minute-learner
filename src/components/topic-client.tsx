// app/topic/[topicId]/TopicClient.tsx
'use client';

import { BookOpen, Info, ListChecks } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import type { HTMLAttributes } from "react";

type Topic = {
  title: string;
  description: string;
  field: string;
  detailedReviewer: string;
  terminologies: { term: string; definition: string }[];
  essentialFacts: string[];
};

// Better typed props for the code renderer
interface CodeBlockProps extends HTMLAttributes<HTMLElement> {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  inline,
  className,
  children,
  ...props
}) => {
  return !inline ? (
    <pre className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 overflow-x-auto my-3 text-sm">
      <code className={`${className ?? ""} text-teal-200`} {...props}>
        {children}
      </code>
    </pre>
  ) : (
    <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-pink-400" {...props}>
      {children}
    </code>
  );
};

export default function TopicClient({ topic }: { topic: Topic }) {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 p-6 flex items-center justify-center">
      <Card className="w-full max-w-3xl bg-neutral-900 border-neutral-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-teal-400" />
              {topic.title}
            </CardTitle>
            <Badge variant="secondary" className="bg-teal-700 text-teal-50">
              {topic.field}
            </Badge>
          </div>
          <CardDescription className="text-neutral-400">
            {topic.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Markdown section */}
          <section>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Info className="w-5 h-5 text-purple-400" />
              Detailed Reviewer
            </h2>
            <div
              className="
                prose prose-invert max-w-none
                prose-headings:font-bold prose-headings:text-primary
                prose-h2:mt-8 prose-h3:mt-6 prose-h4:mt-4
                prose-p:mt-3
                prose-ul:list-disc prose-ul:pl-8 prose-li:my-1
                prose-ol:list-decimal prose-ol:pl-8
                prose-blockquote:border-l-4 prose-blockquote:pl-4 prose-blockquote:text-neutral-400
                prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-neutral-700
                prose-strong:text-teal-400 prose-code:text-pink-400
              "
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  code: CodeBlock,
                  h2: props => (
                    <h2
                      className="text-xl mt-6 mb-2 text-teal-300 font-bold"
                      {...props}
                    />
                  ),
                  h3: props => (
                    <h3
                      className="text-lg mt-4 mb-2 text-purple-300 font-semibold"
                      {...props}
                    />
                  ),
                  ul: props => (
                    <ul className="list-disc pl-8 space-y-1" {...props} />
                  ),
                  li: props => <li className="pl-2" {...props} />,
                  blockquote: props => (
                    <blockquote
                      className="border-l-4 border-neutral-700 pl-4 italic"
                      {...props}
                    />
                  ),
                }}
              >
                {topic.detailedReviewer}
              </ReactMarkdown>
            </div>
          </section>

          <Separator className="bg-neutral-800" />

          {/* Terminologies */}
          <section>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-orange-400" />
              Terminologies
            </h2>
            <div className="mt-3 space-y-2">
              {topic.terminologies.map((item, idx) => (
                <div key={idx} className="rounded-lg bg-neutral-800 p-3">
                  <p className="font-medium text-neutral-100">{item.term}</p>
                  <p className="text-neutral-400 text-sm">{item.definition}</p>
                </div>
              ))}
            </div>
          </section>

          <Separator className="bg-neutral-800" />

          {/* Essential Facts */}
          <section>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-green-400" />
              Essential Facts
            </h2>
            <ul className="list-disc list-inside text-neutral-300 mt-2 space-y-1">
              {topic.essentialFacts.map((fact, idx) => (
                <li key={idx}>{fact}</li>
              ))}
            </ul>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
