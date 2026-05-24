"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, ArrowUp, X, FileText, Loader2, Mic, MicOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import { extractText } from "@/lib/text-extractor"
import { useResolvePromptMutation } from "@/mutations/reviewer-mutation"
import { toast } from "sonner"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition"

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
  onSuccess?: () => void
}

export function ChatUpload({
  placeholder = "Type here what you want to do",
  onSuccess,
}: ChatUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { mutateAsync } = useResolvePromptMutation()

  const { transcript, listening, browserSupportsSpeechRecognition, resetTranscript } =
    useSpeechRecognition()

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

  // Keep the prompt field in sync with the live transcript
  useEffect(() => {
    if (transcript) setValue("prompt", transcript, { shouldValidate: true })
  }, [transcript, setValue])

  const handleMicClick = () => {
    if (listening) {
      SpeechRecognition.stopListening()
    } else {
      resetTranscript()
      SpeechRecognition.startListening({ continuous: true })
    }
  }

  const clearFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setValue("file", file, { shouldValidate: true })
  }

  const handleRemoveFile = () => {
    setValue("file", undefined, { shouldValidate: true })
    clearFileInput()
  }

  // Allow Ctrl+Enter / Cmd+Enter to submit while inside the textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSubmit(handleFormSubmit)()
    }
  }

  const handleFormSubmit = async ({ file, prompt }: PromptFormData) => {
    if (listening) SpeechRecognition.stopListening()

    try {
      const fullPrompt = [prompt, file ? await extractText(file) : ""]
        .filter(Boolean)
        .join("\n\n")

      const { success, message } = await mutateAsync(fullPrompt)

      if (!success) {
        setError("prompt", { type: "manual", message })
        return
      }

      toast.success(message)
      reset()
      resetTranscript()
      clearFileInput()
      onSuccess?.()
    } catch (err) {
      if (isRedirectError(err)) {
        onSuccess?.()
        throw err
      }

      setError("prompt", {
        type: "manual",
        message: err instanceof Error ? err.message : "Something went wrong",
      })
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <FieldGroup>
          <Field data-invalid={!!(errors.prompt || errors.file) || undefined}>
            <div className="flex flex-col gap-3 p-4 border border-border rounded-xl bg-card">
              <Textarea
                {...register("prompt")}
                placeholder={listening ? "Listening…" : selectedFile ? selectedFile.name : placeholder}
                disabled={isSubmitting}
                aria-invalid={!!errors.prompt || undefined}
                onKeyDown={handleKeyDown}
                rows={4}
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground resize-none"
              />

              {/* Toolbar row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    title="Attach file"
                    className="h-8 w-8 p-0 rounded-lg hover:bg-accent"
                    disabled={isSubmitting}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.pptx"
                    onChange={handleFileSelect}
                    disabled={isSubmitting}
                    className="hidden"
                  />

                  {browserSupportsSpeechRecognition && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      title={listening ? "Stop recording" : "Speak your prompt"}
                      aria-label={listening ? "Stop recording" : "Start voice input"}
                      className={`h-8 w-8 p-0 rounded-lg transition-colors ${
                        listening
                          ? "text-destructive hover:bg-destructive/10 animate-pulse"
                          : "hover:bg-accent"
                      }`}
                      disabled={isSubmitting}
                      onClick={handleMicClick}
                    >
                      {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  title={listening ? "Submit recording" : "Submit prompt"}
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