import { useEffect, useState } from "react";
import { Building2 } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";
import type { Stock } from "../../types/stock";
import StockToolbar from "../../components/stock/StockToolbar";
import StockTable from "../../components/stock/StockTable";
import StockStats from "../../components/stock/StockStats";

export default function StockPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [search, setSearch] = useState("");
  const [activeBranch, setActiveBranch] = useState<number>(0);
  const [editing, setEditing] = useState<Stock | null>(null);
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
  const branches = Array.from(
    new Map(
      stocks
        .filter((item) => item.branch)
        .map((item) => [item.branch.id, item.branch]),
    ).values(),
  );

  const filteredStocks = stocks.filter((item) => {
    const matchSearch =
      item.product?.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.product?.sku?.toLowerCase().includes(search.toLowerCase());

    const matchBranch = activeBranch === 0 || item.branch?.id === activeBranch;

    return matchSearch && matchBranch;
  });
  const totalStock = filteredStocks.reduce(
    (sum, item) => sum + Number(item.stock),
    0,
  );

  const lowStock = filteredStocks.filter((item) => item.stock <= 10);

  const openEditModal = (item: Stock) => {
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
    <div className="p-4 lg:p-6 space-y-5">
      <StockStats
        totalStock={totalStock}
        lowStockCount={lowStock.length}
        activeProducts={filteredStocks.length}
      />

      {lowStock.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p className="font-bold text-amber-700">
            {lowStock.length} produk stok menipis
          </p>

          <div className="flex flex-wrap gap-2 mt-3">
            {lowStock.map((item) => (
              <span
                key={item.id}
                className="
                px-3 py-1
                rounded-xl
                bg-white
                border border-amber-200
                text-xs
              "
              >
                {item.product?.name}

                <span className="ml-1 font-bold text-red-600">
                  {item.stock}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => setActiveBranch(0)}
          className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
            activeBranch === 0
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
          }`}
        >
          <Building2 className="w-4 h-4" />
          Semua Cabang
        </button>

        {branches.map((branch) => (
          <button
            key={branch.id}
            onClick={() => setActiveBranch(branch.id)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
              activeBranch === branch.id
                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
            }`}
          >
            <Building2 className="w-4 h-4" />
            {branch.name}
          </button>
        ))}
      </div>

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
