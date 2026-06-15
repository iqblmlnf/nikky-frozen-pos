// src/components/ui/StatCard.tsx

import React from "react";
import {
  TrendingUp,
  TrendingDown,
} from "lucide-react";

import { cn } from "../../lib/cn";

interface StatCardProps {
  title: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;

  color?:
    | "blue"
    | "cyan"
    | "green"
    | "amber"
    | "red";

  trend?: {
    label: string;
    up: boolean;
  };
}

export function StatCard({
  title,
  value,
  sub,
  icon,
  color = "blue",
  trend,
}: StatCardProps) {
  const bg: Record<string, string> = {
    blue: "bg-blue-600",
    cyan: "bg-cyan-500",
    green: "bg-emerald-500",
    amber: "bg-amber-500",
    red: "bg-red-500",
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            "p-2.5 rounded-xl text-white shadow-sm",
            bg[color]
          )}
        >
          {icon}
        </div>

        {trend && (
          <span
            className={cn(
              "flex items-center gap-1 text-xs font-semibold",
              trend.up
                ? "text-emerald-600"
                : "text-red-500"
            )}
          >
            {trend.up ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}

            {trend.label}
          </span>
        )}
      </div>

      <p className="text-2xl font-bold text-gray-900 mb-0.5">
        {value}
      </p>

      <p className="text-sm text-gray-500 font-medium">
        {title}
      </p>

      {sub && (
        <p className="text-xs text-gray-400 mt-1">
          {sub}
        </p>
      )}
    </div>
  );
}