import {

  Users,
  UserCheck

} from "lucide-react"

interface Props {

  total: number

  active: number
}

export default function UserStats({

  total,
  active

}: Props) {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      {/* TOTAL */}
      <div className="bg-white rounded-3xl border border-gray-100 p-5">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-gray-400">

              Total Pengguna

            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-1">

              {total}

            </h2>

          </div>

          <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">

            <Users className="w-7 h-7 text-blue-500" />

          </div>

        </div>

      </div>

      {/* ACTIVE */}
      <div className="bg-white rounded-3xl border border-emerald-100 p-5">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-gray-400">

              Pengguna Aktif

            </p>

            <h2 className="text-3xl font-bold text-emerald-600 mt-1">

              {active}

            </h2>

          </div>

          <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">

            <UserCheck className="w-7 h-7 text-emerald-500" />

          </div>

        </div>

      </div>

    </div>
  )
}