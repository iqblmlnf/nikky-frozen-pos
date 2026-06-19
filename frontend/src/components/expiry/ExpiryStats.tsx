interface Props {
  expired: number;
  today: number;
  week: number;
  month: number;
}

export default function ExpiryStats({
  expired,
  today,
  week,
  month,
}: Props) {
  const stats = [
    {
      label: "Sudah Kadaluarsa",
      count: expired,
      bg: "bg-red-50 border-red-200",
      text: "text-red-600",
      dot: "bg-red-500",
    },
    {
      label: "Kadaluarsa Hari Ini",
      count: today,
      bg: "bg-orange-50 border-orange-200",
      text: "text-orange-600",
      dot: "bg-orange-500",
    },
    {
      label: "Dalam 7 Hari",
      count: week,
      bg: "bg-amber-50 border-amber-200",
      text: "text-amber-600",
      dot: "bg-amber-500",
    },
    {
      label: "Dalam 30 Hari",
      count: month,
      bg: "bg-yellow-50 border-yellow-200",
      text: "text-yellow-600",
      dot: "bg-yellow-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className={`rounded-2xl border p-5 ${s.bg}`}
        >
          <div className="flex items-center gap-2 mb-3">
            <div
              className={`w-2 h-2 rounded-full ${s.dot}`}
            />
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              {s.label}
            </p>
          </div>

          <p
            className={`text-4xl font-bold ${s.text}`}
          >
            {s.count}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            produk
          </p>
        </div>
      ))}
    </div>
  );
}