import {

  Wallet,
  TrendingUp,
  TrendingDown

} from "lucide-react"

import { fmt } from "../../utils/currency"

interface Props {

  revenue: number

  expense: number

  profit: number
}

export default function FinanceStats({

  revenue,
  expense,
  profit

}: Props) {

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

      {/* REVENUE */}
      <div className="bg-white rounded-3xl border border-emerald-100 p-5">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-gray-400">

              Total Pemasukan

            </p>

            <h2 className="text-2xl font-bold text-emerald-600 mt-1">

              {fmt(revenue)}

            </h2>

          </div>

          <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">

            <TrendingUp className="w-7 h-7 text-emerald-500" />

          </div>

        </div>

      </div>

      {/* EXPENSE */}
      <div className="bg-white rounded-3xl border border-red-100 p-5">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-gray-400">

              Pengeluaran

            </p>

            <h2 className="text-2xl font-bold text-red-600 mt-1">

              {fmt(expense)}

            </h2>

          </div>

          <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center">

            <TrendingDown className="w-7 h-7 text-red-500" />

          </div>

        </div>

      </div>

      {/* PROFIT */}
      <div className="bg-white rounded-3xl border border-blue-100 p-5">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-gray-400">

              Profit

            </p>

            <h2 className="text-2xl font-bold text-blue-600 mt-1">

              {fmt(profit)}

            </h2>

          </div>

          <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">

            <Wallet className="w-7 h-7 text-blue-500" />

          </div>

        </div>

      </div>

    </div>
  )
}