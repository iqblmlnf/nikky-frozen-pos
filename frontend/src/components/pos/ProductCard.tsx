import { storageUrl } from "../../lib/api";
import { Plus } from "lucide-react";

import type { Product } from "../../types/product";

interface Props {
  product: Product;
  onAdd: (product: Product) => void;
}

export default function ProductCard({ product, onAdd }: Props) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* IMAGE */}
      <div className="h-32 rounded-2xl overflow-hidden bg-gray-100">
        {product.image ? (
          <img
            src={storageUrl(product.image)}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="space-y-1 mt-3">
        <h3 className="font-bold text-gray-900 leading-tight">
          {product.name}
        </h3>

        <p className="text-xs text-gray-500">{product.category}</p>

        <div className="flex items-center justify-between pt-2">
          <span className="font-bold text-blue-600">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              maximumFractionDigits: 0,
            }).format(product.price)}
          </span>

          <button
            onClick={() => onAdd(product)}
            className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
