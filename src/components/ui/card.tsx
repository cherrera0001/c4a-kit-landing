import { ReactNode } from "react";

interface CardProps {
  className?: string;
  children: ReactNode;
}

export function Card({ className = "", children }: CardProps) {
  return <div className={`rounded-2xl shadow-md p-4 ${className}`}>{children}</div>;
}

export function CardContent({ className = "", children }: CardProps) {
  return <div className={className}>{children}</div>;
}
