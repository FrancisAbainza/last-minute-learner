"use client";
import { ChatUpload, PromptFormData } from "@/components/chat-upload"
import { extractText } from "@/lib/text-extractor";
import { generateReviewer } from "@/services/ai/reviewer-generator";
import { toast } from "sonner"

export default function DashboardPage() {
  const handleSubmit = async ({ file, prompt }: PromptFormData) => {
    try {
      const extractedText = file
        ? await extractText(file)
        : "";

      const generatedReviewer = await generateReviewer(
        [prompt, extractedText]
          .filter(Boolean)
          .join(", ")
      );

      // Save generated reviewer to database using flask
      console.log(generatedReviewer);

      toast.success(
        `Reviewer generated from your ${file ? "file" : "prompt"}!`
      );
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Upload PDFs and manage your study topics</p>
        </div>

        {/* Chat Upload Component */}
        <ChatUpload onSubmit={handleSubmit} />

      </div>
    </div>
  )
}
