import React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const cardVariants = cva("rounded-md border bg-card text-card-foreground shadow-sm", {
  variants: {
    variant: {
      default: "border",
      destructive: "border-destructive/50 dark:border-destructive [&:has([role=alert])]:border-destructive",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

const cardHeaderVariants = cva("flex flex-col space-y-1.5 p-6", {
  variants: {
    inset: {
      true: "pt-0",
    },
  },
  defaultVariants: {
    inset: false,
  },
})

export interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(cardVariants({ variant }), className)} {...props} />
))
Card.displayName = "Card"

export { Card, cardVariants }

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardHeaderVariants> {}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(({ className, inset, ...props }, ref) => (
  <div ref={ref} className={cn(cardHeaderVariants({ inset }), className)} {...props} />
))
CardHeader.displayName = "CardHeader"

export { CardHeader }

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 {...props} className={cn("text-lg font-semibold leading-none tracking-tight", className)} ref={ref} />
  ),
)
CardTitle.displayName = "CardTitle"

export { CardTitle }

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p className={cn("text-sm text-muted-foreground", className)} ref={ref} {...props} />
  ),
)
CardDescription.displayName = "CardDescription"

export { CardDescription }

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div className={cn("p-6 pt-0", className)} ref={ref} {...props} />,
)
CardContent.displayName = "CardContent"

export { CardContent }

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div className={cn("flex items-center p-6 pt-0", className)} ref={ref} {...props} />
  ),
)
CardFooter.displayName = "CardFooter"

export { CardFooter }
