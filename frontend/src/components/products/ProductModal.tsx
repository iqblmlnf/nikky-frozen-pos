import { useEffect, useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import Swal from "sweetalert2";

import type { Product } from "../../types/product";

interface Props {
  open: boolean;
  editing: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

const categories = [
  "Frozen Food",
  "Minuman",
  "Snack",
  "Seafood",
  "Daging",
  "Sayuran Beku",
];

export default function ProductModal({
  open,
  editing,
  onClose,
  onSuccess,
}: Props) {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [branchId, setBranchId] = useState("");
  const [branches, setBranches] = useState<any[]>([]);
  const [expiry, setExpiry] = useState("");
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    if (editing) {
      setName(editing.name);
      setSku(editing.sku);
      setCategory(editing.category);
      setPrice(String(editing.price));
      setStock(String(editing.stocks?.[0]?.stock || ""));
      setBranchId(String(editing.stocks?.[0]?.branch_id || ""));
      
      setExpiry(editing.expiry);
    } else {
      setName("");
      setSku("");
      setCategory("");
      setPrice("");
      setStock("");
      setBranchId("");
      setExpiry("");
      setImage(null);
    }
  }, [editing, open]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/branches")
      .then((res) => setBranches(res.data))
      .catch(console.error);
  }, []);

  const handleSave = async () => {
    if (!name.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Nama Produk Kosong",
        text: "Silakan isi nama produk terlebih dahulu",
      });

      return;
    }

    if (!sku.trim()) {
      Swal.fire({
        icon: "warning",
        title: "SKU Kosong",
        text: "Silakan isi SKU produk",
      });

      return;
    }

    if (!category) {
      Swal.fire({
        icon: "warning",
        title: "Kategori Belum Dipilih",
        text: "Silakan pilih kategori produk",
      });

      return;
    }

    if (!price || Number(price) <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Harga Tidak Valid",
        text: "Masukkan harga yang benar",
      });

      return;
    }

    if (!stock || Number(stock) < 0) {
      Swal.fire({
        icon: "warning",
        title: "Stok Tidak Valid",
        text: "Masukkan jumlah stok yang benar",
      });

      return;
    }

    if (!branchId) {
      Swal.fire({
        icon: "warning",
        title: "Cabang Belum Dipilih",
        text: "Silakan pilih cabang",
      });

      return;
    }

    if (!expiry) {
      Swal.fire({
        icon: "warning",
        title: "Tanggal Kadaluarsa Kosong",
        text: "Silakan pilih tanggal kadaluarsa",
      });

      return;
    }

    if (!editing && !image) {
      Swal.fire({
        icon: "warning",
        title: "Gambar Belum Dipilih",
        text: "Silakan upload gambar produk",
      });

      return;
    }
    try {
      if (editing) {
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        await axios.put(`http://localhost:8000/api/products/${editing.id}`, {
          sku,
          name,
          category,
          price,
          stock,
          branch_id: branchId,
          expiry,
          user_id: user.id,
        });

        await Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Produk berhasil diperbarui",
        });
      } else {
        const formData = new FormData();

        formData.append("sku", sku);
        formData.append("name", name);
        formData.append("category", category);
        formData.append("price", price);
        formData.append("stock", stock);
        formData.append("branch_id", branchId);
        formData.append("expiry", expiry);

        if (image) {
          formData.append("image", image);
        }

        const user = JSON.parse(localStorage.getItem("user") || "{}");

        formData.append("user_id", String(user.id));

        await axios.post("http://localhost:8000/api/products", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        await Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Produk berhasil ditambahkan",
        });
      }

      onSuccess();
    } catch (error: any) {
      if (error.response?.data?.errors?.sku) {
        Swal.fire({
          icon: "warning",
          title: "SKU Sudah Digunakan",
          text: error.response.data.errors.sku[0],
        });

        return;
      }

      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Terjadi kesalahan saat menyimpan produk",
      });
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-900">
            {editing ? "Edit Produk" : "Tambah Produk"}
          </h3>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama Produk"
            className="w-full px-4 py-3 rounded-xl border border-gray-200"
          />

          <input
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            placeholder="SKU"
            className="w-full px-4 py-3 rounded-xl border border-gray-200"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200"
          >
            <option value="">Pilih Kategori</option>

            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              Rp.
            </span>

            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
              className="w-full pl-14 pr-4 py-3 rounded-xl border border-gray-200"
            />
          </div>

          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="Stok"
            className="w-full px-4 py-3 rounded-xl border border-gray-200"
          />

          <select
            value={branchId}
            onChange={(e) => setBranchId(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200"
          >
            <option value="">Pilih Cabang</option>

            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200"
          />

          {!editing && (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200"
            />
          )}

          <button
            onClick={handleSave}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            {editing ? "Update Produk" : "Simpan Produk"}
          </button>
        </div>
      </div>
    </div>
  );
}
