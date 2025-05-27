import type React from "react"
import { cn } from "@/lib/utils"

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Spinner({ className, ...props }: SpinnerProps) {
  return (
    <div className={cn("animate-spin rounded-full border-t-2 border-primary", className)} {...props}>
      <span className="sr-only">Cargando...</span>
    </div>
  )
}
