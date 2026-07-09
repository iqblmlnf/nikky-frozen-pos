import { Plus, Search } from "lucide-react"

interface Props {
  search: string
  setSearch: (value: string) => void

  category: string
  setCategory: (value: string) => void

  categories: string[]

  sortBy: string
  setSortBy: (value: string) => void

  stockFilter: string
  setStockFilter: (value: string) => void

  onAdd: () => void
}

export default function ProductToolbar({
  search,
  setSearch,
  category,
  setCategory,
  categories,
  sortBy,
  setSortBy,
  stockFilter,
  setStockFilter,
  onAdd,
}: Props) {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const isOwner = user.role === "owner";

  return (
    <div className="flex flex-col lg:flex-row gap-3">

      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Cari produk atau SKU..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm"
        />
      </div>

      <div className="flex flex-wrap sm:flex-nowrap gap-2">
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm min-w-[120px]"
        >
          {categories.map(c => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <select
          value={stockFilter}
          onChange={e => setStockFilter(e.target.value)}
          className="px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm min-w-[140px]"
        >
          <option value="all">Semua Status Stok</option>
          <option value="low">Stok Menipis (≤ 10)</option>
          <option value="empty">Stok Habis (0)</option>
        </select>

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm min-w-[145px]"
        >
          <option value="default">Default (Nama A-Z)</option>
          <option value="price_desc">Harga Tertinggi</option>
          <option value="price_asc">Harga Terendah</option>
          <option value="stock_desc">Stok Terbanyak</option>
          <option value="stock_asc">Stok Tersedikit</option>
        </select>

        {!isOwner && (
          <button
            onClick={onAdd}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold whitespace-nowrap flex-1 sm:flex-initial"
          >
            <Plus className="w-4 h-4" />
            Tambah Produk
          </button>
        )}
      </div>

    </div>
  )
}