import { Search } from "lucide-react";

interface ProductSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function ProductSearch({
  value,
  onChange,
}: ProductSearchProps) {
  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

      <input
        type="text"
        placeholder="Cari produk atau SKU..."
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}