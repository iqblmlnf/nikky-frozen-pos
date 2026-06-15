import { useEffect, useState } from "react";
import axios from "axios";

import { daysFromNow } from "../../utils/date";

import {
  ExpiryStats,
  ExpiryToolbar,
  ExpiryTable,
} from "../../components/expiry";

export default function ExpiryPage() {
  const [products, setProducts] = useState<any[]>([]);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("Semua");

  const loadProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/products");

      setProducts(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filtered = products.filter((product) => {
    const days = daysFromNow(product.expiry);

    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      status === "Semua" ||
      (status === "Expired" && days < 0) ||
      (status === "Hampir Expired" && days >= 0 && days <= 7) ||
      (status === "Aman" && days > 7);

    return matchesSearch && matchesStatus;
  });

  const expiredCount = products.filter((p) => daysFromNow(p.expiry) < 0).length;

  const warningCount = products.filter((p) => {
    const days = daysFromNow(p.expiry);

    return days >= 0 && days <= 7;
  }).length;

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* STATS */}
      <ExpiryStats expiredCount={expiredCount} warningCount={warningCount} />

      {/* TOOLBAR */}
      <ExpiryToolbar
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
      />

      {/* TABLE */}
      <ExpiryTable products={filtered} />
    </div>
  );
}
