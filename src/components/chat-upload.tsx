"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, ArrowUp, X, FileText, Loader2 } from "lucide-react" // added Loader2
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { insertReviewer } from "@/app/dashboard/action"
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation"

// ✅ validation schema
const uploadSchema = z
  .object({
    prompt: z.string().optional(),
    file: z
      .instanceof(File)
      .optional()
      .refine((f) => !f || f.type === "application/pdf", "Only PDF files are allowed"),
  })
  .superRefine((data, ctx) => {
    if (!data.prompt?.trim() && !data.file) {
      ctx.addIssue({
        code: "custom",
        message: "Please provide either a prompt or upload a PDF file",
        path: ["prompt"],
      })
    }
  })

type UploadFormData = z.infer<typeof uploadSchema>

export function ChatUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useUser();
  const router = useRouter();

  const form = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      prompt: "",
      file: undefined,
    },
  })

  const selectedFile = form.watch("file")

  const onSubmit = async (data: UploadFormData) => {
    if (!user) return;

    const { prompt, file } = data
    setIsUploading(true)

    const formData = new FormData()
    if (prompt) formData.append("prompt", prompt)
    if (file) formData.append("file", file)

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/generate-reviewer`, {
      method: "POST",
      body: formData,
    })

    if (!res.ok) {
      const err = await res.json()
      toast.error("Error: " + JSON.stringify(err))
      setIsUploading(false)
      return
    }

    // Insert data to database
    const responseData = await res.json()
    const reviewerData = {
      userId: user.id,
      ...responseData,
    }
    await insertReviewer(reviewerData);

    toast.success(
      file ? "PDF uploaded successfully! Processing started." : "Study reviewer has been generated."
    )
    form.reset()
    if (fileInputRef.current) fileInputRef.current.value = ""
    setIsUploading(false)
    router.refresh();
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      form.setValue("file", files[0], { shouldValidate: true })
    }
  }

  const handlePlusButtonClick = () => fileInputRef.current?.click()

  // ✅ explicit annotation fixes TS7022
  const handleRemoveFile: () => void = () => {
    form.setValue("file", undefined, { shouldValidate: true })
    if (fileInputRef.current) fileInputRef.current.value = ""
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
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" /> // spinner here
                ) : (
                  <ArrowUp className="h-4 w-4" />
                )}
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
      </form>
    </div>
  )
}
