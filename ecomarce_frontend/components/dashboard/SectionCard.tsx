"use client";

import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SectionCardProps {
  title?: string;
  description?: string;
  Icon?: LucideIcon;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  padded?: boolean;
}

export function SectionCard({
  title,
  description,
  Icon,
  actions,
  children,
  className = "",
  bodyClassName = "",
  padded = true,
}: SectionCardProps) {
  const hasHeader = title || description || actions || Icon;
  return (
    <Card
      className={`border-slate-200 shadow-none rounded-xl overflow-hidden ${className}`}
    >
      {hasHeader && (
        <div className="flex items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-slate-100">
          <div className="flex items-start gap-3 min-w-0">
            {Icon && (
              <div className="h-9 w-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
                <Icon className="h-4 w-4 text-slate-700" />
              </div>
            )}
            <div className="min-w-0">
              {title && (
                <h2 className="text-[15px] font-semibold text-slate-900 leading-tight">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-xs text-slate-500 mt-0.5">{description}</p>
              )}
            </div>
          </div>
          {actions && (
            <div className="flex items-center gap-2 flex-shrink-0">
              {actions}
            </div>
          )}
        </div>
      )}
      <CardContent
        className={
          padded
            ? `p-5 sm:p-6 ${bodyClassName}`
            : `p-0 ${bodyClassName}`
        }
      >
        {children}
      </CardContent>
    </Card>
  );
}
