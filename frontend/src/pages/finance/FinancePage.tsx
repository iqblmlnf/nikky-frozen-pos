import { useEffect, useState } from "react";
import axios from "axios";

import {
  FinanceStats,
  FinanceChart,
  FinanceTransactionTable,
} from "../../components/finance";

interface Transaction {
  id: number;
  invoice: string;
  date: string;
  cashier: string;
  branch: string;
  items: number;
  payment: string;
  total: number;
}

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

      const expenseRes = await axios.get("http://localhost:8000/api/expenses", {
        params,
      });

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

  const todayRevenue = filteredSales
    .filter(
      (sale) =>
        new Date(sale.created_at).toDateString() === new Date().toDateString(),
    )
    .reduce((sum, sale) => sum + Number(sale.total), 0);

  const totalTransactions = filteredSales.length;

  const avgTransaction =
    totalTransactions > 0 ? revenue / totalTransactions : 0;

  const transactions: Transaction[] = filteredSales.map((sale: any) => ({
    id: sale.id,

    invoice: sale.invoice_number,

    date: new Date(sale.created_at).toLocaleDateString("id-ID"),

    cashier: sale.user?.name ?? "-",

    branch: sale.branch?.name ?? "-",

    items:
      sale.items?.reduce(
        (sum: number, item: any) => sum + Number(item.qty),
        0,
      ) ?? 0,

    payment: sale.payment_method,

    total: Number(sale.total),
  }));

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <FinanceStats
        revenue={revenue}
        todayRevenue={todayRevenue}
        avgTransaction={avgTransaction}
        totalTransactions={totalTransactions}
      />

      <FinanceChart data={chartData} period={period} setPeriod={setPeriod} />

      <FinanceTransactionTable transactions={transactions} />
    </div>
  );
}
