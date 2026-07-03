import { storageUrl } from "../../lib/api";
import { cn } from "../../lib/cn";

interface Product {
  id: number;
  name: string;
  image: string;
  branch: string;
  expiry: string;
}

interface ExpiryProductListProps {
  products: Product[];
  daysUntilExpiry: (date: string) => number;
}

export function ExpiryProductList({
  products,
  daysUntilExpiry,
}: ExpiryProductListProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900">Alert Kadaluarsa</h3>

        <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
          {products.length} Produk
        </span>
      </div>

      <div className="space-y-2.5">
        {products.map((product) => {
          const days = daysUntilExpiry(product.expiry);

          const isExpired = days < 0;

          return (
            <div
              key={product.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border",
                isExpired
                  ? "bg-red-50 border-red-200"
                  : days <= 3
                    ? "bg-orange-50 border-orange-200"
                    : "bg-amber-50 border-amber-200",
              )}
            >
              <img
                src={storageUrl(product.image)}
                alt={product.name}
                className="w-12 h-12 rounded-xl object-cover border border-gray-200"
              />

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {product.name}
                </p>

                <p className="text-xs text-gray-500">{product.branch}</p>
              </div>

              <div className="text-right flex-shrink-0">
                <p
                  className={cn(
                    "text-xs font-bold",
                    isExpired
                      ? "text-red-600"
                      : days <= 3
                        ? "text-orange-600"
                        : "text-amber-600",
                  )}
                >
                  {isExpired
                    ? `${Math.abs(days)}h lalu`
                    : days === 0
                      ? "Hari ini!"
                      : `${days} hari`}
                </p>

                <p className="text-[10px] text-gray-400">{product.expiry}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
