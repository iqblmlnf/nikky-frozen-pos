import {
  AlertTriangle,
  Package2,
  DollarSign,
  ShoppingCart,
} from "lucide-react";

import { StatCard } from "../ui";

interface DashboardStatsProps {
  totalProducts: number;
  expiringCount: number;
  lowStockCount: number;
  todayRevenue: number;
}

export function DashboardStats({
  totalProducts,
  expiringCount,
  lowStockCount,
  todayRevenue,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Produk"
        value={String(totalProducts)}
        sub="Produk terdaftar"
        icon={<Package2 className="w-5 h-5" />}
        color="blue"
        trend={{
          label: "Aktif",
          up: true,
        }}
      />

      <StatCard
        title="Pendapatan Hari Ini"
        value={new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0,
        }).format(todayRevenue)}
        sub="Penjualan hari ini"
        icon={<DollarSign className="w-5 h-5" />}
        color="green"
        trend={{
          label: "Realtime",
          up: true,
        }}
      />

      <StatCard
        title="Produk Kadaluarsa"
        value={String(expiringCount)}
        sub="≤ 7 hari ke depan"
        icon={<AlertTriangle className="w-5 h-5" />}
        color="amber"
        trend={{
          label: "Perlu Aksi",
          up: false,
        }}
      />

      <StatCard
        title="Stok Menipis"
        value={String(lowStockCount)}
        sub="< 10 unit tersisa"
        icon={<ShoppingCart className="w-5 h-5" />}
        color="red"
        trend={{
          label: "Segera Restock",
          up: false,
        }}
      />
    </div>
  );
}
  