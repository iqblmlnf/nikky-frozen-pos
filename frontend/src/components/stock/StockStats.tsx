import { Package2, AlertCircle, Layers } from "lucide-react";

interface Props {
  totalStock: number;
  lowStockCount: number;
  activeProducts: number;
}

export default function StockStats({
  totalStock,
  lowStockCount,
  activeProducts,
}: Props) {
  const cards = [
    {
      title: "Total Stok",
      value: Number(totalStock ?? 0).toLocaleString(),
      sub: "semua produk",
      icon: <Package2 className="w-5 h-5" />,
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      color: "text-blue-600",
    },
    {
      title: "Stok Menipis",
      value: String(lowStockCount),
      sub: "< 10 unit tersisa",
      icon: <AlertCircle className="w-5 h-5" />,
      bg: "bg-amber-50",
      iconBg: "bg-amber-100",
      color: "text-amber-600",
    },
    {
      title: "Produk Aktif",
      value: String(activeProducts),
      sub: "terdaftar di sistem",
      icon: <Layers className="w-5 h-5" />,
      bg: "bg-cyan-50",
      iconBg: "bg-cyan-100",
      color: "text-cyan-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`${card.bg} rounded-3xl border border-white p-5`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{card.title}</p>

              <h2 className={`text-3xl font-bold mt-1 ${card.color}`}>
                {card.value}
              </h2>

              <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
            </div>

            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center ${card.iconBg}`}
            >
              <div className={card.color}>{card.icon}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
