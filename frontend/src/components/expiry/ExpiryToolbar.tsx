import { Search } from "lucide-react"

interface Props {

  search: string

  setSearch: (
    value: string
  ) => void

  status: string

  setStatus: (
    value: string
  ) => void
}

export default function ExpiryToolbar({

  search,
  setSearch,

  status,
  setStatus

}: Props) {

  return (
    <div className="flex flex-col lg:flex-row gap-3">

      {/* SEARCH */}
      <div className="relative flex-1">

        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

        <input
          value={search}

          onChange={e =>
            setSearch(
              e.target.value
            )
          }

          placeholder="Cari produk..."

          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

      </div>

      {/* FILTER */}
      <select
        value={status}

        onChange={e =>
          setStatus(
            e.target.value
          )
        }

        className="px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >

        <option>
          Semua
        </option>

        <option>
          Expired
        </option>

        <option>
          Hampir Expired
        </option>

        <option>
          Aman
        </option>

      </select>

    </div>
  )
}