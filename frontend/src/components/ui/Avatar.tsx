// src/components/ui/Avatar.tsx

import { cn } from "../../lib/cn";

interface AvatarProps {
  initials: string;
  size?: "sm" | "md" | "lg";
}

export function Avatar({
  initials,
  size = "sm",
}: AvatarProps) {
  const s: Record<string, string> = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  return (
    <div
      className={cn(
        "rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center font-bold flex-shrink-0",
        s[size]
      )}
    >
      {initials}
    </div>
  );
}