import { useEffect, useState } from "react";
import axios from "axios";
import { Download } from "lucide-react";
import { exportToExcel } from "../../utils/exportExcel";

import {
  FinanceStats,
  FinanceChart,
  FinanceTransactionTable,
} from "../../components/finance";

export function FinancePage() {
  const [sales, setSales] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [period, setPeriod] = useState(30);

  const loadFinance = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const params =
        user.role === "owner"
          ? {}
          : {
              branch_id: user.branch_id,
            };

      const res = await axios.get("http://localhost:8000/api/sales", {
        params,
      });

      const salesData = res.data;

      setSales(salesData);

      const dynamicChart = [];

      for (let i = period - 1; i >= 0; i--) {
        const currentDate = new Date();

        currentDate.setDate(currentDate.getDate() - i);

        const dailySales = salesData.filter(
          (sale: any) =>
            new Date(sale.created_at).toDateString() ===
            currentDate.toDateString(),
        );

        dynamicChart.push({
          name:
            period <= 7
              ? currentDate.toLocaleDateString("id-ID", {
                  weekday: "short",
                })
              : currentDate.toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "2-digit",
                }),

          income: dailySales.reduce(
            (sum: number, sale: any) => sum + Number(sale.total),
            0,
          ),

          expense: 0,
        });
      }

      setChartData(dynamicChart);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadFinance();
  }, [period]);

  const filteredSales = sales.filter((sale) => {
    const saleDate = new Date(sale.created_at);

    const startDate = new Date();

    startDate.setDate(startDate.getDate() - period);

    return saleDate >= startDate;
  });

  const revenue = filteredSales.reduce(
    (sum, sale) => sum + Number(sale.total),
    0,
  );

  const expense = 0;

  const profit = revenue - expense;

  const transactions = filteredSales.map((sale: any) => ({
    id: sale.id,

    title: sale.invoice_number || `INV-${sale.id}`,

    category: sale.payment_method || "Penjualan",

    amount: Number(sale.total),

    type: "income",

    date: new Date(sale.created_at).toLocaleDateString("id-ID"),
  }));

  const handleExportFinance = () => {
    const excelData = sales.map((sale: any) => ({
      Invoice: sale.invoice_number,
      Cabang: sale.branch?.name ?? "-",
      Kasir: sale.user?.name ?? "-",
      Total: Number(sale.total),
      Metode: sale.payment_method,
      Status: sale.payment_status,
      Tanggal: new Date(sale.created_at).toLocaleString("id-ID"),
    }));

    exportToExcel(
      excelData,
      `Laporan_Keuangan_${new Date().toISOString().slice(0, 10)}`,
    );
  };

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div className="flex justify-end">
        <button
          onClick={handleExportFinance}
          className=" flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium"
        >
          <Download className="w-4 h-4" />
          Export Excel
        </button>
      </div>
      <FinanceStats revenue={revenue} expense={expense} profit={profit} />

      <FinanceChart data={chartData} period={period} setPeriod={setPeriod} />

      <FinanceTransactionTable transactions={transactions} />
    </div>
  );
}
