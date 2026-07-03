// src/pages/dashboard/DashboardPage.tsx

import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Package, Repeat2, Truck } from "lucide-react";

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
  const [summary, setSummary] = useState<any>({
    totalProducts: 0,
    totalStocks: 0,
    lowStockCount: 0,
    expiringCount: 0,
    todayRevenue: 0,
    totalRevenue: 0,
    totalTransfers: 0,
    todayTransfers: 0,
  });

  const loadDashboard = async () => {
    try {
      const params: any = {
        period,
      };

      if (user.role !== "owner") {
        params.branch_id = user.branch_id;
      }

      const res = await api.get("/dashboard/summary", {
        params,
      });

      setSummary(res.data);
      setProducts(res.data.expiringProducts || []);
      setUsers([]);
      setSales([]);
      setBranches(res.data.branches || []);
      setStocks([]);
      setTransfers(res.data.transfers || []);
      setChartData(res.data.chartData || []);
      setCategoryData(res.data.categoryData || []);
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

  const expiringProducts = products;
  const totalProducts = summary.totalProducts || 0;
  const totalStocks = summary.totalStocks || 0;
  const totalTransfers = summary.totalTransfers || 0;
  const todayTransfers = summary.todayTransfers || 0;
  const todayRevenue = Number(summary.todayRevenue || 0);
  const totalRevenue = Number(summary.totalRevenue || 0);
  const lowStockCount = summary.lowStockCount || 0;

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* ALERT */}
      <ExpiryAlertBanner total={expiringProducts.length} />

      {/* STATS */}
      <DashboardStats
        totalProducts={totalProducts}
        expiringCount={summary.expiringCount || expiringProducts.length}
        lowStockCount={lowStockCount}
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

            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600"><Package className="w-6 h-6" /></div>
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

            <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600"><Repeat2 className="w-6 h-6" /></div>
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

            <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-600"><Truck className="w-6 h-6" /></div>
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
                      {" -> "}
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

