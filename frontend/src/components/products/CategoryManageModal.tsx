import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { X, Edit2, Trash2, Check } from "lucide-react";
import Swal from "sweetalert2";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CategoryManageModal({ open, onClose, onSuccess }: Props) {
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [loading, setLoading] = useState(false);

  const loadCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (error) {
      console.error("Gagal memuat kategori:", error);
    }
  };

  useEffect(() => {
    if (open) {
      loadCategories();
    }
  }, [open]);

  const handleAdd = async () => {
    if (!newCategoryName.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Nama kategori kosong",
        text: "Masukkan nama kategori baru",
      });
      return;
    }

    try {
      setLoading(true);
      await api.post("/categories", { name: newCategoryName });
      setNewCategoryName("");
      await loadCategories();
      onSuccess(); // Refresh dropdown list di parent modal
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Kategori berhasil ditambahkan",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.response?.data?.message || "Nama kategori sudah ada atau terjadi kesalahan",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: number) => {
    if (!editingName.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Nama kategori kosong",
      });
      return;
    }

    try {
      setLoading(true);
      await api.put(`/categories/${id}`, { name: editingName });
      setEditingId(null);
      setEditingName("");
      await loadCategories();
      onSuccess();
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Kategori berhasil diperbarui",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.response?.data?.message || "Gagal mengubah kategori",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (category: any) => {
    const result = await Swal.fire({
      title: "Hapus Kategori?",
      text: `Kategori "${category.name}" akan dihapus secara permanen.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#EF4444",
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);
      await api.delete(`/categories/${category.id}`);
      await loadCategories();
      onSuccess();
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Kategori berhasil dihapus",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.response?.data?.message || "Gagal menghapus kategori",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            🏷️ Kelola Kategori Produk
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-gray-100 transition text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Form */}
        <div className="flex gap-2 mb-5 flex-shrink-0">
          <input
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Tambah kategori baru..."
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            disabled={loading}
          />
          <button
            onClick={handleAdd}
            className="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition disabled:bg-blue-300"
            disabled={loading}
          >
            Tambah
          </button>
        </div>

        {/* List of Categories */}
        <div className="overflow-y-auto flex-1 divide-y divide-gray-100 pr-1 max-h-[45vh]">
          {categories.length === 0 ? (
            <div className="py-10 text-center text-gray-400 text-sm">
              Belum ada data kategori.
            </div>
          ) : (
            categories.map((cat) => (
              <div
                key={cat.id}
                className="py-3 flex items-center justify-between gap-4"
              >
                {editingId === cat.id ? (
                  <div className="flex-1 flex gap-2">
                    <input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="flex-1 px-3 py-1.5 border border-blue-500 rounded-lg text-sm bg-white"
                      autoFocus
                    />
                    <button
                      onClick={() => handleUpdate(cat.id)}
                      className="p-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg"
                      title="Simpan"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditingName("");
                      }}
                      className="p-1.5 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg"
                      title="Batal"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="font-medium text-gray-800 text-sm">
                      {cat.name}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setEditingId(cat.id);
                          setEditingName(cat.name);
                        }}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Edit Kategori"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Hapus Kategori"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl text-sm transition"
        >
          Kembali ke Form
        </button>
      </div>
    </div>
  );
}
