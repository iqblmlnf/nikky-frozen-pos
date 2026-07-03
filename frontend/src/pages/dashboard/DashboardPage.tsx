// src/pages/dashboard/DashboardPage.tsx

import { useEffect, useState } from "react";
import { api } from "../../lib/api";

import { daysFromNow } from "../../utils/date";
import { fmt } from "../../utils/currency";

import {
  ExpiryAlertBanner,
  DashboardStats,
  RevenueChartCard,
  CategoryChartCard,
  BranchPerformanceCard,
  ExpiryProductList,
} from "../../components/dashboard";

export function DashboardPage() {
  const [stocks, setStocks] = useState<any[]>([]);
  const [transfers, setTransfers] = useState<any[]>([]);
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [period, setPeriod] = useState(7);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);

  const loadDashboard = async () => {
    try {
      let salesUrl = "/sales";

      let branchPerformanceUrl =
        "/branches/performance";

      if (user.role !== "owner") {
        salesUrl += `?branch_id=${user.branch_id}`;
        branchPerformanceUrl += `?branch_id=${user.branch_id}`;
      }

      const [
        productsRes,
        usersRes,
        salesRes,
        branchesRes,
        stocksRes,
        transfersRes,
      ] = await Promise.all([
        api.get("/products"),
        api.get("/users"),
        api.get(salesUrl),
        api.get(branchPerformanceUrl),
        api.get("/stocks"),
        api.get("/stock-transfer-history"),
      ]);

      const productsData = productsRes.data;
      const usersData = usersRes.data;
      const salesData = salesRes.data;

      setProducts(productsData);
      setUsers(usersData);
      setSales(salesData);
      setBranches(branchesRes.data);
      setStocks(stocksRes.data);
      setTransfers(transfersRes.data);

      // ==========================
      // REVENUE CHART REALTIME
      // ==========================

      const revenueData = [];

      for (let i = period - 1; i >= 0; i--) {
        const currentDate = new Date();

        currentDate.setDate(currentDate.getDate() - i);

        const salesOfDay = salesData.filter(
          (sale: any) =>
            new Date(sale.created_at).toDateString() ===
            currentDate.toDateString(),
        );

        revenueData.push({
          day: currentDate.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
          }),

          revenue: salesOfDay.reduce(
            (total: number, sale: any) => total + Number(sale.total),
            0,
          ),

          orders: salesOfDay.length,
        });
      }

      setChartData(revenueData);

      // ==========================
      // CATEGORY CHART REALTIME
      // ==========================

      const categoryCount: Record<string, number> = {};

      productsData.forEach((product: any) => {
        const category = product.category || "Lainnya";

        categoryCount[category] = (categoryCount[category] || 0) + 1;
      });

      const colors = [
        "#1565C0",
        "#06B6D4",
        "#3B82F6",
        "#0EA5E9",
        "#7DD3FC",
        "#F59E0B",
        "#10B981",
      ];

      const totalProducts = productsData.length;

      const categoryChart = Object.entries(categoryCount).map(
        ([name, count], index) => ({
          name,
          value:
            totalProducts > 0
              ? Math.round((Number(count) / totalProducts) * 100)
              : 0,
          color: colors[index % colors.length],
        }),
      );

      setCategoryData(categoryChart);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [period]);

  // ==========================
  // KADALUARSA
  // ==========================

  const expiringProducts = products.filter(
    (product) => daysFromNow(product.expiry) <= 7,
  );

  // ==========================
  // STOK MENIPIS
  // ==========================

  const lowStockProducts = stocks.filter((item) => Number(item.stock) <= 10);

  // ==========================
  // STATISTIK
  // ==========================

  const totalProducts = products.length;
  const totalStocks = stocks.reduce((sum, item) => sum + Number(item.stock), 0);

  const totalTransfers = transfers.length;

  const todayTransfers = transfers.filter(
    (item) =>
      new Date(item.created_at).toDateString() === new Date().toDateString(),
  ).length;

  const todayRevenue = sales
    .filter(
      (sale) =>
        new Date(sale.created_at).toDateString() === new Date().toDateString(),
    )
    .reduce((sum, sale) => sum + Number(sale.total), 0);

  const filteredSales = sales.filter((sale) => {
    const saleDate = new Date(sale.created_at);

    const limitDate = new Date();

    limitDate.setDate(limitDate.getDate() - period);

    return saleDate >= limitDate;
  });

  const totalRevenue = filteredSales.reduce(
    (sum, sale) => sum + Number(sale.total),
    0,
  );

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* ALERT */}
      <ExpiryAlertBanner total={expiringProducts.length} />

      {/* STATS */}
      <DashboardStats
        totalProducts={totalProducts}
        expiringCount={expiringProducts.length}
        lowStockCount={lowStockProducts.length}
        todayRevenue={todayRevenue}
      />

      {/* STOCK STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Stok</p>

              <h2 className="text-4xl font-bold text-blue-600 mt-2">
                {totalStocks}
              </h2>

              <p className="text-xs text-gray-400 mt-1">
                Seluruh stok semua cabang
              </p>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
              📦
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Transfer Stok</p>

              <h2 className="text-4xl font-bold text-purple-600 mt-2">
                {totalTransfers}
              </h2>

              <p className="text-xs text-gray-400 mt-1">
                Total transfer tercatat
              </p>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center">
              🔄
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Transfer Hari Ini</p>

              <h2 className="text-4xl font-bold text-green-600 mt-2">
                {todayTransfers}
              </h2>

              <p className="text-xs text-gray-400 mt-1">Aktivitas hari ini</p>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center">
              🚚
            </div>
          </div>
        </div>
      </div>

      {/* CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <RevenueChartCard
          data={chartData}
          formatCurrency={fmt}
          totalRevenue={totalRevenue}
          period={period}
          setPeriod={setPeriod}
        />

        <CategoryChartCard data={categoryData} />
      </div>

      {/* BOTTOM SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <BranchPerformanceCard branches={branches} />

        <ExpiryProductList
          products={expiringProducts}
          daysUntilExpiry={daysFromNow}
        />

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-gray-900">
              Transfer Terbaru
            </h3>

            <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">
              {transfers.length} Transfer
            </span>
          </div>

          {transfers.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              Belum ada riwayat transfer stok
            </div>
          ) : (
            <div className="space-y-4">
              {transfers.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="
                  flex
                  items-center
                  justify-between
                  border-b
                  border-gray-50
                  pb-3
                "
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {item.product?.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      {item.from_branch?.name}
                      {" → "}
                      {item.to_branch?.name}
                    </p>
                  </div>

                  <span
                    className="
                    px-3
                    py-1
                    rounded-xl
                    bg-blue-50
                    text-blue-600
                    text-sm
                    font-bold
                  "
                  >
                    {item.qty} pcs
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
