declare global {
  interface Window {
    snap: any;
  }
}
import { useEffect, useState } from "react";
import { Wifi, WifiOff, Clock } from "lucide-react";
import { api } from "../../lib/api";
import Swal from "sweetalert2";
import { saveOfflineSale } from "../../utils/offlineQueue";
import SyncButton from "../../components/pos/SyncButton";
import { generateReceiptPDF } from "../../utils/receiptPdf";
import { daysFromNow } from "../../utils/date";

import {
  ProductGrid,
  CartPanel,
  CategoryFilter,
  SearchBar,
} from "../../components/pos";

import type { Product } from "../../types/product";

export interface CartItem extends Product {
  qty: number;
}

export default function POSPage() {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const [products, setProducts] = useState<Product[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [selectedBranch, setSelectedBranch] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);

  // Shift & Tutup Buku States
  const [activeShift, setActiveShift] = useState<any>(null);
  const [isSettled, setIsSettled] = useState(false);
  const [loadingShift, setLoadingShift] = useState(true);
  const [openShiftModal, setOpenShiftModal] = useState(false);
  const [shiftNumber, setShiftNumber] = useState(1);
  const [initialCash, setInitialCash] = useState("");
  const [actualCash, setActualCash] = useState("");
  const [showTutupModal, setShowTutupModal] = useState(false);
  const [showCashPaymentModal, setShowCashPaymentModal] = useState(false);
  const [receivedCash, setReceivedCash] = useState("");

  const checkShiftStatus = async (branchId: string) => {
    try {
      setLoadingShift(true);
      const curHour = new Date().getHours();
      // Skip check if past operational hours
      if (user.role !== "owner" && curHour >= 22) {
        setLoadingShift(false);
        return;
      }

      // Cek apakah hari ini sudah tutup buku
      const settleRes = await api.get(`/daily-settlements/today?branch_id=${branchId}`);
      if (settleRes.data.settlement) {
        setIsSettled(true);
        setOpenShiftModal(false);
        setLoadingShift(false);
        return;
      } else {
        setIsSettled(false);
      }

      // Cek shift aktif kasir ini
      const shiftRes = await api.get(`/shifts/active?user_id=${user.id}`);
      if (shiftRes.data && shiftRes.data.id) {
        setActiveShift(shiftRes.data);
        setOpenShiftModal(false);
      } else {
        setActiveShift(null);
        setOpenShiftModal(true);
      }
    } catch (error) {
      console.error("Gagal memeriksa shift:", error);
    } finally {
      setLoadingShift(false);
    }
  };

  const handleOpenShift = async () => {
    if (!initialCash || isNaN(Number(initialCash)) || Number(initialCash) < 0) {
      Swal.fire("Peringatan", "Modal awal kas wajib diisi dengan benar bray", "warning");
      return;
    }

    try {
      const branchId = user.role === "owner" ? selectedBranch : user.branch_id;
      const res = await api.post("/shifts/open", {
        user_id: user.id,
        branch_id: branchId,
        shift_number: shiftNumber,
        initial_cash: Number(initialCash),
      });

      Swal.fire({
        icon: "success",
        title: "Shift Berhasil Dibuka",
        text: `Selamat bertugas di Shift ${shiftNumber}!`,
        timer: 1500,
        showConfirmButton: false,
      });

      setActiveShift(res.data);
      setOpenShiftModal(false);
      loadProducts(String(branchId));
    } catch (error: any) {
      Swal.fire("Gagal Membuka Shift", error.response?.data?.message || "Terjadi kesalahan server", "error");
    }
  };

  const handleCloseShift = async () => {
    const pendingSales = JSON.parse(localStorage.getItem("offline_sales") || "[]").length;
    if (pendingSales > 0) {
      Swal.fire({
        icon: "warning",
        title: "Sinkronisasi Diperlukan",
        text: `Ada ${pendingSales} transaksi offline yang belum disinkronkan. Silakan klik tombol 'Sinkronisasi' terlebih dahulu sebelum menutup shift!`,
      });
      return;
    }

    if (!actualCash || isNaN(Number(actualCash)) || Number(actualCash) < 0) {
      Swal.fire("Peringatan", "Uang fisik laci wajib diisi dengan benar", "warning");
      return;
    }

    try {
      await api.post("/shifts/close", {
        user_id: user.id,
        actual_cash: Number(actualCash),
      });

      await Swal.fire({
        icon: "success",
        title: "Shift Ditutup",
        text: "Laporan serah terima shift berhasil disimpan.",
      });

      setShowTutupModal(false);
      setActualCash("");
      setCart([]);
      checkShiftStatus(user.role === "owner" ? selectedBranch : String(user.branch_id));
    } catch (error: any) {
      Swal.fire("Gagal Menutup Shift", error.response?.data?.message || "Terjadi kesalahan server", "error");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    window.location.reload();
  };

  const loadProducts = async (branchId?: string) => {
    try {
      const res = await api.get("/products", {
        params: {
          branch_id: branchId,
        },
      });

      setProducts(res.data);
    } catch (error) {
      console.error("Gagal load produk:", error);
    }
  };

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const branchRes = await api.get("/branches");

        setBranches(branchRes.data);

        let activeB = "";
        if (user.role === "owner") {
          if (branchRes.data.length > 0) {
            activeB = String(branchRes.data[0].id);
            setSelectedBranch(activeB);
            loadProducts(activeB);
          }
        } else {
          activeB = String(user.branch_id);
          setSelectedBranch(activeB);
          loadProducts(activeB);
        }

        if (activeB) {
          checkShiftStatus(activeB);
        }
      } catch (error) {
        console.error("Gagal load data awal:", error);
      }
    };

    loadInitialData();
  }, []);

  const categories = [
    "Semua",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  const filteredProducts = products.filter((product) => {
    const matchesCategory = category === "Semua" || product.category === category;
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.sku.toLowerCase().includes(search.toLowerCase());

    const branchStock = product.stocks?.find(
      (s: any) => String(s.branch_id) === String(selectedBranch)
    );
    const hasStock = branchStock ? Number(branchStock.stock) > 0 : false;
    const isExpired = product.expiry ? daysFromNow(product.expiry) < 0 : false;

    return matchesCategory && matchesSearch && hasStock && !isExpired;
  });

  function addToCart(product: Product) {
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      setCart((prev) =>
        prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                qty: item.qty + 1,
              }
            : item,
        ),
      );

      return;
    }

    setCart((prev) => [
      ...prev,
      {
        ...product,
        qty: 1,
      },
    ]);
  }

  function increaseQty(id: number) {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              qty: item.qty + 1,
            }
          : item,
      ),
    );
  }

  function decreaseQty(id: number) {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? {
                ...item,
                qty: item.qty - 1,
              }
            : item,
        )
        .filter((item) => item.qty > 0),
    );
  }

  function removeItem(id: number) {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const executeCashCheckout = async () => {
    const cashAmount = Number(receivedCash);
    if (isNaN(cashAmount) || cashAmount < subtotal) {
      Swal.fire("Peringatan", "Uang yang diterima kurang bray", "warning");
      return;
    }

    try {
      const res = await api.post("/sales", {
        user_id: user.id,
        branch_id: user.role === "owner" ? selectedBranch : user.branch_id,
        total: subtotal,
        items: cart,
        payment_method: "Cash",
      });

      setShowCashPaymentModal(false);
      setReceivedCash("");

      // Eager load and auto-print receipt instantly
      try {
        const fullSaleRes = await api.get(`/sales/${res.data.sale.id}`);
        generateReceiptPDF(fullSaleRes.data);
      } catch (err) {
        console.error("Gagal cetak otomatis:", err);
      }

      await Swal.fire({
        icon: "success",
        title: "Transaksi Berhasil",
        html: `
          <div class="text-left space-y-2 py-2">
            <p>Total Belanja: <b>Rp ${subtotal.toLocaleString("id-ID")}</b></p>
            <p>Uang Diterima: <b>Rp ${cashAmount.toLocaleString("id-ID")}</b></p>
            <p class="text-lg text-emerald-600 font-bold border-t pt-2 mt-2">Kembalian: Rp ${(cashAmount - subtotal).toLocaleString("id-ID")}</p>
          </div>
        `,
      });

      setCart([]);
      loadProducts(selectedBranch);
      checkShiftStatus(selectedBranch);
    } catch (error: any) {
      console.error(error);
      const now = new Date();
      const invoiceNum = "INV-" + 
        now.getFullYear() +
        String(now.getMonth() + 1).padStart(2, '0') +
        String(now.getDate()).padStart(2, '0') +
        String(now.getHours()).padStart(2, '0') +
        String(now.getMinutes()).padStart(2, '0') +
        String(now.getSeconds()).padStart(2, '0');

      const payload = {
        invoice_number: invoiceNum,
        user_id: user.id,
        branch_id: user.role === "owner" ? selectedBranch : user.branch_id,
        total: subtotal,
        items: cart,
        payment_method: "Cash",
      };

      saveOfflineSale(payload);

      // Print offline receipt!
      try {
        const offlinePrintData = {
          ...payload,
          user: { name: user.name },
          items: cart.map(item => ({
            product: { name: item.name },
            qty: item.qty,
            price: item.price,
          })),
          created_at: now.toISOString(),
          cash_received: cashAmount,
          change: cashAmount - subtotal
        };
        generateReceiptPDF(offlinePrintData);
      } catch (err) {
        console.error("Gagal cetak offline:", err);
      }

      setShowCashPaymentModal(false);
      setReceivedCash("");

      Swal.fire({
        icon: "warning",
        title: "Offline Mode",
        text: "Koneksi terputus. Transaksi disimpan lokal & struk berhasil dicetak.",
      });
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      return;
    }

    try {
      // =========================
      // MIDTRANS
      // =========================
      if (paymentMethod === "Midtrans") {
        const snapRes = await api.post(
          "/midtrans/create-transaction",
          {
            total: subtotal,
          },
        );

        const snapToken = snapRes.data.token;

        window.snap.pay(snapToken, {
          onSuccess: async () => {
            try {
              const res = await api.post("/sales", {
                user_id: user.id,
                branch_id:
                  user.role === "owner" ? selectedBranch : user.branch_id,

                total: subtotal,
                items: cart,
                payment_method: "Midtrans",
              });

              // Eager load and auto-print receipt instantly
              try {
                const fullSaleRes = await api.get(`/sales/${res.data.sale.id}`);
                generateReceiptPDF(fullSaleRes.data);
              } catch (err) {
                console.error("Gagal cetak otomatis:", err);
              }

              await Swal.fire({
                icon: "success",
                title: "Pembayaran Berhasil",
                text: "Transaksi berhasil disimpan",
              });

              setCart([]);
              loadProducts(selectedBranch);
              checkShiftStatus(selectedBranch);
            } catch (error) {
              console.error(error);
            }
          },

          onPending: () => {
            Swal.fire({
              icon: "info",
              title: "Menunggu Pembayaran",
              text: "Transaksi masih pending",
            });
          },

          onError: () => {
            Swal.fire({
              icon: "error",
              title: "Pembayaran Gagal",
              text: "Silakan coba lagi",
            });
          },

          onClose: () => {
            Swal.fire({
              icon: "warning",
              title: "Dibatalkan",
              text: "Popup pembayaran ditutup",
            });
          },
        });

        return;
      }

      // =========================
      // CASH / TRANSFER
      // =========================
      if (paymentMethod === "Cash") {
        setReceivedCash("");
        setShowCashPaymentModal(true);
        return;
      }

      const res = await api.post("/sales", {
        user_id: user.id,
        branch_id: user.role === "owner" ? selectedBranch : user.branch_id,

        total: subtotal,
        items: cart,
        payment_method: paymentMethod,
      });

      // Eager load and auto-print receipt instantly
      try {
        const fullSaleRes = await api.get(`/sales/${res.data.sale.id}`);
        generateReceiptPDF(fullSaleRes.data);
      } catch (err) {
        console.error("Gagal cetak otomatis:", err);
      }

      await Swal.fire({
        icon: "success",
        title: "Transaksi Berhasil",
        text: "Data berhasil disimpan",
      });

      setCart([]);
      loadProducts(selectedBranch);
      checkShiftStatus(selectedBranch);
    } catch (error: any) {
      console.error(error);

      if (paymentMethod !== "Midtrans") {
        const now = new Date();
        const invoiceNum = "INV-" + 
          now.getFullYear() +
          String(now.getMonth() + 1).padStart(2, '0') +
          String(now.getDate()).padStart(2, '0') +
          String(now.getHours()).padStart(2, '0') +
          String(now.getMinutes()).padStart(2, '0') +
          String(now.getSeconds()).padStart(2, '0');

        const payload = {
          invoice_number: invoiceNum,
          user_id: user.id,
          branch_id: user.role === "owner" ? selectedBranch : user.branch_id,
          total: subtotal,
          items: cart,
          payment_method: paymentMethod,
        };

        saveOfflineSale(payload);

        // Print offline receipt!
        try {
          const offlinePrintData = {
            ...payload,
            user: { name: user.name },
            items: cart.map(item => ({
              product: { name: item.name },
              qty: item.qty,
              price: item.price,
            })),
            created_at: now.toISOString(),
          };
          generateReceiptPDF(offlinePrintData);
        } catch (err) {
          console.error("Gagal cetak offline:", err);
        }

        Swal.fire({
          icon: "warning",
          title: "Offline Mode",
          text: "Koneksi terputus. Transaksi disimpan lokal & struk berhasil dicetak.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Midtrans Error",
          text: "Gagal membuat transaksi pembayaran",
        });
      }
    }
  };

  // Check Jam Operasional (Maksimal 22:00)
  const currentHour = new Date().getHours();
  const isPastClosingTime = currentHour >= 22;

  if (user.role !== "owner" && isPastClosingTime) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="w-20 h-20 rounded-3xl bg-red-50 text-red-600 flex items-center justify-center mb-6 shadow-sm">
          <Clock className="w-10 h-10 animate-pulse" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">Penjualan Ditutup</h2>
        <p className="text-slate-500 max-w-md mb-6">Batas waktu operasional penjualan adalah pukul 22.00. Sesi POS dinonaktifkan hingga shift besok dibuka kembali.</p>
        <button
          onClick={handleLogout}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md transition"
        >
          Keluar / Logout
        </button>
      </div>
    );
  }

  if (user.role !== "owner" && isSettled) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="w-20 h-20 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 shadow-sm">
          <Clock className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">Tutup Buku Selesai</h2>
        <p className="text-slate-500 max-w-md mb-6">Tutup Buku Harian Cabang untuk hari ini sudah selesai dirangkum. Tidak ada transaksi penjualan baru yang diperbolehkan.</p>
        <button
          onClick={handleLogout}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition"
        >
          Keluar / Logout
        </button>
      </div>
    );
  }

  if (loadingShift) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex overflow-hidden bg-gray-50 relative">
      {/* LEFT */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            {activeShift ? (
              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 text-sm font-bold rounded-xl shadow-sm">
                  ⚡ Active: Shift {activeShift.shift_number}
                </span>
                <span className="px-3.5 py-1.5 bg-purple-50 border border-purple-100 text-purple-700 text-sm font-bold rounded-xl shadow-sm">
                  💵 Modal: Rp {Number(activeShift.initial_cash).toLocaleString("id-ID")}
                </span>
                <button
                  onClick={() => setShowTutupModal(true)}
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition shadow-sm"
                >
                  Tutup Shift
                </button>
              </div>
            ) : (
              <span className="px-3 py-1.5 bg-amber-50 border border-amber-100 text-amber-700 text-sm font-bold rounded-xl animate-pulse">
                ⚠️ Shift Belum Dibuka
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`
        flex items-center gap-2
        px-4 py-2
        rounded-xl
        text-sm font-semibold
        ${isOnline ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
      `}
            >
              {isOnline ? (
                <Wifi className="w-4 h-4" />
              ) : (
                <WifiOff className="w-4 h-4" />
              )}

              {isOnline ? "Online" : "Offline"}
            </div>

            <SyncButton />
          </div>
        </div>

        {user.role === "owner" && (
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Cabang Aktif
            </label>

            <select
              value={selectedBranch}
              onChange={(e) => {
                setSelectedBranch(e.target.value);
                setCart([]);
                loadProducts(e.target.value);
                checkShiftStatus(e.target.value);
              }}
              className="
                w-full
                lg:w-80
                px-4
                py-3
                border
                border-gray-200
                rounded-xl
              "
            >
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <SearchBar value={search} onChange={setSearch} />

        <CategoryFilter
          categories={categories}
          selected={category}
          onSelect={setCategory}
        />

        <ProductGrid products={filteredProducts} onAdd={addToCart} />
      </div>

      {/* RIGHT */}
      <CartPanel
        items={cart}
        subtotal={subtotal}
        onIncrease={increaseQty}
        onDecrease={decreaseQty}
        onRemove={removeItem}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        onCheckout={handleCheckout}
      />

      {/* MODAL BUKA SHIFT */}
      {openShiftModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl space-y-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900">Buka Shift Kasir</h2>
              <p className="text-gray-400 text-sm mt-1">Silakan tentukan shift kerja dan modal kas awal Anda.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Pilih Shift</label>
                <select
                  value={shiftNumber}
                  onChange={(e) => setShiftNumber(Number(e.target.value))}
                  className="w-full h-12 px-4 border border-gray-200 rounded-2xl outline-none focus:border-blue-500 transition font-semibold"
                >
                  <option value={1}>Shift 1 (Pagi / Siang)</option>
                  <option value={2}>Shift 2 (Sore / Malam)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Modal Awal Kas (Rp)</label>
                <input
                  type="number"
                  placeholder="Contoh: 100000"
                  value={initialCash}
                  onChange={(e) => setInitialCash(e.target.value)}
                  className="w-full h-12 px-4 border border-gray-200 rounded-2xl outline-none focus:border-blue-500 transition font-semibold"
                />
              </div>

              <button
                onClick={handleOpenShift}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg transition mt-2"
              >
                Mulai Tugas Kasir
              </button>

              <button
                onClick={handleLogout}
                className="w-full h-12 border border-red-200 hover:bg-red-50 text-red-600 font-bold rounded-2xl transition mt-2 flex items-center justify-center gap-2"
              >
                Keluar / Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TUTUP SHIFT */}
      {showTutupModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl space-y-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900">Tutup Shift Kasir</h2>
              <p className="text-gray-400 text-sm mt-1">Masukkan jumlah total uang kas fisik saat ini di laci kasir.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Uang Fisik Laci (Rp)</label>
                <input
                  type="number"
                  placeholder="Masukkan total uang cash"
                  value={actualCash}
                  onChange={(e) => setActualCash(e.target.value)}
                  className="w-full h-12 px-4 border border-gray-200 rounded-2xl outline-none focus:border-blue-500 transition font-semibold"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowTutupModal(false)}
                  className="flex-1 h-12 border border-gray-200 hover:bg-gray-50 text-gray-500 font-bold rounded-2xl transition"
                >
                  Batal
                </button>
                <button
                  onClick={handleCloseShift}
                  className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-lg transition"
                >
                  Tutup Shift
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PEMBAYARAN TUNAI */}
      {showCashPaymentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl space-y-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900">💵 Pembayaran Tunai</h2>
              <p className="text-gray-400 text-sm mt-1">Input jumlah uang yang diserahkan oleh pelanggan.</p>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
                <span className="text-gray-500 font-medium">Total Tagihan</span>
                <span className="text-xl font-black text-slate-800">Rp {subtotal.toLocaleString("id-ID")}</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Uang Diterima (Rp)</label>
                <input
                  type="number"
                  placeholder="Contoh: 100000"
                  value={receivedCash}
                  onChange={(e) => setReceivedCash(e.target.value)}
                  className="w-full h-12 px-4 border border-gray-200 rounded-2xl outline-none focus:border-blue-500 transition font-semibold text-lg"
                  autoFocus
                />
              </div>

              {/* Quick Cash Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setReceivedCash(String(subtotal))}
                  className="h-10 border border-blue-200 bg-blue-50 text-blue-700 text-xs font-bold rounded-xl hover:bg-blue-100 transition"
                >
                  Uang Pas
                </button>
                <button
                  onClick={() => {
                    const nearest = [20000, 50000, 100000].find(val => val > subtotal);
                    if (nearest) setReceivedCash(String(nearest));
                    else setReceivedCash("100000");
                  }}
                  className="h-10 border border-gray-200 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-50 transition"
                >
                  Bulatan Terdekat
                </button>
                <button
                  onClick={() => setReceivedCash("50000")}
                  className="h-10 border border-gray-200 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-50 transition"
                >
                  Rp 50.000
                </button>
                <button
                  onClick={() => setReceivedCash("100000")}
                  className="h-10 border border-gray-200 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-50 transition"
                >
                  Rp 100.000
                </button>
              </div>

              {/* Real-time Change calculation */}
              {receivedCash && (
                <div className="pt-2 border-t text-center">
                  {Number(receivedCash) < subtotal ? (
                    <p className="text-sm font-bold text-red-600">
                      Uang Kurang: Rp {(subtotal - Number(receivedCash)).toLocaleString("id-ID")}
                    </p>
                  ) : (
                    <p className="text-sm font-bold text-emerald-600">
                      Kembalian: Rp {(Number(receivedCash) - subtotal).toLocaleString("id-ID")}
                    </p>
                  )}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowCashPaymentModal(false);
                    setReceivedCash("");
                  }}
                  className="flex-1 h-12 border border-gray-200 hover:bg-gray-50 text-gray-500 font-bold rounded-2xl transition"
                >
                  Batal
                </button>
                <button
                  onClick={executeCashCheckout}
                  disabled={!receivedCash || Number(receivedCash) < subtotal}
                  className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg transition disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
                >
                  Proses Transaksi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
