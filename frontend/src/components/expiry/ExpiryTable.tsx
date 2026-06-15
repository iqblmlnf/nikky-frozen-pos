import { daysFromNow } from "../../utils/date";
import { fmt } from "../../utils/currency";
import ExpiryStatusBadge from "./ExpiryStatusBadge";

import type { Product } from "../../types/product";

interface Props {
  products: Product[];
}

export default function ExpiryTable({ products }: Props) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {[
                "Produk",
                "Kategori",
                "Harga",
                "Stok",
                "Kadaluarsa",
                "Status",
              ].map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-left text-xs uppercase tracking-wider text-gray-400 font-bold whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {products.map((product) => {
              const days = daysFromNow(product.expiry);

              return (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* PRODUCT */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={`http://localhost:8000/storage/${product.image}`}
                        alt={product.name}
                        className="w-12 h-12 rounded-xl object-cover border"
                      />

                      <div>
                        <p className="font-bold text-gray-900">
                          {product.name}
                        </p>

                        <p className="text-xs text-gray-400">{product.sku}</p>
                      </div>
                    </div>
                  </td>

                  {/* CATEGORY */}
                  <td className="px-4 py-3 text-gray-500">
                    {product.category}
                  </td>

                  {/* PRICE */}
                  <td className="px-4 py-3 font-semibold text-blue-600">
                    {fmt(Number(product.price))}
                  </td>

                  {/* STOCK */}
                  <td className="px-4 py-3">{product.stock}</td>

                  {/* EXPIRY */}
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-700">
                        {product.expiry}
                      </p>

                      <p className="text-xs text-gray-400 mt-0.5">
                        {days < 0
                          ? `${Math.abs(days)} hari lalu`
                          : `${days} hari lagi`}
                      </p>
                    </div>
                  </td>

                  {/* STATUS */}
                  <td className="px-4 py-3">
                    <ExpiryStatusBadge days={days} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
