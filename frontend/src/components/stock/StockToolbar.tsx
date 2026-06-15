import { Search } from "lucide-react";

interface Props {
  search: string;
  setSearch: (value: string) => void;
}

export default function StockToolbar({ search, setSearch }: Props) {
  return (
    <div className="flex flex-col md:flex-row gap-3">
      <div className="relative flex-1">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari produk atau SKU..."
          className="
            w-full
            h-11
            pl-11
            pr-4
            rounded-2xl
            border
            border-gray-200
            bg-white
            text-sm
            outline-none
            focus:ring-2
            focus:ring-blue-500/20
            focus:border-blue-500
          "
        />
      </div>
    </div>
  );
}
