/**
 * Modal Form Wrapper Template
 * Provides consistent modal form styling and layout
 */

import React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ModalFormWrapperProps {
  title: string
  description?: string
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  onSubmit?: () => void | Promise<void>
  submitLabel?: string
  cancelLabel?: string
  isLoading?: boolean
}

export const ModalFormWrapper: React.FC<ModalFormWrapperProps> = ({
  title,
  description,
  isOpen,
  onClose,
  children,
  onSubmit,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  isLoading = false,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="py-4 space-y-4">{children}</div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </Button>
          {onSubmit && (
            <Button onClick={onSubmit} disabled={isLoading}>
              {isLoading ? "Loading..." : submitLabel}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ModalFormWrapper
