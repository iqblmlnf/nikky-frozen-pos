import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Eye, Printer, Search, X } from "lucide-react";
import { generateReceiptPDF } from "../../utils/receiptPdf";
import { Download } from "lucide-react";
import { exportToExcel } from "../../utils/exportExcel";

export default function TransactionPage() {
  const [sales, setSales] = useState<any[]>([]);
  const [selectedSale, setSelectedSale] = useState<any>(null);
  const [search, setSearch] = useState("");

  const filteredSales = sales.filter((sale: any) =>
    sale.invoice_number.toLowerCase().includes(search.toLowerCase()),
  );
  const todayTransactions = sales.filter(
    (sale: any) =>
      new Date(sale.created_at).toDateString() === new Date().toDateString(),
  );

  const todayRevenue = todayTransactions.reduce(
    (sum: number, sale: any) => sum + Number(sale.total),
    0,
  );

  const totalRevenue = sales.reduce(
    (sum: number, sale: any) => sum + Number(sale.total),
    0,
  );

  const loadSales = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user") || "{}");

      let url = "/sales";

      if (user.role !== "owner") {
        url += `?branch_id=${user.branch_id}`;
      }

      const res = await api.get(url);

      setSales(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDetail = async (id: number) => {
    try {
      const res = await api.get(`/sales/${id}`);

      setSelectedSale(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleExportExcel = () => {
    const excelData = sales.map((sale: any) => ({
      Invoice: sale.invoice_number,
      Kasir: sale.user?.name ?? "-",
      Total: sale.total,
      Status: sale.payment_status,
      Metode: sale.payment_method,
      Tanggal: new Date(sale.created_at).toLocaleString("id-ID"),
    }));

    exportToExcel(excelData, "Laporan_Transaksi");
  };

  useEffect(() => {
    loadSales();
  }, []);

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500">Total Transaksi</p>

          <h2 className="text-3xl font-bold text-blue-600 mt-2">
            {sales.length}
          </h2>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500">Transaksi Hari Ini</p>

          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {todayTransactions.length}
          </h2>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500">Revenue Hari Ini</p>

          <h2 className="text-xl font-bold text-purple-600 mt-2">
            Rp {todayRevenue.toLocaleString("id-ID")}
          </h2>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500">Total Revenue</p>

          <h2 className="text-xl font-bold text-orange-600 mt-2">
            Rp {totalRevenue.toLocaleString("id-ID")}
          </h2>
        </div>
      </div>
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
        {/* TITLE */}
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Riwayat Transaksi
            </h2>

            <button
              onClick={handleExportExcel}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium">
              <Download className="w-4 h-4" />
              Export Excel
            </button>
          </div>

          <p className="text-gray-500 mt-1">
            Monitoring seluruh transaksi penjualan
          </p>
        </div>

        {/* SEARCH */}
        <div className="p-5 border-b">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari Invoice..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-4 text-left font-semibold text-gray-600">
                  Invoice
                </th>

                <th className="px-6 py-4 text-left font-semibold text-gray-600">
                  Kasir
                </th>

                <th className="px-6 py-4 text-center font-semibold text-gray-600">
                  Item
                </th>

                <th className="px-6 py-4 text-left font-semibold text-gray-600">
                  Total
                </th>

                <th className="px-6 py-4 text-left font-semibold text-gray-600">
                  Status
                </th>

                <th className="px-6 py-4 text-left font-semibold text-gray-600">
                  Tanggal
                </th>

                <th className="px-6 py-4 text-left font-semibold text-gray-600">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredSales.map((sale: any) => (
                <tr
                  key={sale.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  {/* INVOICE */}
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {sale.invoice_number}
                  </td>

                  {/* KASIR */}
                  <td className="px-6 py-4">{sale.user?.name ?? "-"}</td>

                  {/* ITEM */}
                  <td className="px-6 py-4 text-center">
                    {sale.items_qty ?? 0}
                  </td>

                  {/* TOTAL */}
                  <td className="px-6 py-4 font-medium">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0,
                    }).format(sale.total)}
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-bold">
                      {sale.payment_status === "paid"
                        ? "Paid"
                        : sale.payment_status}
                    </span>
                  </td>

                  {/* TANGGAL */}
                  <td className="px-6 py-4">
                    {new Date(sale.created_at).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  {/* AKSI */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDetail(sale.id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-medium hover:scale-105 transition"
                    >
                      <Eye className="w-4 h-4" />
                      Detail
                    </button>
                  </td>
                </tr>
              ))}

              {filteredSales.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    Belum ada transaksi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DETAIL */}
      {selectedSale && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-xl">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-2xl font-bold">Detail Transaksi</h2>

              <button
                onClick={() => setSelectedSale(null)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <div>
                <p className="text-sm text-gray-500">Invoice</p>

                <p className="font-semibold text-lg">
                  {selectedSale.invoice_number}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Kasir</p>

                <p className="font-semibold">{selectedSale.user?.name}</p>
              </div>

              <hr />

              <div className="space-y-3">
                {selectedSale.items?.map((item: any) => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.product?.name} x {item.qty}
                    </span>

                    <span>
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        maximumFractionDigits: 0,
                      }).format(item.qty * item.price)}
                    </span>
                  </div>
                ))}
              </div>

              <hr />

              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>

                <span>
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(selectedSale.total)}
                </span>
              </div>

              <button
                onClick={() => generateReceiptPDF(selectedSale)}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Cetak Struk
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

