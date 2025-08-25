"use client";

import { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "destructive" | "success";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const base = "relative inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/70 disabled:opacity-60 disabled:cursor-not-allowed";
const elevations = "shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.18)]";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white hover:from-cyan-400 hover:to-cyan-500 active:scale-[0.98]",
  secondary: "bg-gradient-to-r from-zinc-700 to-zinc-800 text-white hover:from-zinc-600 hover:to-zinc-700",
  ghost: "text-gray-200 hover:text-white hover:bg-white/10",
  outline: "border border-white/20 text-white hover:bg-white/5",
  destructive: "bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-400 hover:to-pink-500",
  success: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-400 hover:to-teal-500",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-base",
  lg: "h-12 px-6 text-lg",
};

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  onClick,
  type = "button",
  className = "",
  fullWidth = false,
  leftIcon,
  rightIcon,
}: ButtonProps) => {
  const width = fullWidth ? "w-full" : "";
  const classes = `${base} ${elevations} ${variants[variant]} ${sizes[size]} ${width} ${className}`;

  return (
    <button type={type} disabled={disabled || loading} onClick={onClick} className={classes}>
      {/* subtle glass overlay */}
      <span className="pointer-events-none absolute inset-0 rounded-xl bg-white/0 hover:bg-white/[0.02] transition-colors" />

      {/* content */}
      <span className="relative z-10 inline-flex items-center gap-2">
        {loading && (
          <span className="inline-flex items-center justify-center">
            <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          </span>
        )}
        {leftIcon && <span className="inline-flex items-center">{leftIcon}</span>}
        <span>{children}</span>
        {rightIcon && <span className="inline-flex items-center">{rightIcon}</span>}
      </span>
    </button>
  );
};
