import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import Swal from "sweetalert2";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  editing: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BranchModal({
  open,
  editing,
  onClose,
  onSuccess,
}: Props) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (editing) {
      setName(editing.name);
      setAddress(editing.address || "");
    } else {
      setName("");
      setAddress("");
    }
  }, [editing]);

  const handleSave = async () => {
    try {
      if (!name.trim()) {
        Swal.fire({
          icon: "warning",
          title: "Nama cabang wajib diisi",
        });

        return;
      }

      if (editing) {
        await api.put(`/branches/${editing.id}`, {
          name,
          address,
        });

        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Cabang berhasil diperbarui",
        });
      } else {
        await api.post("/branches", {
          name,
          address,
        });

        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Cabang berhasil ditambahkan",
        });
      }

      onSuccess();
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Terjadi kesalahan",
      });
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold">
            {editing ? "Edit Cabang" : "Tambah Cabang"}
          </h3>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama Cabang"
            className="w-full px-4 py-3 rounded-xl border border-gray-200"
          />

          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Alamat Cabang"
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200"
          />

          <button
            onClick={handleSave}
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold"
          >
            {editing ? "Update Cabang" : "Simpan Cabang"}
          </button>
        </div>
      </div>
    </div>
  );
}
