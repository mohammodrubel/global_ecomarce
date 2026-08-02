"use client";

import { LucideIcon } from "lucide-react";

type Tone =
  | "success"
  | "warning"
  | "error"
  | "info"
  | "neutral"
  | "primary"
  | "indigo";

const toneStyle: Record<Tone, string> = {
  success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  warning: "bg-amber-50 text-amber-700 ring-amber-200",
  error: "bg-red-50 text-red-700 ring-red-200",
  info: "bg-sky-50 text-sky-700 ring-sky-200",
  neutral: "bg-slate-50 text-slate-700 ring-slate-200",
  primary: "bg-blue-50 text-blue-700 ring-blue-200",
  indigo: "bg-indigo-50 text-indigo-700 ring-indigo-200",
};

interface StatusBadgeProps {
  tone?: Tone;
  Icon?: LucideIcon;
  children: React.ReactNode;
  size?: "sm" | "md";
}

export function StatusBadge({
  tone = "neutral",
  Icon,
  children,
  size = "sm",
}: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full ring-1 font-medium ${
        toneStyle[tone]
      } ${size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"}`}
    >
      {Icon && <Icon className="h-3 w-3" />}
      {children}
    </span>
  );
}
