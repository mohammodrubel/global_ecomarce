"use client";

import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  eyebrow?: ReactNode;
}

export function PageHeader({
  title,
  description,
  actions,
  eyebrow,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between pb-4 sm:pb-5 border-b border-slate-200">
      <div className="min-w-0">
        {eyebrow && (
          <div className="text-xs font-medium text-slate-500 mb-1.5 flex items-center gap-1.5">
            {eyebrow}
          </div>
        )}
        <h1 className="text-2xl sm:text-[28px] font-semibold tracking-tight text-slate-900 leading-tight">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-slate-500 mt-1">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {actions}
        </div>
      )}
    </div>
  );
}
