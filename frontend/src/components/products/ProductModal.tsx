import { useEffect, useState } from "react";
import { api, storageUrl } from "../../lib/api";
import { X, Upload, ImageIcon } from "lucide-react";
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
  const [preview, setPreview] = useState("");
  const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}");
  const isAdminGudang = currentUser.role === "admin_gudang";
  const assignedBranchId = currentUser.branch_id ? String(currentUser.branch_id) : "";
  const visibleBranches = isAdminGudang
    ? branches.filter((branch) => String(branch.id) === assignedBranchId)
    : branches;
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    if (editing) {
      const stockRecord = isAdminGudang
        ? editing.stocks?.find((stock) => String(stock.branch_id) === assignedBranchId)
        : editing.stocks?.[0];

      setName(editing.name);
      setSku(editing.sku);
      setCategory(editing.category);
      setPrice(String(editing.price));
      setStock(String(stockRecord?.stock || ""));
      setBranchId(
        isAdminGudang
          ? assignedBranchId
          : String(stockRecord?.branch_id || ""),
      );

      setExpiry(editing.expiry);
    } else {
      setName("");
      setSku("");
      setCategory("");
      setPrice("");
      setStock("");
      setBranchId(isAdminGudang ? assignedBranchId : "");
      setExpiry("");
      setImage(null);
    }
  }, [assignedBranchId, editing, isAdminGudang, open]);

  useEffect(() => {
    api
      .get("/branches")
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

    const effectiveBranchId = isAdminGudang ? assignedBranchId : branchId;

    if (!effectiveBranchId) {
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
        const user = JSON.parse(sessionStorage.getItem("user") || "{}");

        const formData = new FormData();

        formData.append("sku", sku);
        formData.append("name", name);
        formData.append("category", category);
        formData.append("price", price);
        formData.append("stock", stock);
        formData.append("branch_id", effectiveBranchId);
        formData.append("expiry", expiry);
        formData.append("user_id", String(user.id));

        if (image) {
          formData.append("image", image);
        }

        formData.append("_method", "PUT");

        await api.post(
          `/products/${editing.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

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
        formData.append("branch_id", effectiveBranchId);
        formData.append("expiry", expiry);

        if (image) {
          formData.append("image", image);
        }

        const user = JSON.parse(sessionStorage.getItem("user") || "{}");

        formData.append("user_id", String(user.id));

        await api.post("/products", formData, {
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto scrollbar-hide">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            {editing ? "Edit Produk" : "Tambah Produk Baru"}
          </h3>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* IMAGE UPLOAD */}
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
            Foto Produk
          </label>

          <label className="border-2 border-dashed border-gray-200 rounded-2xl p-6 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition">
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="w-32 h-32 object-cover rounded-2xl mb-3"
              />
            ) : editing?.image ? (
              <img
                src={storageUrl(editing.image)}
                alt={editing.name}
                className="w-32 h-32 object-cover rounded-2xl mb-3"
              />
            ) : (
              <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
            )}

            <p className="font-medium text-gray-600">Upload Foto Produk</p>

            <p className="text-xs text-gray-400 mt-1">PNG / JPG maksimal 5MB</p>

            <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-white border rounded-xl text-sm">
              <Upload className="w-4 h-4" />
              Pilih File
            </div>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>

        {/* FORM */}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
              Nama Produk
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
              placeholder="Chicken Nugget 500g"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
              SKU
            </label>

            <input
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
              placeholder="CHK-001"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
              Kategori
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
            >
              <option value="">Pilih Kategori</option>

              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
              Harga Jual
            </label>

            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
              placeholder="35000"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
              Stok Awal
            </label>

            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
              Kadaluarsa
            </label>

            <input
              type="date"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
              Cabang
            </label>

            <select
              value={branchId}
              onChange={(e) => {
                if (!isAdminGudang) {
                  setBranchId(e.target.value);
                }
              }}
              disabled={isAdminGudang}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 disabled:bg-gray-100 disabled:text-gray-500"
            >
              <option value="">Pilih Cabang</option>

              {visibleBranches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* BUTTON */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50"
          >
            Batal
          </button>

          <button
            onClick={handleSave}
            className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
          >
            {editing ? "Simpan Perubahan" : "Tambah Produk"}
          </button>
        </div>
      </div>
    </div>
  );
}
