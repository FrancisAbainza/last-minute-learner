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

const uploadSchema = z.object({
  prompt: z.string().optional(),
})

type UploadFormData = z.infer<typeof uploadSchema>

export function ChatUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      prompt: "",
    },
  })

  const validateSubmission = () => {
    const prompt = form.getValues("prompt")?.trim()
    const hasPrompt = Boolean(prompt)
    const hasFile = Boolean(selectedFile)

    if (!hasPrompt && !hasFile) {
      form.setError("prompt", { message: "Please provide either a prompt or upload a PDF file" })
      return false
    }

    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setFileError("Only PDF files are allowed")
        return false
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        setFileError("File size must be less than 10MB")
        return false
      }
    }

    setFileError("")
    return true
  }

  const onSubmit = async (data: UploadFormData) => {
    if (!validateSubmission()) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          if (selectedFile) {
            toast.success("PDF uploaded successfully! Processing started.")
          } else {
            toast.success("Prompt submitted successfully! Processing started.")
          }
          form.reset()
          setSelectedFile(null)
          setFileError("")
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
      const file = files[0]
      setSelectedFile(file)
      setFileError("")

      // Clear prompt error if file is selected
      if (form.formState.errors.prompt) {
        form.clearErrors("prompt")
      }
    }
  }

  const handlePlusButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setFileError("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue("prompt", e.target.value)

    // Clear file error if prompt is entered
    if (e.target.value.trim() && fileError) {
      setFileError("")
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
                onChange={handlePromptChange}
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
              <span className="text-xs text-muted-foreground">({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
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

        {fileError && <p className="text-sm text-destructive px-4">{fileError}</p>}

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
