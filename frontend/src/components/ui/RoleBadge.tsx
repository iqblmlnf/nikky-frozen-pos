// src/components/ui/RoleBadge.tsx

import { Badge } from "./Badge";
import type { BadgeVariant } from "./Badge";

interface RoleBadgeProps {
  role: string;
}

export function RoleBadge({
  role,
}: RoleBadgeProps) {
  const cfg: Record<
    string,
    {
      label: string;
      variant: BadgeVariant;
    }
  > = {
    owner: {
      label: "Owner",
      variant: "blue",
    },

    kasir: {
      label: "Kasir",
      variant: "cyan",
    },

    admin_gudang: {
      label: "Admin Gudang",
      variant: "info",
    },

    admin_keuangan: {
      label: "Admin Keuangan",
      variant: "purple",
    },
  };

  const c = cfg[role] ?? {
    label: role,
    variant: "default",
  };

  return (
    <Badge variant={c.variant}>
      {c.label}
    </Badge>
  );
}