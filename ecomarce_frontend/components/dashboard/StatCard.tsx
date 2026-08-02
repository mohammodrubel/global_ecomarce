"use client";

import { LucideIcon, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  Icon: LucideIcon;
  change?: string;
  changeDirection?: "up" | "down" | "neutral";
  hint?: string;
}

export function StatCard({
  title,
  value,
  Icon,
  change,
  changeDirection = "neutral",
  hint,
}: StatCardProps) {
  const deltaCls =
    changeDirection === "up"
      ? "bg-emerald-50 text-emerald-700"
      : changeDirection === "down"
      ? "bg-red-50 text-red-700"
      : "bg-slate-100 text-slate-600";

  return (
    <Card className="border-slate-200 shadow-none rounded-xl hover:border-slate-300 transition-colors">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="h-10 w-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
            <Icon className="h-4 w-4 text-slate-700" />
          </div>
          {change && (
            <div
              className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${deltaCls}`}
            >
              {changeDirection === "up" && <TrendingUp className="h-3 w-3" />}
              {changeDirection === "down" && <TrendingDown className="h-3 w-3" />}
              {change}
            </div>
          )}
        </div>
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <p className="text-[26px] leading-tight font-semibold text-slate-900 mt-1 tracking-tight">
          {value}
        </p>
        {hint && <p className="text-xs text-slate-400 mt-1.5">{hint}</p>}
      </CardContent>
    </Card>
  );
}
