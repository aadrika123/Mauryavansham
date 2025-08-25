"use client"

import { useToast } from "@/src/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/src/components/ui/toast"
import { cn } from "@/src/lib/utils"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, ...props }) {
        // Variant ke hisaab se title aur color
        let variantColor = "bg-gray-800 text-white"
        if (title === "Success") variantColor = "bg-green-600 text-white"
        if (title === "Error") variantColor = "bg-red-600 text-white"
        if (title === "Warning") variantColor = "bg-yellow-600 text-black"
        if (title === "Info") variantColor = "bg-blue-600 text-white"

        return (
          <Toast
            key={id}
            {...props}
            className={cn(
              "flex items-start gap-2 p-4 rounded-lg shadow-lg",
              variantColor
            )}
          >
            <div className="grid gap-1">
              {/* Variant ko title ke tarah dikhayenge */}
              {title && (
                <ToastTitle className="capitalize font-semibold">
                  {title}
                </ToastTitle>
              )}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            <ToastClose />
          </Toast>
        )
      })}

      {/* Toast ko top-right corner pe fix kar diya */}
      <ToastViewport className="fixed top-4 right-4 z-[9999]" />
    </ToastProvider>
  )
}
