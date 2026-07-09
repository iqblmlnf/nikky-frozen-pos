import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { fmt } from "../../utils/currency";

interface FinanceChartItem {
  name: string;
  income: number;
  expense: number;
}

interface Props {
  data: FinanceChartItem[];
  period: number;
  setPeriod: (value: number) => void;
}

function RevenueTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-xl p-3 text-xs">
      <p className="font-bold text-gray-700 mb-1">{label}</p>

      <p className="text-blue-600 font-bold">{fmt(payload[0].value)}</p>
    </div>
  );
}

export default function FinanceChart({ data, period, setPeriod }: Props) {
  return (
    <div
      className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-100 shadow-sm p-5">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
        <div>
          <h3 className="font-bold text-gray-900">Revenue Penjualan</h3>

          <p className="text-xs text-gray-400 mt-0.5">
            Grafik pendapatan berdasarkan periode
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(Number(e.target.value))}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm"
          >
            <option value={7}>7 Hari</option>

            <option value={30}>30 Hari</option>

            <option value={90}>90 Hari</option>
          </select>
        </div>
      </div>

      {/* CHART */}

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#F1F5F9"
            vertical={false}
          />

          <XAxis dataKey="name" axisLine={false} tickLine={false} />

          <YAxis
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${(v / 1000000).toFixed(1)}Jt`}
          />

          <Tooltip content={<RevenueTooltip />} />

          <Line
            type="monotone"
            dataKey="income"
            stroke="#1565C0"
            strokeWidth={3}
            name="Pemasukan"
          />

          <Line
            type="monotone"
            dataKey="expense"
            stroke="#DC2626"
            strokeWidth={3}
            name="Pengeluaran"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
