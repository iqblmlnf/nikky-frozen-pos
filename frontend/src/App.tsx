import { useState } from "react";

import { Sidebar, Header } from "./components/layout";

import { DashboardPage } from "./pages/dashboard/DashboardPage";
import { ProductPage } from "./pages/products/ProductPage";
import POSPage from "./pages/pos/POSPage";
import ExpiryPage from "./pages/expiry/ExpiryPage";
import StockPage from "./pages/stock/StockPage";
import { FinancePage } from "./pages/finance/FinancePage";
import UsersPage from "./pages/users/UserPage";
import Login from "./pages/login/LoginPage";
import TransactionPage from "./pages/transactions/TransactionPage";
import AuditPage from "./pages/audit/AuditPage";
import BranchPage from "./pages/branches/BranchPage";
import TransferStockPage from "./pages/transfer-stock/TransferStockPage";
import ExpensePage from "./pages/expenses/ExpensePage";

import type { Page, Role } from "./types";

export default function App() {
  // PERBAIKAN 1: Gunakan sessionStorage agar data otomatis terhapus saat sesi baru / browser direstart
  const [user, setUser] = useState(() => {
    return JSON.parse(sessionStorage.getItem("user") || "null");
  });

  const getDefaultPage = (roleName: string): Page => {
    switch (roleName?.toLowerCase()) {
      case "kasir":
        return "pos"; 
      case "admin_gudang":
        return "stock"; 
      case "admin_keuangan":
        return "finance"; 
      case "owner":
      default:
        return "dashboard"; 
    }
  };

  const [page, setPage] = useState<Page>(() => {
    if (user && user.role) {
      return getDefaultPage(user.role);
    }
    return "dashboard";
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // PERBAIKAN 2: Ganti fungsi reload dengan update state dinamis agar login langsung mengarah ke halaman yang benar
  const handleLoginSuccess = () => {
    const updatedUser = JSON.parse(sessionStorage.getItem("user") || "null");
    if (updatedUser) {
      setUser(updatedUser);
      setPage(getDefaultPage(updatedUser.role));
    }
  };

  // Jika belum login, tampilkan halaman Login
  if (!user) {
    return <Login onLogin={handleLoginSuccess} />;
  }

  const role = (user.role || "owner") as Role;

  const currentUser = {
    name: user.name || "",
    email: user.email || "",
    initials:
      user.name
        ?.split(" ")
        .map((word: string) => word[0])
        .join("")
        .substring(0, 2)
        .toUpperCase() || "",
    role: user.role || "",
  };

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return <DashboardPage />;

      case "products":
        return <ProductPage />;

      case "pos":
        return <POSPage />;

      case "expiry":
        return <ExpiryPage />;

      case "stock":
        return <StockPage />;

      case "finance":
        return <FinancePage />;

      case "users":
        return <UsersPage />;

      case "transactions":
        return <TransactionPage />;

      case "audit":
        return <AuditPage />;

      case "branches":
        return <BranchPage />;

      case "transfer-stock":
        return <TransferStockPage />;

      case "expenses":
        return <ExpensePage />;

      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        currentPage={page}
        onNavigate={setPage}
        role={role}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentUser={currentUser}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header page={page} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto">{renderPage()}</main>
      </div>
    </div>
  );
}