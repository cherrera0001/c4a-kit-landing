import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  variant?: "outline" | "default";
  children: React.ReactNode;
}

export function Button({ className = "", variant = "default", ...props }: ButtonProps) {
  const baseStyle = "rounded-xl px-4 py-2 font-medium transition";
  const variantStyle =
    variant === "outline"
      ? "border border-emerald-400 text-emerald-400 hover:bg-emerald-900/20"
      : "bg-emerald-500 hover:bg-emerald-600 text-white";

  return (
    <button className={`${baseStyle} ${variantStyle} ${className}`} {...props}>
      {props.children}
    </button>
  );
}
