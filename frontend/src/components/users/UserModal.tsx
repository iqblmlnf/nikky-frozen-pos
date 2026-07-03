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

export default function UserModal({
  open,
  editing,
  onClose,
  onSuccess,
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("kasir");

  const [branches, setBranches] = useState<any[]>([]);
  const [branchId, setBranchId] = useState("");

  // Load cabang
  useEffect(() => {
    const loadBranches = async () => {
      try {
        const res = await api.get("/branches");

        setBranches(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    loadBranches();
  }, []);

  // Load data edit
  useEffect(() => {
    if (editing) {
      setName(editing.name);
      setEmail(editing.email);
      setRole(editing.role);
      setBranchId(String(editing.branch_id || ""));
      setPassword("");
    } else {
      setName("");
      setEmail("");
      setPassword("");
      setRole("kasir");
      setBranchId("");
    }
  }, [editing]);

  const handleSave = async () => {
    try {
      if (!name.trim()) {
        Swal.fire({
          icon: "warning",
          title: "Nama wajib diisi",
        });

        return;
      }

      if (!email.trim()) {
        Swal.fire({
          icon: "warning",
          title: "Email wajib diisi",
        });

        return;
      }

      if (!editing && !password.trim()) {
        Swal.fire({
          icon: "warning",
          title: "Password wajib diisi",
        });

        return;
      }

      if (!branchId) {
        Swal.fire({
          icon: "warning",
          title: "Cabang wajib dipilih",
        });

        return;
      }

      if (editing) {
        await api.put(`/users/${editing.id}`, {
          name,
          email,
          role,
          branch_id: branchId,
        });

        await Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "User berhasil diupdate",
        });
      } else {
        await api.post("/users", {
          name,
          email,
          password,
          role,
          branch_id: branchId,
        });

        await Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "User berhasil ditambahkan",
        });
      }

      onSuccess();
    } catch (error: any) {
      if (error.response?.data?.errors?.email) {
        Swal.fire({
          icon: "warning",
          title: "Email sudah digunakan",
        });

        return;
      }

      console.error(error);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold">
            {editing ? "Edit User" : "Tambah User"}
          </h3>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama"
            className="w-full px-4 py-3 rounded-xl border border-gray-200"
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-3 rounded-xl border border-gray-200"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl border border-gray-200"
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200"
          >
            <option value="owner">Owner</option>

            <option value="kasir">Kasir</option>

            <option value="admin_gudang">Admin Gudang</option>

            <option value="admin_keuangan">Admin Keuangan</option>
          </select>

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

          <button
            onClick={handleSave}
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold"
          >
            {editing ? "Update User" : "Simpan User"}
          </button>
        </div>
      </div>
    </div>
  );
}
