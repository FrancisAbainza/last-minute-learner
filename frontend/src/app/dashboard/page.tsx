"use client";
import { ChatUpload, UploadFormData } from "@/components/chat-upload"
import { extractText } from "@/lib/text-extractor";
import { generateReviewer } from "@/services/ai-sdk";
import { useState } from "react"
import { toast } from "sonner"

export default function DashboardPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async ({ file, prompt }: UploadFormData) => {
    setIsSubmitting(true);

    try {
      await new Promise((r) => setTimeout(r, 1500));

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
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
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
        <ChatUpload onSubmit={handleSubmit} isSubmitting={isSubmitting} />

      </div>
    </div>
  )
}
