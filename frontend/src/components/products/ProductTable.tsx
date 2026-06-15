import ProductRow from "./ProductRow";

import type { Product } from "../../types";

interface Props {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ProductTable({ products, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/70">
              {[
                "Produk",
                "SKU",
                "Kategori",
                "Harga",
                "Distribusi Stok",
                "Kadaluarsa",
                "Status",
                "",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 text-xs font-bold text-gray-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {products.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
