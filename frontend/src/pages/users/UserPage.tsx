import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import Swal from "sweetalert2";

import {
  UserStats,
  UserToolbar,
  UserTable,
  UserModal,
} from "../../components/users";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const handleDelete = async (user: any) => {
    const result = await Swal.fire({
      title: "Hapus User?",
      text: `User ${user.name} akan dihapus`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/users/${user.id}`);

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "User berhasil dihapus",
      });

      loadUsers();
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Gagal Menghapus",
        text: error?.response?.data?.message || "Terjadi kesalahan server saat menghapus user.",
      });
    }
  };
  const loadUsers = async () => {
    try {
      const res = await api.get("/users");

      setUsers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const [search, setSearch] = useState("");

  const filtered = users.filter((user: any) =>
    user.name.toLowerCase().includes(search.toLowerCase()),
  );

  const activeUsers = users.length;

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <UserStats total={users.length} active={activeUsers} />

      <UserToolbar
        search={search}
        setSearch={setSearch}
        onAdd={() => {
          setEditing(null);
          setShowModal(true);
        }}
      />

      <UserTable
        users={filtered}
        onEdit={(user) => {
          setEditing(user);
          setShowModal(true);
        }}
        onDelete={handleDelete}
      />

      <UserModal
        open={showModal}
        editing={editing}
        onClose={() => {
          setShowModal(false);
          setEditing(null);
        }}
        onSuccess={() => {
          loadUsers();
          setShowModal(false);
          setEditing(null);
        }}
      />
    </div>
  );
}
