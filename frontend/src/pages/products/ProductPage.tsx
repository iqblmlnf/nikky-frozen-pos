import { useEffect, useState } from "react";
import { api } from "../../lib/api";

import ProductToolbar from "../../components/products/ProductToolbar";
import ProductTable from "../../components/products/ProductTable";
import ProductModal from "../../components/products/ProductModal";
import Swal from "sweetalert2";

import type { Product } from "../../types/product";

export function ProductPage() {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const isOwner = user.role === "owner";

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua");
  const [sortBy, setSortBy] = useState("default");
  const [stockFilter, setStockFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const loadProducts = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user") || "{}");

      const params = user.role === "owner" ? {} : { branch_id: user.branch_id };

      const res = await api.get("/products", {
        params,
      });

      setProducts(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (product: Product) => {
    const result = await Swal.fire({
      title: "Hapus Produk?",
      text: `Produk ${product.name} akan dihapus`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      const user = JSON.parse(sessionStorage.getItem("user") || "{}");

      await api.delete(`/products/${product.id}`, {
        data: {
          user_id: user.id,
        },
      });

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Produk berhasil dihapus",
      });

      loadProducts();
    } catch (error: any) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Gagal Menghapus",
        text: error?.response?.data?.message || "Produk gagal dihapus",
      });
    }
  };

  const categories = [
    "Semua",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  const filtered = products.filter((p) => {
    const matchesCategory = category === "Semua" || p.category === category;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());

    const totalStock =
      p.stocks?.reduce((sum: number, s: any) => sum + Number(s.stock), 0) || 0;

    let matchesStock = true;
    if (stockFilter === "low") {
      matchesStock = totalStock <= 10 && totalStock > 0;
    } else if (stockFilter === "empty") {
      matchesStock = totalStock === 0;
    }

    return matchesCategory && matchesSearch && matchesStock;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price_desc") {
      return Number(b.price) - Number(a.price);
    }
    if (sortBy === "price_asc") {
      return Number(a.price) - Number(b.price);
    }
    if (sortBy === "stock_desc") {
      const stockA = a.stocks?.reduce((sum: number, s: any) => sum + Number(s.stock), 0) || 0;
      const stockB = b.stocks?.reduce((sum: number, s: any) => sum + Number(s.stock), 0) || 0;
      return stockB - stockA;
    }
    if (sortBy === "stock_asc") {
      const stockA = a.stocks?.reduce((sum: number, s: any) => sum + Number(s.stock), 0) || 0;
      const stockB = b.stocks?.reduce((sum: number, s: any) => sum + Number(s.stock), 0) || 0;
      return stockA - stockB;
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Manajemen Produk</h1>

        <p className="text-gray-500 mt-1">
          Kelola produk, stok, kategori, dan distribusi antar cabang
        </p>
      </div>

      {isOwner && (
        <div className="bg-blue-50/80 border border-blue-100 text-blue-800 px-5 py-3.5 rounded-2xl text-sm flex items-center gap-3 shadow-sm">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">ℹ</span>
          <p className="font-medium">
            Anda masuk sebagai <strong>Owner</strong>. Halaman ini bersifat <strong>Lihat-Saja (Read-Only)</strong>. Tombol aksi tambah, edit, dan hapus dinonaktifkan.
          </p>
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500">Total Produk</p>

          <h2 className="text-3xl font-bold text-blue-600 mt-2">
            {products.length}
          </h2>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500">Total Stok</p>

          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {products.reduce(
              (sum, product) =>
                sum +
                (product.stocks?.reduce(
                  (s: number, stock: any) => s + Number(stock.stock),
                  0,
                ) || 0),
              0,
            )}
          </h2>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500">Stok Menipis</p>

          <h2 className="text-3xl font-bold text-red-600 mt-2">
            {
              products.filter((product) => {
                const total =
                  product.stocks?.reduce(
                    (s: number, stock: any) => s + Number(stock.stock),
                    0,
                  ) || 0;

                return total <= 10;
              }).length
            }
          </h2>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500">Kategori</p>

          <h2 className="text-3xl font-bold text-purple-600 mt-2">
            {categories.length - 1}
          </h2>
        </div>
      </div>

      {/* TOOLBAR */}
      <ProductToolbar
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        categories={categories}
        sortBy={sortBy}
        setSortBy={setSortBy}
        stockFilter={stockFilter}
        setStockFilter={setStockFilter}
        onAdd={() => {
          setEditing(null);
          setShowModal(true);
        }}
      />

      {/* TABLE */}
      <ProductTable
        products={sorted}
        onEdit={(product) => {
          setEditing(product);
          setShowModal(true);
        }}
        onDelete={handleDelete}
      />

      {/* MODAL */}
      <ProductModal
        open={showModal}
        editing={editing}
        onClose={() => {
          setShowModal(false);
        }}
        onSuccess={() => {
          loadProducts();
          setShowModal(false);
        }}
      />
    </div>
  );
}
