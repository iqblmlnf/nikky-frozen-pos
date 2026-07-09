import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import Swal from "sweetalert2";

import BranchTable from "../../components/branches/BranchTable";
import BranchModal from "../../components/branches/BranchModal";

export default function BranchPage() {
  const [branches, setBranches] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const loadBranches = async () => {
    try {
      const res = await api.get("/branches");

      setBranches(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadBranches();
  }, []);

  const handleDelete = async (branch: any) => {
    const result = await Swal.fire({
      title: "Hapus Cabang?",
      text: `${branch.name} akan dihapus`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/branches/${branch.id}`);

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Cabang berhasil dihapus",
      });

      loadBranches();
    } catch (error: any) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.response?.data?.message || "Gagal menghapus cabang.",
      });
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div className="flex justify-end">
        <button
          onClick={() => {
            setEditing(null);
            setShowModal(true);
          }}
          className="px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold"
        >
          + Tambah Cabang
        </button>
      </div>

      <BranchTable
        branches={branches}
        onEdit={(branch) => {
          setEditing(branch);
          setShowModal(true);
        }}
        onDelete={handleDelete}
      />

      <BranchModal
        open={showModal}
        editing={editing}
        onClose={() => {
          setShowModal(false);
          setEditing(null);
        }}
        onSuccess={() => {
          loadBranches();
          setShowModal(false);
          setEditing(null);
        }}
      />
    </div>
  );
}
