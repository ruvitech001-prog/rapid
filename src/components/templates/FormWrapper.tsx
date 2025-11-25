/**
 * Form Wrapper Template
 * Provides consistent form styling and layout for all forms
 */

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface FormWrapperProps {
  title: string
  description?: string
  children: React.ReactNode
  onSubmit?: (e: React.FormEvent) => void
  submitLabel?: string
  isLoading?: boolean
  actionButtons?: React.ReactNode
}

export const FormWrapper: React.FC<FormWrapperProps> = ({
  title,
  description,
  children,
  onSubmit,
  submitLabel = "Submit",
  isLoading = false,
  actionButtons,
}) => {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          {children}

          {/* Action Buttons */}
          {actionButtons ? (
            <div className="flex gap-4 justify-end">{actionButtons}</div>
          ) : null}
        </form>
      </CardContent>
    </Card>
  )
}

export default FormWrapper
