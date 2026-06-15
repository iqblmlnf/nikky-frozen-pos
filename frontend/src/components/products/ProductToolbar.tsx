import { Plus, Search } from "lucide-react"

interface Props {
  search: string
  setSearch: (value: string) => void

  category: string
  setCategory: (value: string) => void

  categories: string[]

  onAdd: () => void
}

export default function ProductToolbar({
  search,
  setSearch,
  category,
  setCategory,
  categories,
  onAdd,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">

      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Cari produk atau SKU..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm"
        />
      </div>

      <select
        value={category}
        onChange={e => setCategory(e.target.value)}
        className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm"
      >
        {categories.map(c => (
          <option key={c}>{c}</option>
        ))}
      </select>

      <button
        onClick={onAdd}
        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold"
      >
        <Plus className="w-4 h-4" />
        Tambah Produk
      </button>

    </div>
  )
}