"use client"

import type React from "react"
import { useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, ArrowUp, X, FileText, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldError,
  FieldGroup,
} from "@/components/ui/field"

// ── Validation schema ──────────────────────────────────────────────────────────

const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
]

export const uploadSchema = z
  .object({
    prompt: z.string().optional(),
    file: z
      .instanceof(File)
      .optional()
      .refine(
        (f) => !f || ACCEPTED_MIME_TYPES.includes(f.type),
        "Only PDF, DOCX, and PPTX files are allowed"
      ),
  })
  .superRefine((data, ctx) => {
    if (!data.prompt?.trim() && !data.file) {
      ctx.addIssue({
        code: "custom",
        message: "Please provide either a prompt or upload a file",
        path: ["prompt"],
      })
    }
  })

export type UploadFormData = z.infer<typeof uploadSchema>

// ── Props ──────────────────────────────────────────────────────────────────────

interface ChatUploadProps {
  /**
   * Called with validated form data when the user submits.
   * The parent owns async state (loading, toasts, navigation, etc.).
   */
  onSubmit: (data: UploadFormData) => Promise<void>
  /** When true the form is disabled and the submit button shows a spinner. */
  isSubmitting?: boolean
}

// ── Component ──────────────────────────────────────────────────────────────────

export function ChatUpload({ onSubmit, isSubmitting = false }: ChatUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: { prompt: "", file: undefined },
  })

  const selectedFile = watch("file")

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setValue("file", file, { shouldValidate: true })
  }

  const handleRemoveFile = () => {
    setValue("file", undefined, { shouldValidate: true })
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleFormSubmit = async (data: UploadFormData) => {
    await onSubmit(data)
    reset()
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <FieldGroup>

          {/* ── Input row ──
           * data-invalid on Field propagates error styling to the entire row.
           * The cross-field "need at least one" error lands on `errors.prompt`,
           * so we check both fields here.
           */}
          <Field data-invalid={!!(errors.prompt || errors.file) || undefined}>
            <div className="flex items-center gap-3 p-4 border border-border rounded-xl bg-card">

              {/* Plus / file-picker trigger */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-lg hover:bg-accent"
                disabled={isSubmitting}
                onClick={() => fileInputRef.current?.click()}
              >
                <Plus className="h-4 w-4" />
              </Button>

              {/* Prompt input — aria-invalid for assistive tech */}
              <Input
                {...register("prompt")}
                placeholder={
                  selectedFile
                    ? selectedFile.name
                    : "Type a topic to generate… or upload a PDF/DOCX/PPTX"
                }
                disabled={isSubmitting}
                aria-invalid={!!errors.prompt || undefined}
                className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground"
              />

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.pptx"
                onChange={handleFileSelect}
                disabled={isSubmitting}
                className="hidden"
              />

              {/* Submit */}
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-lg hover:bg-accent"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowUp className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* FieldError accepts an errors array directly from RHF.
             * Renders both the cross-field prompt error and the file error
             * in one place, deduplicating automatically when both fire. */}
            <FieldError errors={[errors.prompt, errors.file]} />
          </Field>

          {/* ── Selected-file chip ── */}
          {selectedFile && (
            <Field data-invalid={!!errors.file || undefined}>
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
                  disabled={isSubmitting}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>

              {/* File-type error shown beneath the chip */}
              <FieldError errors={[errors.file]} />
            </Field>
          )}

        </FieldGroup>
      </form>
    </div>
  )
}