import { Search } from "lucide-react"

interface Props {
  value: string
  onChange: (value: string) => void
}

export default function SearchBar({
  value,
  onChange
}: Props) {

  return (
    <div className="relative">

      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

      <input
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder="Cari produk..."
        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

    </div>
  )
}