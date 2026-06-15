import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from "recharts";

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

export default function FinanceChart({ data, period, setPeriod }: Props) {
  const totalIncome = data.reduce((sum, item) => sum + item.income, 0);

  const totalExpense = data.reduce((sum, item) => sum + item.expense, 0);

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Cashflow Mingguan</h3>

          <p className="text-sm text-gray-400 mt-1">
            Monitoring pemasukan dan pengeluaran
          </p>
        </div>

        <select
          value={period}
          onChange={(e) => setPeriod(Number(e.target.value))}
          className="px-4 py-2 rounded-xl border border-gray-200"
        >
          <option value={7}>7 Hari</option>
          <option value={30}>30 Hari</option>
          <option value={90}>90 Hari</option>
        </select>
      </div>

      {/* CHART */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <XAxis dataKey="name" />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="income"
              stroke="#10b981"
              fill="#10b98122"
              strokeWidth={3}
            />

            <Area
              type="monotone"
              dataKey="expense"
              stroke="#ef4444"
              fill="#ef444422"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* SUMMARY */}
      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="bg-green-50 rounded-2xl p-5">
          <p className="text-sm text-green-700">Total Pemasukan</p>

          <h4 className="text-2xl font-bold text-green-700 mt-2">
            Rp {totalIncome.toLocaleString("id-ID")}
          </h4>

          <p className="text-xs text-green-600 mt-1">
            Akumulasi periode terpilih
          </p>
        </div>

        <div className="bg-red-50 rounded-2xl p-5">
          <p className="text-sm text-red-700">Total Pengeluaran</p>

          <h4 className="text-2xl font-bold text-red-700 mt-2">
            Rp {totalExpense.toLocaleString("id-ID")}
          </h4>

          <p className="text-xs text-red-600 mt-1">
            Akumulasi periode terpilih
          </p>
        </div>
      </div>
    </div>
  );
}
