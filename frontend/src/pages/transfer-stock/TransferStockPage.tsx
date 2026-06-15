import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function TransferStockPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);

  const [productId, setProductId] = useState("");
  const [fromBranch, setFromBranch] = useState("");
  const [toBranch, setToBranch] = useState("");
  const [qty, setQty] = useState("");
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, branchesRes, historyRes] = await Promise.all([
        axios.get("http://localhost:8000/api/products"),
        axios.get("http://localhost:8000/api/branches"),
        axios.get("http://localhost:8000/api/stock-transfer-history"),
      ]);

      setProducts(productsRes.data);
      setBranches(branchesRes.data);
      setHistory(historyRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTransfer = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      await axios.post("http://localhost:8000/api/stock-transfer", {
        product_id: productId,
        from_branch_id: fromBranch,
        to_branch_id: toBranch,
        qty: qty,
        user_id: user.id,
      });

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Transfer stok berhasil",
      });

      setProductId("");
      setFromBranch("");
      setToBranch("");
      setQty("");
      loadData();
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error?.response?.data?.message || "Transfer gagal",
      });
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Transfer Stok</h1>

        <p className="text-gray-500 mt-1">
          Kelola perpindahan stok antar cabang
        </p>
      </div>

      {/* CONTENT */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* FORM */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-5">Form Transfer Stok</h3>

            <div className="space-y-4">
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full h-12 px-4 border border-gray-200 rounded-xl"
              >
                <option value="">Pilih Produk</option>

                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <div className="grid md:grid-cols-2 gap-4">
                <select
                  value={fromBranch}
                  onChange={(e) => setFromBranch(e.target.value)}
                  className="w-full h-12 px-4 border border-gray-200 rounded-xl"
                >
                  <option value="">Cabang Asal</option>

                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>

                <select
                  value={toBranch}
                  onChange={(e) => setToBranch(e.target.value)}
                  className="w-full h-12 px-4 border border-gray-200 rounded-xl"
                >
                  <option value="">Cabang Tujuan</option>

                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <input
                type="number"
                placeholder="Jumlah transfer"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="
                  w-full
                  h-12
                  px-4
                  border
                  border-gray-200
                  rounded-xl
                "
              />

              <button
                onClick={handleTransfer}
                className="
                  h-12
                  px-6
                  rounded-xl
                  bg-blue-600
                  text-white
                  font-semibold
                  hover:bg-blue-700
                  transition
                "
              >
                Transfer Stok
              </button>
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <p className="text-sm text-gray-500">Total Produk</p>

            <h2 className="text-4xl font-bold text-blue-600 mt-2">
              {products.length}
            </h2>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <p className="text-sm text-gray-500">Total Cabang</p>

            <h2 className="text-4xl font-bold text-green-600 mt-2">
              {branches.length}
            </h2>
          </div>
        </div>
      </div>

      {/* RIWAYAT TRANSFER */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            Riwayat Transfer Stok
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Daftar transfer stok antar cabang
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left">Produk</th>
                <th className="px-4 py-3 text-left">Dari</th>
                <th className="px-4 py-3 text-left">Ke</th>
                <th className="px-4 py-3 text-center">Qty</th>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Tanggal</th>
              </tr>
            </thead>

            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">
                    Belum ada riwayat transfer
                  </td>
                </tr>
              ) : (
                history.map((item) => (
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">
                      {item.product?.name}
                    </td>

                    <td className="px-4 py-3">{item.from_branch?.name}</td>

                    <td className="px-4 py-3">{item.to_branch?.name}</td>

                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 rounded-lg bg-blue-100 text-blue-600 font-semibold">
                        {item.qty}
                      </span>
                    </td>

                    <td className="px-4 py-3">{item.user?.name}</td>

                    <td className="px-4 py-3 text-gray-500">
                      {new Date(item.created_at).toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
