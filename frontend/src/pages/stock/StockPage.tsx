import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import StockToolbar from "../../components/stock/StockToolbar";
import StockTable from "../../components/stock/StockTable";

export default function StockPage() {
  const [stocks, setStocks] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [editing, setEditing] = useState<any>(null);
  const [stockValue, setStockValue] = useState("");

  const loadStocks = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const params =
        user.role === "owner"
          ? {}
          : {
              branch_id: user.branch_id,
            };

      const res = await axios.get("http://localhost:8000/api/stocks", {
        params,
      });

      setStocks(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadStocks();
  }, []);

  const filteredStocks = stocks.filter(
    (item: any) =>
      item.product?.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.product?.sku?.toLowerCase().includes(search.toLowerCase()),
  );

  const openEditModal = (item: any) => {
    setEditing(item);
    setStockValue(String(item.stock));
  };

  const saveStock = async () => {
    console.log("EDITING =", editing);
    console.log("ID =", editing?.id);
    console.log("STOCK =", stockValue);
    try {
      await axios.put(`http://localhost:8000/api/stocks/${editing.id}`, {
        stock: Number(stockValue),
      });

      await Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Stok berhasil diperbarui",
      });

      setEditing(null);

      loadStocks();
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Stok gagal diperbarui",
      });
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <StockToolbar search={search} setSearch={setSearch} />

      <StockTable stocks={filteredStocks} onEdit={openEditModal} />

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-xl font-bold mb-4">Edit Stok</h3>

            <div className="space-y-3">
              <p>
                <strong>Produk:</strong> {editing.product?.name}
              </p>

              <p>
                <strong>Cabang:</strong> {editing.branch?.name}
              </p>

              <input
                type="number"
                value={stockValue}
                onChange={(e) => setStockValue(e.target.value)}
                className="
                  w-full
                  border
                  border-gray-200
                  rounded-xl
                  px-4
                  py-3
                "
              />
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setEditing(null)}
                className="
                  px-4
                  py-2
                  rounded-xl
                  border
                  border-gray-200
                "
              >
                Batal
              </button>

              <button
                onClick={saveStock}
                className="
                  px-4
                  py-2
                  rounded-xl
                  bg-blue-600
                  text-white
                  hover:bg-blue-700
                "
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
