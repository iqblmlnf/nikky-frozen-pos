import { fmt } from "../../utils/currency";
import StockStatusBadge from "./StockStatusBadge";

interface StockItem {
  id: number;
  stock: number;

  product: {
    id: number;
    name: string;
    sku: string;
    category: string;
    price: number;
    image: string;
  };

  branch: {
    id: number;
    name: string;
  };
}

interface Props {
  stocks: StockItem[];
  onEdit: (item: StockItem) => void;
}

export default function StockTable({ stocks, onEdit }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/70">
              {[
                "Produk",
                "Kategori",
                "Harga",
                "Stok",
                "Cabang",
                "Status",
                "Aksi",
              ].map((header) => (
                <th
                  key={header}
                  className="text-left px-4 py-3 text-xs font-bold text-gray-500"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {stocks.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-blue-50/30 transition-colors"
              >
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        item.product.image
                          ? `http://localhost:8000/storage/${item.product.image}`
                          : "https://placehold.co/100x100"
                      }
                      alt={item.product.name}
                      className="w-10 h-10 rounded-xl object-cover border border-gray-100"
                    />

                    <div>
                      <p className="font-semibold text-gray-900">
                        {item.product.name}
                      </p>

                      <p className="text-xs text-gray-400">
                        {item.product.sku}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3.5">{item.product.category}</td>

                <td className="px-4 py-3.5 font-bold text-gray-900">
                  {fmt(item.product.price)}
                </td>

                <td className="px-4 py-3.5">
                  <span
                    className={`font-bold ${
                      item.stock <= 10 ? "text-red-600" : "text-gray-900"
                    }`}
                  >
                    {item.stock}
                  </span>
                </td>

                <td className="px-4 py-3.5 text-gray-600">
                  {item.branch?.name}
                </td>

                <td className="px-4 py-3.5">
                  <StockStatusBadge stock={item.stock} />
                </td>

                <td className="px-4 py-3.5">
                  <button
                    onClick={() => onEdit(item)}
                    className="
                      px-3
                      py-1
                      rounded-lg
                      bg-blue-500
                      text-white
                      hover:bg-blue-600
                      text-xs
                      font-medium
                    "
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
