import { storageUrl } from "../../lib/api";
import { Edit2, Trash2 } from "lucide-react";

import { Badge } from "../ui";
import ExpiryBadge from "./ExpiryBadge";

import type { Product } from "../../types/product";

import { fmt } from "../../utils";
import { daysFromNow } from "../../utils";
import { cn } from "../../lib/cn";

interface Props {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ProductRow({ product, onEdit, onDelete }: Props) {
  const days = daysFromNow(product.expiry);

  const stock =
    product.stocks?.reduce(
      (sum: number, item: any) => sum + Number(item.stock),
      0,
    ) ?? 0;

  const branchCount = product.stocks?.length ?? 0;

  const isLow = stock <= 10;

  return (
    <tr
      className={cn(
        "hover:bg-blue-50/30 transition-colors",
        days < 0 && "bg-red-50/20",
      )}
    >
      {/* PRODUK */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <img
            src={
              product.image
                ? storageUrl(product.image)
                : "https://placehold.co/100x100"
            }
            alt={product.name}
            className="w-10 h-10 rounded-xl object-cover border border-gray-100"
          />

          <p className="font-semibold text-gray-900">{product.name}</p>
        </div>
      </td>

      {/* SKU */}
      <td className="px-4 py-3.5 hidden md:table-cell">
        <code className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
          {product.sku}
        </code>
      </td>

      {/* KATEGORI */}
      <td className="px-4 py-3.5">
        <Badge variant="info">{product.category}</Badge>
      </td>

      {/* HARGA */}
      <td className="px-4 py-3.5 font-bold text-gray-900">
        {fmt(product.price)}
      </td>

      {/* TOTAL STOK */}
      <td className="px-4 py-3.5 min-w-[180px]">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span
              className={cn(
                "font-bold text-sm",
                isLow ? "text-red-600" : "text-gray-900",
              )}
            >
              {stock} Unit
            </span>

            <span className="text-[10px] text-gray-400">
              {branchCount} cabang
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full",
                isLow ? "bg-red-500" : "bg-blue-500",
              )}
              style={{
                width: `${Math.min(stock, 100)}%`,
              }}
            />
          </div>

          {/* Detail Cabang */}
          <div className="space-y-0.5 pt-1">
            {product.stocks?.slice(0, 2).map((item: any) => (
              <div
                key={item.id}
                className="flex justify-between text-[10px] text-gray-400"
              >
                <span>{item.branch?.name}</span>

                <span>{item.stock}</span>
              </div>
            ))}

            {branchCount > 2 && (
              <div className="text-[10px] text-blue-500 font-medium">
                +{branchCount - 2} cabang lainnya
              </div>
            )}
          </div>

          {isLow && (
            <div className="text-[9px] text-red-500 font-bold uppercase">
              Perlu Restock
            </div>
          )}
        </div>
      </td>

      {/* KADALUARSA */}
      <td className="px-4 py-3.5 hidden lg:table-cell text-xs text-gray-500">
        {product.expiry}
      </td>

      {/* STATUS */}
      <td className="px-4 py-3.5 hidden lg:table-cell">
        <ExpiryBadge expiry={product.expiry} />
      </td>

      {/* AKSI */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(product)}
            className="
              p-1.5
              text-gray-400
              hover:text-blue-600
              hover:bg-blue-50
              rounded-lg
            "
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onDelete(product)}
            className="
              p-1.5
              text-gray-400
              hover:text-red-600
              hover:bg-red-50
              rounded-lg
            "
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
