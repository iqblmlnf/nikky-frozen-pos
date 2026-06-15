import {
  PackageX,
  AlertTriangle
} from "lucide-react"

interface Props {
  lowStockCount: number
  emptyStockCount: number
}

export default function StockStats({

  lowStockCount,
  emptyStockCount

}: Props) {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      {/* LOW STOCK */}
      <div className="bg-white rounded-3xl border border-yellow-100 p-5">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-gray-400">

              Stok Menipis

            </p>

            <h2 className="text-3xl font-bold text-yellow-500 mt-1">

              {lowStockCount}

            </h2>

          </div>

          <div className="w-14 h-14 rounded-2xl bg-yellow-100 flex items-center justify-center">

            <AlertTriangle className="w-7 h-7 text-yellow-500" />

          </div>

        </div>

      </div>

      {/* EMPTY */}
      <div className="bg-white rounded-3xl border border-red-100 p-5">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-gray-400">

              Stok Habis

            </p>

            <h2 className="text-3xl font-bold text-red-600 mt-1">

              {emptyStockCount}

            </h2>

          </div>

          <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center">

            <PackageX className="w-7 h-7 text-red-500" />

          </div>

        </div>

      </div>

    </div>
  )
}