import { useState } from "react";
import Swal from "sweetalert2";
import { api } from "../../lib/api";

export default function SyncButton() {
  const [loading, setLoading] = useState(false);

  const syncOfflineData = async () => {
    const queue = JSON.parse(localStorage.getItem("offline_sales") || "[]");

    if (queue.length === 0) {
      Swal.fire("Info", "Tidak ada data yang perlu disinkronkan", "info");

      return;
    }

    setLoading(true);

    try {
      for (const sale of queue) {
        await api.post("/sales", sale);
      }

      localStorage.removeItem("offline_sales");

      Swal.fire("Berhasil", "Semua transaksi berhasil disinkronkan", "success");
    } catch (error) {
      Swal.fire("Gagal", "Masih ada transaksi yang gagal dikirim", "error");
    }

    setLoading(false);
  };

  const pending = JSON.parse(
    localStorage.getItem("offline_sales") || "[]",
  ).length;

  return (
    <div className="flex gap-2">
      <span
        className="
          px-3 py-2
          rounded-xl
          bg-orange-100
          text-orange-700
          text-sm
          font-semibold
        "
      >
        {pending} Pending
      </span>

      <button
        onClick={syncOfflineData}
        disabled={loading}
        className="
          px-4 py-2
          bg-blue-600
          text-white
          rounded-xl
          hover:bg-blue-700
        "
      >
        {loading ? "Sinkronisasi..." : "Sinkronisasi"}
      </button>
    </div>
  );
}
