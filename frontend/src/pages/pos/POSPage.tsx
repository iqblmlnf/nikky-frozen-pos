declare global {
  interface Window {
    snap: any;
  }
}
import { useEffect, useState } from "react";
import { Wifi, WifiOff } from "lucide-react";
import { api } from "../../lib/api";
import Swal from "sweetalert2";
import { saveOfflineSale } from "../../utils/offlineQueue";
import SyncButton from "../../components/pos/SyncButton";

import {
  ProductGrid,
  CartPanel,
  CategoryFilter,
  SearchBar,
} from "../../components/pos";

import type { Product } from "../../types/product";

export interface CartItem extends Product {
  qty: number;
}

export default function POSPage() {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const [products, setProducts] = useState<Product[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [selectedBranch, setSelectedBranch] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);
  const loadProducts = async (branchId?: string) => {
    try {
      const res = await api.get("/products", {
        params: {
          branch_id: branchId,
        },
      });

      setProducts(res.data);
    } catch (error) {
      console.error("Gagal load produk:", error);
    }
  };
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const branchRes = await api.get("/branches");

        setBranches(branchRes.data);

        if (user.role === "owner") {
          if (branchRes.data.length > 0) {
            const firstBranch = String(branchRes.data[0].id);

            setSelectedBranch(firstBranch);

            loadProducts(firstBranch);
          }
        } else {
          setSelectedBranch(String(user.branch_id));

          loadProducts(String(user.branch_id));
        }
      } catch (error) {
        console.error("Gagal load data awal:", error);
      }
    };

    loadInitialData();
  }, []);

  const categories = [
    "Semua",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  const filteredProducts = products.filter(
    (product) =>
      (category === "Semua" || product.category === category) &&
      (product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.sku.toLowerCase().includes(search.toLowerCase())),
  );

  function addToCart(product: Product) {
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      setCart((prev) =>
        prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                qty: item.qty + 1,
              }
            : item,
        ),
      );

      return;
    }

    setCart((prev) => [
      ...prev,
      {
        ...product,
        qty: 1,
      },
    ]);
  }

  function increaseQty(id: number) {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              qty: item.qty + 1,
            }
          : item,
      ),
    );
  }

  function decreaseQty(id: number) {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? {
                ...item,
                qty: item.qty - 1,
              }
            : item,
        )
        .filter((item) => item.qty > 0),
    );
  }

  function removeItem(id: number) {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      return;
    }

    try {
      // =========================
      // MIDTRANS
      // =========================
      if (paymentMethod === "Midtrans") {
        const snapRes = await api.post(
          "/midtrans/create-transaction",
          {
            total: subtotal,
          },
        );

        const snapToken = snapRes.data.token;

        window.snap.pay(snapToken, {
          onSuccess: async () => {
            try {
              await api.post("/sales", {
                user_id: user.id,
                branch_id:
                  user.role === "owner" ? selectedBranch : user.branch_id,

                total: subtotal,
                items: cart,
                payment_method: "Midtrans",
              });

              await Swal.fire({
                icon: "success",
                title: "Pembayaran Berhasil",
                text: "Transaksi berhasil disimpan",
              });

              setCart([]);

              loadProducts(selectedBranch);
            } catch (error) {
              console.error(error);
            }
          },

          onPending: () => {
            Swal.fire({
              icon: "info",
              title: "Menunggu Pembayaran",
              text: "Transaksi masih pending",
            });
          },

          onError: () => {
            Swal.fire({
              icon: "error",
              title: "Pembayaran Gagal",
              text: "Silakan coba lagi",
            });
          },

          onClose: () => {
            Swal.fire({
              icon: "warning",
              title: "Dibatalkan",
              text: "Popup pembayaran ditutup",
            });
          },
        });

        return;
      }

      // =========================
      // CASH / TRANSFER
      // =========================
      await api.post("/sales", {
        user_id: user.id,
        branch_id: user.role === "owner" ? selectedBranch : user.branch_id,

        total: subtotal,
        items: cart,
        payment_method: paymentMethod,
      });

      await Swal.fire({
        icon: "success",
        title: "Transaksi Berhasil",
        text: "Data berhasil disimpan",
      });

      setCart([]);

      loadProducts(selectedBranch);
    } catch (error: any) {
      console.error(error);

      if (paymentMethod !== "Midtrans") {
        saveOfflineSale({
          user_id: user.id,
          branch_id: user.role === "owner" ? selectedBranch : user.branch_id,
          total: subtotal,
          items: cart,
          payment_method: paymentMethod,
        });

        Swal.fire({
          icon: "warning",
          title: "Offline Mode",
          text: "Transaksi disimpan lokal dan akan disinkronkan nanti",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Midtrans Error",
          text: "Gagal membuat transaksi pembayaran",
        });
      }
    }
  };

  return (
    <div className="h-full flex overflow-hidden bg-gray-50">
      {/* LEFT */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
        <div className="flex justify-end gap-3">
          <div
            className={`
      flex items-center gap-2
      px-4 py-2
      rounded-xl
      text-sm font-semibold
      ${isOnline ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
    `}
          >
            {isOnline ? (
              <Wifi className="w-4 h-4" />
            ) : (
              <WifiOff className="w-4 h-4" />
            )}

            {isOnline ? "Online" : "Offline"}
          </div>

          <SyncButton />
        </div>
        {user.role === "owner" && (
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Cabang Aktif
            </label>

            <select
              value={selectedBranch}
              onChange={(e) => {
                setSelectedBranch(e.target.value);

                setCart([]);

                loadProducts(e.target.value);
              }}
              className="
                w-full
                lg:w-80
                px-4
                py-3
                border
                border-gray-200
                rounded-xl
              "
            >
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <SearchBar value={search} onChange={setSearch} />

        <CategoryFilter
          categories={categories}
          selected={category}
          onSelect={setCategory}
        />

        <ProductGrid products={filteredProducts} onAdd={addToCart} />
      </div>

      {/* RIGHT */}
      <CartPanel
        items={cart}
        subtotal={subtotal}
        onIncrease={increaseQty}
        onDecrease={decreaseQty}
        onRemove={removeItem}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        onCheckout={handleCheckout}
      />
    </div>
  );
}
