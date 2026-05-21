"use client"

import type React from "react"
import { useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, ArrowUp, X, FileText, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import { extractText } from "@/lib/text-extractor"
import { useResolvePromptMutation } from "@/mutations/reviewer-mutation"
import { toast } from "sonner"

const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
]

export const promptSchema = z
  .object({
    prompt: z.string().optional(),
    file: z
      .custom<File>((v) => v instanceof File, { message: "Invalid file" })
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

export type PromptFormData = z.infer<typeof promptSchema>

interface ChatUploadProps {
  placeholder?: string
}

export function ChatUpload({
  placeholder = "Type here what you want to do",
}: ChatUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const clearFileInput = () => { if (fileInputRef.current) fileInputRef.current.value = "" }
  const { mutateAsync } = useResolvePromptMutation();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PromptFormData>({
    resolver: zodResolver(promptSchema),
    defaultValues: { prompt: "", file: undefined },
  })

  const selectedFile = watch("file")

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setValue("file", file, { shouldValidate: true })
  }

  const handleRemoveFile = () => {
    setValue("file", undefined, { shouldValidate: true })
    clearFileInput()
  }

  const handleFormSubmit = async ({ file, prompt }: PromptFormData) => {
    try {
      const fullPrompt = [
        prompt,
        file ? await extractText(file) : "",
      ]
        .filter(Boolean)
        .join(": \n");

      const { success, message } = await mutateAsync(fullPrompt);

      if (!success) {
        setError("prompt", {
          type: "manual",
          message,
        });
        return;
      }

      toast.success(message);
      reset();
      clearFileInput();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <FieldGroup>
          <Field data-invalid={!!(errors.prompt || errors.file) || undefined}>
            <div className="flex items-center gap-3 p-4 border border-border rounded-xl bg-card">
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

              <Input
                {...register("prompt")}
                placeholder={selectedFile ? selectedFile.name : placeholder}
                disabled={isSubmitting}
                aria-invalid={!!errors.prompt || undefined}
                className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground"
              />

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.pptx"
                onChange={handleFileSelect}
                disabled={isSubmitting}
                className="hidden"
              />

              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-lg hover:bg-accent"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <ArrowUp className="h-4 w-4" />
                }
              </Button>
            </div>
            <FieldError errors={[errors.prompt]} />
          </Field>

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
              <FieldError errors={[errors.file]} />
            </Field>
          )}
        </FieldGroup>
      </form>
    </div>
  )
}