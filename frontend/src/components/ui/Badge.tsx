// src/components/ui/Badge.tsx

import React from "react";
import { cn } from "../../lib/cn";

export type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "blue"
  | "cyan"
  | "purple";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

export function Badge({
  children,
  variant = "default",
}: BadgeProps) {
  const v: Record<BadgeVariant, string> = {
    default: "bg-gray-100 text-gray-600",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
    blue: "bg-blue-600 text-white",
    cyan: "bg-cyan-500 text-white",
    purple: "bg-purple-100 text-purple-700",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
        v[variant]
      )}
    >
      {children}
    </span>
  );
}