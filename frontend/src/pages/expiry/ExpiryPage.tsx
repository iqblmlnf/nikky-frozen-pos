import { useEffect, useState } from "react";
import axios from "axios";

import { daysFromNow } from "../../utils/date";

import {
  ExpiryStats,
  ExpiryAlertList,
} from "../../components/expiry";

export default function ExpiryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Semua");

  const loadProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/products"
      );

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