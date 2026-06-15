// src/pages/pos/POSPage.tsx

import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

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
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [products, setProducts] = useState<Product[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [selectedBranch, setSelectedBranch] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [cart, setCart] = useState<CartItem[]>([]);

  const loadProducts = async (branchId?: string) => {
    try {
      const res = await axios.get("http://localhost:8000/api/products", {
        params: {
          branch_id: branchId,
        },
      });

      setProducts(res.data);
    } catch (error: any) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Gagal",
        text:
          error?.response?.data?.message ||
          error.message ||
          "Gagal memuat produk",
      });
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const branchRes = await axios.get("http://localhost:8000/api/branches");

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
        console.error(error);
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
      await axios.post("http://localhost:8000/api/sales", {
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

      Swal.fire({
        icon: "error",
        title: "Gagal",
        text:
          error?.response?.data?.message || error.message || "Transaksi gagal",
      });
    }
  };

  return (
    <div className="h-full flex overflow-hidden bg-gray-50">
      {/* LEFT */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
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
