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
  const [expenses, setExpenses] = useState<any[]>([]);
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

      const salesRes = await axios.get("http://localhost:8000/api/sales", {
        params,
      });

      const expenseRes = await axios.get("http://localhost:8000/api/expenses");

      const salesData = salesRes.data;
      const expenseData = expenseRes.data;

      setSales(salesData);
      setExpenses(expenseData);

      const dynamicChart = [];

      for (let i = period - 1; i >= 0; i--) {
        const currentDate = new Date();

        currentDate.setDate(currentDate.getDate() - i);

        const dailySales = salesData.filter(
          (sale: any) =>
            new Date(sale.created_at).toDateString() ===
            currentDate.toDateString(),
        );

        const dailyExpenses = expenseData.filter(
          (expense: any) =>
            new Date(expense.created_at).toDateString() ===
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

          expense: dailyExpenses.reduce(
            (sum: number, expense: any) => sum + Number(expense.amount),
            0,
          ),
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

  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.created_at);

    const startDate = new Date();

    startDate.setDate(startDate.getDate() - period);

    return expenseDate >= startDate;
  });

  const revenue = filteredSales.reduce(
    (sum, sale) => sum + Number(sale.total),
    0,
  );

  const expense = filteredExpenses.reduce(
    (sum, item) => sum + Number(item.amount),
    0,
  );

  const profit = revenue - expense;

  const incomeTransactions = filteredSales.map((sale: any) => ({
    id: sale.id,

    title: sale.invoice_number || `INV-${sale.id}`,

    category: sale.payment_method || "Penjualan",

    amount: Number(sale.total),

    type: "income",

    date: new Date(sale.created_at).toLocaleDateString("id-ID"),
  }));

  const expenseTransactions = filteredExpenses.map((expense: any) => ({
    id: expense.id,

    title: expense.title || expense.category,

    category: expense.category,

    amount: Number(expense.amount),

    type: "expense",

    date: new Date(expense.created_at).toLocaleDateString("id-ID"),
  }));

  const allTransactions = [...incomeTransactions, ...expenseTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const handleExportFinance = () => {
    const incomeData = sales.map((sale: any) => ({
      Tipe: "Pemasukan",

      Invoice: sale.invoice_number || `INV-${sale.id}`,

      Cabang: sale.branch?.name ?? "-",

      Kasir: sale.user?.name ?? "-",

      Nominal: Number(sale.total),

      Metode: sale.payment_method,

      Tanggal: new Date(sale.created_at).toLocaleString("id-ID"),
    }));

    const expenseData = expenses.map((expense: any) => ({
      Tipe: "Pengeluaran",

      Keterangan: expense.title || expense.category,

      Kategori: expense.category,

      Nominal: Number(expense.amount),

      Tanggal: new Date(expense.created_at).toLocaleString("id-ID"),
    }));

    const excelData = [...incomeData, ...expenseData];

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
          className="
            flex
            items-center
            gap-2
            px-4
            py-2
            bg-green-600
            hover:bg-green-700
            text-white
            rounded-xl
            font-medium
          "
        >
          <Download className="w-4 h-4" />
          Export Excel
        </button>
      </div>

      <FinanceStats revenue={revenue} expense={expense} profit={profit} />

      <FinanceChart data={chartData} period={period} setPeriod={setPeriod} />

      <FinanceTransactionTable transactions={allTransactions} />
    </div>
  );
}
