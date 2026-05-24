"use client"

import { useState } from "react"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { ChatUpload } from "@/components/chat-upload"

export function FloatingAIButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-md shadow-primary/30 bg-primary hover:bg-primary/90 hover:shadow-primary/50 hover:scale-105 transition-all duration-200 p-0"
        aria-label="Open AI Assistant"
      >
        <Sparkles className="h-6 w-6 text-primary-foreground" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl gap-0 pb-0">
          <DialogHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-lg">AI Assistant</DialogTitle>
                <DialogDescription className="text-sm">
                  I can open, create, and delete reviewers for you. Just type or speak your concern in any language.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <ChatUpload
            placeholder="What do you want to do?"
            onSuccess={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
