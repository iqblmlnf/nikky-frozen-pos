import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import {
  Snowflake,
  Star,
  ShoppingCart,
  Package,
  DollarSign,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [selectedRole, setSelectedRole] = useState("Admin Gudang");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const roles = [
    {
      name: "Owner",
      desc: "Akses penuh",
      icon: Star,
    },
    {
      name: "Kasir",
      desc: "POS & Transaksi",
      icon: ShoppingCart,
    },
    {
      name: "Admin Gudang",
      desc: "Stok & Produk",
      icon: Package,
    },
    {
      name: "Admin Keuangan",
      desc: "Laporan & Jurnal",
      icon: DollarSign,
    },
  ];

  const handleLogin = async () => {
    try {
      setLoading(true);

      const response = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });

      localStorage.setItem("user", JSON.stringify(response.data.user));

      await Swal.fire({
        icon: "success",
        title: "Login Berhasil",
        text: `Login sebagai ${response.data.user.role}`,
        timer: 1500,
        showConfirmButton: false,
      });
      onLogin();
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: error?.response?.data?.message || "Email atau Password salah",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-950 text-white">
        <div className="absolute inset-0 opacity-10">
          <Snowflake className="absolute top-20 left-10 w-24 h-24" />
          <Snowflake className="absolute bottom-20 left-16 w-32 h-32" />
          <Snowflake className="absolute top-60 right-20 w-20 h-20" />
          <Snowflake className="absolute bottom-32 right-12 w-28 h-28" />
        </div>

        <div className="relative z-10 flex flex-col items-center w-full px-16 pt-24">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center border border-white/20">
              <Snowflake size={34} />
            </div>

            <div>
              <h1 className="text-5xl font-bold">Nikky Frozen</h1>

              <p className="text-blue-100 text-xl">Point of Sale System</p>
            </div>
          </div>

          <div className="w-72 h-72 rounded-3xl border border-white/20 bg-white/10 backdrop-blur flex flex-col items-center justify-center mb-10">
            <div className="text-8xl">🧊</div>

            <p className="mt-6 text-xl font-semibold">
              Produk Frozen Berkualitas
            </p>
          </div>

          <h2 className="text-5xl font-bold text-center leading-tight max-w-3xl">
            Kelola Bisnis Frozen Food
            <br />
            dengan Lebih Mudah
          </h2>

          <p className="text-blue-100 text-center max-w-2xl mt-5 text-lg">
            Sistem POS terpadu multi-cabang untuk penjualan, stok, kadaluarsa,
            dan laporan keuangan secara real-time.
          </p>

          <div className="mt-10 space-y-4 text-lg">
            <div className="flex items-center gap-3">
              <CheckCircle2 />
              <span>Multi-cabang & multi-role support</span>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle2 />
              <span>Monitoring kadaluarsa otomatis</span>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle2 />
              <span>Laporan keuangan & jurnal real-time</span>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle2 />
              <span>Mode offline dengan auto-sinkronisasi</span>
            </div>
          </div>

          <p className="mt-12 text-blue-200 text-sm">
            © 2026 Nikky Frozen. All rights reserved.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="bg-slate-100 flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-xl rounded-[32px] shadow-xl p-10">
          <h2 className="text-4xl font-bold text-slate-900">
            Selamat Datang 👋
          </h2>

          <p className="text-slate-500 mt-2">
            Pilih peran dan masuk ke sistem POS
          </p>

          <div className="mt-8">
            <p className="font-semibold text-sm text-slate-500 mb-4">
              LOGIN SEBAGAI
            </p>

            <div className="grid grid-cols-2 gap-4">
              {roles.map((role) => {
                const Icon = role.icon;
                const active = selectedRole === role.name;

                return (
                  <button
                    key={role.name}
                    type="button"
                    onClick={() => setSelectedRole(role.name)}
                    className={`rounded-2xl border p-4 text-left transition-all ${
                      active
                        ? "border-blue-600 bg-blue-50"
                        : "border-slate-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex gap-3">
                      <Icon
                        size={18}
                        className={active ? "text-blue-600" : "text-slate-400"}
                      />

                      <div>
                        <h3
                          className={`font-semibold ${
                            active ? "text-blue-600" : "text-slate-700"
                          }`}
                        >
                          {role.name}
                        </h3>

                        <p className="text-sm text-slate-500">{role.desc}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8">
            <label className="block text-sm font-semibold text-slate-600 mb-2">
              EMAIL
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="owner@nikkyfrozen.com"
              className="w-full h-14 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mt-6">
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-slate-600">
                PASSWORD
              </label>

              <button type="button" className="text-blue-600 text-sm">
                Lupa password?
              </button>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="123456"
                className="w-full h-14 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="button"
                className="absolute right-4 top-4 text-slate-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className="w-full mt-8 h-14 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg transition disabled:bg-gray-400"
          >
            {loading ? "Memproses..." : "Masuk ke Sistem"}
          </button>

          <p className="text-center text-sm text-slate-400 mt-6">
            Dengan masuk, Anda menyetujui
            <span className="text-blue-600"> Syarat & Ketentuan </span>
            Nikky Frozen
          </p>

          <p className="text-center text-sm text-slate-400 mt-8">
            Nikky Frozen POS v2.4.1 • © 2026
          </p>
        </div>
      </div>
    </div>
  );
}
