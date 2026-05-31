"use client"

import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { PendingAction } from "@/services/ai/prompt-resolver"

interface ReviewerConfirmDialogProps {
  pendingAction: PendingAction | null
  message: string
  isConfirming: boolean
  onConfirm: () => void
  onCancel: () => void
}

const DIALOG_TITLES: Record<PendingAction["type"], string> = {
  createReviewer: "Create reviewer",
  deleteReviewer: "Delete reviewer",
  openReviewer: "Open reviewer",
}

const ACTION_LABELS: Record<PendingAction["type"], string> = {
  createReviewer: "Create",
  deleteReviewer: "Delete",
  openReviewer: "Open",
}

export function ReviewerConfirmDialog({
  pendingAction,
  message,
  isConfirming,
  onConfirm,
  onCancel,
}: ReviewerConfirmDialogProps) {
  const [open, setOpen] = useState(false)
  const isDestructive = pendingAction?.type === "deleteReviewer"

  useEffect(() => {
    if (pendingAction) {
      setOpen(true)
    }
  }, [pendingAction])

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && !isConfirming) {
      onCancel()
    }
    setOpen(nextOpen)
  }

  const handleConfirmClick = () => {
    setOpen(false)
    onConfirm()
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {pendingAction ? DIALOG_TITLES[pendingAction.type] : ""}
          </AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} disabled={isConfirming}>
            Cancel
          </AlertDialogCancel>
          <Button
            onClick={handleConfirmClick}
            disabled={isConfirming}
            className={
              isDestructive
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : undefined
            }
          >
            {isConfirming ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : pendingAction ? (
              ACTION_LABELS[pendingAction.type]
            ) : null}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}