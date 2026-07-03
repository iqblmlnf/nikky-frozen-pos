import { storageUrl } from "../../lib/api";
import { Minus, Plus, Trash2 } from "lucide-react";

import type { CartItem as CartItemType } from "../../pages/pos/POSPage";

interface Props {
  item: CartItemType;

  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
  onRemove: (id: number) => void;
}

export default function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: Props) {
  const subtotal = item.price * item.qty;

  return (
    <div
      className="
        bg-white
        border
        border-gray-100
        rounded-3xl
        p-4
        shadow-sm
        hover:shadow-md
        transition-all
      "
    >
      <div className="flex gap-3">
        {/* IMAGE */}
        <img
          src={
            item.image
              ? storageUrl(item.image)
              : "https://placehold.co/100x100"
          }
          alt={item.name}
          className="
            w-16
            h-16
            rounded-2xl
            object-cover
            border
            border-gray-200
          "
        />

        {/* CONTENT */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-bold text-gray-900 truncate">{item.name}</h4>

              <p className="text-xs text-gray-500 mt-1">
                Rp {item.price.toLocaleString("id-ID")}
              </p>
            </div>

            <button
              onClick={() => onRemove(item.id)}
              className="
                p-2
                rounded-xl
                text-gray-400
                hover:text-red-500
                hover:bg-red-50
                transition
              "
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* SUBTOTAL */}
          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-gray-400 uppercase">Subtotal</p>

              <p className="font-bold text-blue-600">
                Rp {subtotal.toLocaleString("id-ID")}
              </p>
            </div>

            {/* QTY */}
            <div
              className="
                flex
                items-center
                bg-gray-50
                border
                border-gray-200
                rounded-2xl
                overflow-hidden
              "
            >
              <button
                onClick={() => onDecrease(item.id)}
                className="
                  w-9
                  h-9
                  flex
                  items-center
                  justify-center
                  hover:bg-gray-100
                "
              >
                <Minus className="w-4 h-4" />
              </button>

              <span className="w-10 text-center font-bold">{item.qty}</span>

              <button
                onClick={() => onIncrease(item.id)}
                className="
                  w-9
                  h-9
                  flex
                  items-center
                  justify-center
                  hover:bg-gray-100
                "
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
