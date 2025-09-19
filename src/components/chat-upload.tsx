"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, ArrowUp, X, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"

// ✅ All validation lives here now
const uploadSchema = z
  .object({
    prompt: z.string().optional(),
    file: z
      .instanceof(File)
      .optional()
      .refine((f) => !f || f.type === "application/pdf", "Only PDF files are allowed")
      .refine((f) => !f || f.size <= 10 * 1024 * 1024, "File size must be less than 10MB"),
  })
  .superRefine((data, ctx) => {
    if (!data.prompt?.trim() && !data.file) {
      ctx.addIssue({
        code: "custom",          // ✅ recommended
        message: "Please provide either a prompt or upload a PDF file",
        path: ["prompt"],
      })
    }
  })

type UploadFormData = z.infer<typeof uploadSchema>

export function ChatUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      prompt: "",
      file: undefined,
    },
  })

  const selectedFile = form.watch("file")

  const onSubmit = async (data: UploadFormData) => {
    const {prompt, file} = data;
    setIsUploading(true)
    setUploadProgress(0)

    // formdata for multipart/form-data
    const formData = new FormData();
    if (prompt) formData.append('prompt', prompt);
    if (file) formData.append('file', file);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/generate-reviewer`, {
      method: 'POST',
      body: formData,
    });
    
    if (!res.ok) {
      const err = await res.json();
      alert('Error: ' + JSON.stringify(err));
      return;
    }

    const responseData = await res.json();
    console.log(responseData);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          if (data.file) {
            toast.success("PDF uploaded successfully! Processing started.")
          } else {
            toast.success("Prompt submitted successfully! Processing started.")
          }
          form.reset()
          if (fileInputRef.current) {
            fileInputRef.current.value = ""
          }
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      form.setValue("file", files[0], { shouldValidate: true })
    }
  }

  const handlePlusButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveFile = () => {
    form.setValue("file", undefined, { shouldValidate: true })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="relative">
          <div className="flex items-center gap-3 p-4 border border-border rounded-xl bg-card">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-lg hover:bg-accent"
              disabled={isUploading}
              onClick={handlePlusButtonClick}
            >
              <Plus className="h-4 w-4" />
            </Button>

            <div className="flex-1">
              <Input
                {...form.register("prompt")}
                placeholder={selectedFile ? selectedFile.name : "Ask v0 to build... or upload a PDF"}
                disabled={isUploading}
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                disabled={isUploading}
                className="hidden"
              />

              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-lg hover:bg-accent"
                disabled={isUploading}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {selectedFile && (
          <div className="flex items-center justify-between p-3 bg-accent/10 border border-border rounded-lg">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground">{selectedFile.name}</span>
              <span className="text-xs text-muted-foreground">
                ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 rounded-full hover:bg-destructive/10"
              onClick={handleRemoveFile}
              disabled={isUploading}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}

        {form.formState.errors.prompt && (
          <p className="text-sm text-destructive px-4">{form.formState.errors.prompt.message}</p>
        )}
        {form.formState.errors.file && (
          <p className="text-sm text-destructive px-4">{form.formState.errors.file.message}</p>
        )}

        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Processing...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="w-full" />
          </div>
        )}
      </form>
    </div>
  )
}
