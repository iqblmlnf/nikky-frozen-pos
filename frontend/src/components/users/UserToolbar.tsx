import { Search, Plus } from "lucide-react";

interface Props {
  search: string;

  setSearch: (value: string) => void;

  onAdd: () => void;
}

export default function UserToolbar({ search, setSearch, onAdd }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari pengguna..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={onAdd}
        className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold transition"
      >
        <Plus className="w-4 h-4" />
        Tambah User
      </button>
    </div>
  );
}
