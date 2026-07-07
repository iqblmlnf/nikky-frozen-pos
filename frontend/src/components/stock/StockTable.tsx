import { storageUrl } from "../../lib/api";
import type { Stock } from "../../types/stock";

interface Props {
  stocks: Stock[];
  onEdit: (item: Stock) => void;
}

export default function StockTable({
  stocks,
  onEdit,
}: Props) {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const isOwner = user.role === "owner";

  const maxStock = Math.max(
    ...stocks.map((s) => s.stock),
    1,
  );

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-bold text-gray-900">
          Level Stok Produk
        </h3>
      </div>

      <div className="divide-y divide-gray-50">
        {stocks.map((item) => {
          const pct = Math.round(
            (item.stock / maxStock) * 100,
          );

          const isLow = item.stock <= 10;

          return (
            <div
              key={item.id}
              className="
                flex
                items-center
                gap-4
                px-4
                py-4
                hover:bg-gray-50
                transition-colors
              "
            >
              <img
                src={
                  item.product.image
                    ? storageUrl(item.product.image)
                    : "https://placehold.co/100x100"
                }
                alt={item.product.name}
                className="
                  w-12
                  h-12
                  rounded-xl
                  object-cover
                  border
                  border-gray-100
                "
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-bold text-gray-900">
                      {item.product.name}
                    </p>

                    <p className="text-xs text-gray-400">
                      {item.branch?.name}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {isLow && (
                      <span
                        className="
                          text-[10px]
                          font-bold
                          bg-red-50
                          text-red-600
                          px-2
                          py-1
                          rounded-lg
                        "
                      >
                        MENIPIS
                      </span>
                    )}

                    <span
                      className={`font-bold ${
                        isLow
                          ? "text-red-600"
                          : "text-gray-900"
                      }`}
                    >
                      {item.stock}
                    </span>

                    <span className="text-xs text-gray-400">
                      unit
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isLow
                          ? "bg-red-500"
                          : "bg-gradient-to-r from-blue-600 to-cyan-500"
                      }`}
                      style={{
                        width: `${pct}%`,
                      }}
                    />
                  </div>

                  <span className="text-xs text-gray-400 w-10 text-right">
                    {pct}%
                  </span>
                </div>
              </div>

              {!isOwner && (
                <button
                  onClick={() => onEdit(item)}
                  className="
                    px-3
                    py-2
                    rounded-xl
                    bg-blue-600
                    text-white
                    text-xs
                    font-semibold
                    hover:bg-blue-700
                  "
                >
                  Edit
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}