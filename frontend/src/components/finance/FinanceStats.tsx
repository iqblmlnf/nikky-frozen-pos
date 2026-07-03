import {
  DollarSign,
  Activity,
  BarChart2,
  CheckCircle,
  Wallet,
  TrendingUp,
} from "lucide-react";

import { StatCard } from "../ui";
import { fmt } from "../../utils/currency";

interface Props {
  revenue: number;
  expense: number;
  profit: number;
  todayRevenue: number;
  avgTransaction: number;
  totalTransactions: number;
}

export default function FinanceStats({
  revenue,
  expense,
  profit,
  todayRevenue,
  avgTransaction,
  totalTransactions,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      <StatCard
        title="Revenue Bulan Ini"
        value={fmt(revenue)}
        sub="30 Hari Terakhir"
        icon={<DollarSign className="w-6 h-6" />}
        color="blue"
        trend={{
          label: "+12%",
          up: true,
        }}
      />

      <StatCard
        title="Revenue Hari Ini"
        value={fmt(todayRevenue)}
        sub="Hari Ini"
        icon={<Activity className="w-6 h-6" />}
        color="cyan"
        trend={{
          label: "+8%",
          up: true,
        }}
      />

      <StatCard
        title="Total Pengeluaran"
        value={fmt(expense)}
        sub="30 Hari Terakhir"
        icon={<Wallet className="w-6 h-6" />}
        color="rose"
        trend={{
          label: "-4%",
          up: false,
        }}
      />

      <StatCard
        title="Profit Bersih"
        value={fmt(profit)}
        sub="Revenue - Pengeluaran"
        icon={<TrendingUp className="w-6 h-6" />}
        color="emerald"
        trend={{
          label: "+18%",
          up: true,
        }}
      />

      <StatCard
        title="Rata-rata Transaksi"
        value={fmt(avgTransaction)}
        sub="Per Transaksi"
        icon={<BarChart2 className="w-6 h-6" />}
        color="amber"
        trend={{
          label: "+5%",
          up: true,
        }}
      />

      <StatCard
        title="Total Transaksi"
        value={totalTransactions.toLocaleString("id-ID")}
        sub="30 Hari Terakhir"
        icon={<CheckCircle className="w-6 h-6" />}
        color="violet"
        trend={{
          label: "+22%",
          up: true,
        }}
      />
    </div>
  );
}
