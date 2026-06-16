import CartItem from "./CartItem";

import type { CartItem as CartItemType } from "../../pages/pos/POSPage";

interface Props {
  items: CartItemType[];

  subtotal: number;

  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
  onRemove: (id: number) => void;

  paymentMethod: string;
  setPaymentMethod: (value: string) => void;

  onCheckout: () => void;
}

export default function CartPanel({
  items,
  subtotal,
  onIncrease,
  onDecrease,
  onRemove,
  paymentMethod,
  setPaymentMethod,
  onCheckout,
}: Props) {
  return (
    <div className="w-full lg:w-[420px] border-l border-gray-200 bg-white flex flex-col">
      {/* HEADER */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Keranjang</h2>

          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold">
            {items.length} Item
          </span>
        </div>
      </div>

      {/* ITEMS */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {items.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="text-6xl mb-4">🛒</div>

            <h3 className="font-bold text-gray-700">Keranjang Kosong</h3>

            <p className="text-sm text-gray-400 mt-1">
              Tambahkan produk untuk memulai transaksi
            </p>
          </div>
        )}

        {items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onIncrease={onIncrease}
            onDecrease={onDecrease}
            onRemove={onRemove}
          />
        ))}
      </div>

      {/* FOOTER */}
      <div className="border-t border-gray-100 p-5 space-y-5 bg-gray-50">
        {/* SUMMARY */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Total Item</span>

            <span className="font-semibold">
              {items.reduce((acc, item) => acc + item.qty, 0)}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Jenis Produk</span>

            <span className="font-semibold">{items.length}</span>
          </div>

          <div className="border-t pt-3 flex justify-between">
            <span className="font-semibold text-gray-700">Total</span>

            <span className="text-2xl font-bold text-blue-600">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
              }).format(subtotal)}
            </span>
          </div>
        </div>

        {/* PAYMENT */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Metode Pembayaran
          </label>

          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="Cash">💵 Cash</option>

            <option value="Midtrans">💳 Midtrans (QRIS / Gopay / VA)</option>
          </select>
        </div>

        {/* CHECKOUT */}
        <button
          onClick={onCheckout}
          disabled={items.length === 0}
          className="
          w-full
          py-4
          rounded-2xl
          bg-blue-600
          hover:bg-blue-700
          text-white
          font-bold
          text-lg
          transition
          disabled:bg-gray-300
          disabled:cursor-not-allowed
        "
        >
          Checkout
        </button>
      </div>
    </div>
  );
}
