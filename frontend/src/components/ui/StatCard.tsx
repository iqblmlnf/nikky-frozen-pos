import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

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
    | "red"
    | "violet"
    | "rose"
    | "emerald";

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
  const colors = {
    blue: {
      icon: "bg-blue-100 text-blue-600",
      border: "bg-blue-500",
    },

    cyan: {
      icon: "bg-cyan-100 text-cyan-600",
      border: "bg-cyan-500",
    },

    green: {
      icon: "bg-green-100 text-green-600",
      border: "bg-green-500",
    },

    amber: {
      icon: "bg-amber-100 text-amber-600",
      border: "bg-amber-500",
    },

    red: {
      icon: "bg-red-100 text-red-600",
      border: "bg-red-500",
    },

    violet: {
      icon: "bg-violet-100 text-violet-600",
      border: "bg-violet-500",
    },

    rose: {
      icon: "bg-rose-100 text-rose-600",
      border: "bg-rose-500",
    },

    emerald: {
      icon: "bg-emerald-100 text-emerald-600",
      border: "bg-emerald-500",
    },
  };

  return (
    <div
      className="
      relative
      overflow-hidden
      bg-white
      rounded-3xl
      border
      border-slate-100
      shadow-sm
      hover:shadow-xl
      hover:-translate-y-1
      transition-all
      duration-300
      p-6
    "
    >
      {/* TOP BORDER */}
      <div
        className={cn("absolute top-0 left-0 w-full h-1", colors[color].border)}
      />

      <div className="flex items-start justify-between mb-5">
        <div
          className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center",
            colors[color].icon,
          )}
        >
          {icon}
        </div>

        {trend && (
          <span
            className={cn(
              "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full",
              trend.up
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-600",
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

      <h3 className="text-4xl font-black tracking-tight text-slate-900">
        {value}
      </h3>

      <p className="text-base font-semibold text-slate-700 mt-2">{title}</p>

      {sub && <p className="text-sm text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}
