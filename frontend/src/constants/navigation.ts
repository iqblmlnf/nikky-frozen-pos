// navigation.ts

import type { LucideIcon } from "lucide-react";

import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  AlertTriangle,
  Package2,
  BarChart2,
  Users,
  Wifi,
  Receipt,
  ClipboardList,
  Building2,
  Wallet,
  ArrowRightLeft,
} from "lucide-react";

import type { Page, Role } from "../types";

export interface NavItem {
  id: Page;
  label: string;
  icon: LucideIcon;
  roles: Role[];
  badge?: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["owner", "admin_keuangan"],
  },

  {
    id: "pos",
    label: "Kasir / POS",
    icon: ShoppingCart,
    roles: ["owner", "kasir"],
  },

  {
    id: "transactions",
    label: "Transaksi",
    icon: Receipt,
    roles: ["owner", "kasir", "admin_keuangan"],
  },

  {
    id: "products",
    label: "Produk",
    icon: Package,
    roles: ["owner", "admin_gudang"],
  },

  {
    id: "expiry",
    label: "Kadaluarsa",
    icon: AlertTriangle,
    roles: ["owner", "admin_gudang"],
  },

  {
    id: "stock",
    label: "Stok",
    icon: Package2,
    roles: ["owner", "admin_gudang"],
  },

  {
    id: "finance",
    label: "Keuangan",
    icon: BarChart2,
    roles: ["owner", "admin_keuangan"],
  },

  {
    id: "expenses",
    label: "Pengeluaran",
    icon: Wallet,
    roles: ["owner", "admin_keuangan"],
  },

  {
    id: "users",
    label: "Pengguna",
    icon: Users,
    roles: ["owner"],
  },

  {
    id: "branches",
    label: "Cabang",
    icon: Building2,
    roles: ["owner"],
  },

  {
    id: "audit",
    label: "Audit Trail",
    icon: ClipboardList,
    roles: ["owner"],
  },

  {
    id: "transfer-stock",
    label: "Transfer Stok",
    icon: ArrowRightLeft,
    roles: ["owner", "admin_gudang"],
  },
];
