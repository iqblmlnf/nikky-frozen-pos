// src/components/dashboard/RevenueChartCard.tsx

import { RevenueChart } from "../charts";

interface RevenueData {
  day: string;
  revenue: number;
  orders: number;
}

interface RevenueChartCardProps {
  data: RevenueData[];
  formatCurrency: (value: number) => string;
  totalRevenue: number;

  period: number;
  setPeriod: (value: number) => void;
}

export function RevenueChartCard({
  data,
  formatCurrency,
  totalRevenue,
  period,
  setPeriod,
}: RevenueChartCardProps) {
  return (
    <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">Revenue Penjualan</h3>

          <p className="text-sm text-gray-500">Total Pendapatan</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-gray-400">Total Revenue</p>

            <p className="font-bold text-emerald-600 text-lg">
              {formatCurrency(totalRevenue)}
            </p>
          </div>

          <select
            value={period}
            onChange={(e) => setPeriod(Number(e.target.value))}
            className="
        px-4 py-2
        rounded-xl
        border border-gray-200
        bg-white
        text-sm
        font-medium
      "
          >
            <option value={7}>7 Hari</option>
            <option value={30}>30 Hari</option>
            <option value={90}>90 Hari</option>
          </select>
        </div>
      </div>

      <RevenueChart data={data} formatCurrency={formatCurrency} />
    </div>
  );
}
