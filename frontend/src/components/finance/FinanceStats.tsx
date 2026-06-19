import { DollarSign, Activity, BarChart2, CheckCircle } from "lucide-react";

import { StatCard } from "../ui";
import { fmt } from "../../utils/currency";

interface Props {
  revenue: number;
  todayRevenue: number;
  avgTransaction: number;
  totalTransactions: number;
}

export default function FinanceStats({
  revenue,
  todayRevenue,
  avgTransaction,
  totalTransactions,
}: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Revenue Bulan Ini"
        value={fmt(revenue)}
        sub="30 Hari Terakhir"
        icon={<DollarSign className="w-5 h-5" />}
        color="blue"
        trend={{
          label: "+6%",
          up: true,
        }}
      />

      <StatCard
        title="Revenue Hari Ini"
        value={fmt(todayRevenue)}
        sub="Hari Ini"
        icon={<Activity className="w-5 h-5" />}
        color="cyan"
        trend={{
          label: "+15%",
          up: true,
        }}
      />

      <StatCard
        title="Rata-rata Transaksi"
        value={fmt(avgTransaction)}
        sub="Per Transaksi"
        icon={<BarChart2 className="w-5 h-5" />}
        color="green"
        trend={{
          label: "+3%",
          up: true,
        }}
      />

      <StatCard
        title="Total Transaksi"
        value={totalTransactions.toLocaleString("id-ID")}
        sub="30 Hari Terakhir"
        icon={<CheckCircle className="w-5 h-5" />}
        color="amber"
        trend={{
          label: "+22%",
          up: true,
        }}
      />
    </div>
  );
}
