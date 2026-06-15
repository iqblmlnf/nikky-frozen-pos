import {
  AlertTriangle,
  ShieldAlert
} from "lucide-react"

interface Props {
  expiredCount: number
  warningCount: number
}

export default function ExpiryStats({
  expiredCount,
  warningCount
}: Props) {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      {/* EXPIRED */}
      <div className="bg-white rounded-3xl border border-red-100 p-5">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-gray-400">

              Produk Expired

            </p>

            <h2 className="text-3xl font-bold text-red-600 mt-1">

              {expiredCount}

            </h2>

          </div>

          <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center">

            <ShieldAlert className="w-7 h-7 text-red-500" />

          </div>

        </div>

      </div>

      {/* WARNING */}
      <div className="bg-white rounded-3xl border border-yellow-100 p-5">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-gray-400">

              Hampir Expired

            </p>

            <h2 className="text-3xl font-bold text-yellow-500 mt-1">

              {warningCount}

            </h2>

          </div>

          <div className="w-14 h-14 rounded-2xl bg-yellow-100 flex items-center justify-center">

            <AlertTriangle className="w-7 h-7 text-yellow-500" />

          </div>

        </div>

      </div>

    </div>
  )
}