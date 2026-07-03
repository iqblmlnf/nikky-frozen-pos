import { useEffect, useState } from "react";
import { api } from "../../lib/api";

import { daysFromNow } from "../../utils/date";

import {
  ExpiryStats,
  ExpiryAlertList,
} from "../../components/expiry";

export default function ExpiryPage() {
  // 1. Ambil data user yang sedang login dari sessionStorage
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Semua");

  // 2. Modifikasi loadProducts agar mengirimkan params branch_id jika bukan owner
  const loadProducts = async () => {
    try {
      const params =
        user.role === "owner"
          ? {}
          : {
              branch_id: user.branch_id,
            };

      const res = await api.get("/products", {
        params, // Kirim parameter ke backend Laravel bray
      });

      setProducts(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const expired = products.filter(
    (p) => daysFromNow(p.expiry) < 0
  );

  const todayExp = products.filter(
    (p) => daysFromNow(p.expiry) === 0
  );

  const weekExp = products.filter((p) => {
    const d = daysFromNow(p.expiry);
    return d > 0 && d <= 7;
  });

  const monthExp = products.filter((p) => {
    const d = daysFromNow(p.expiry);
    return d > 7 && d <= 30;
  });

  const allWarning = products
    .filter((p) => daysFromNow(p.expiry) <= 30)
    .sort(
      (a, b) =>
        daysFromNow(a.expiry) -
        daysFromNow(b.expiry)
    );

  const filtered = products.filter((product) => {
    const days = daysFromNow(product.expiry);

    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      status === "Semua" ||
      (status === "Expired" && days < 0) ||
      (status === "Hampir Expired" &&
        days >= 0 &&
        days <= 7) ||
      (status === "Aman" && days > 7);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Opsional: Penanda nama cabang di atas dashboard biar makin mantap */}
      {user.role !== "owner" && user.branch?.name && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-xl text-sm font-semibold inline-block">
          Cabang: {user.branch.name}
        </div>
      )}

      <ExpiryStats
        expired={expired.length}
        today={todayExp.length}
        week={weekExp.length}
        month={monthExp.length}
      />

      <ExpiryAlertList
        products={allWarning}
      />
    </div>
  );
}