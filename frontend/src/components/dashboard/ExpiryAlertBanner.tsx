import { AlertTriangle } from "lucide-react";

interface Props {
  total: number;
}

export function ExpiryAlertBanner({
  total,
}: Props) {
  if (total <= 0) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3.5 flex items-center gap-3">
      <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
        <AlertTriangle className="w-4 h-4 text-amber-500" />
      </div>

      <p className="text-sm text-amber-800 font-medium flex-1">
        <span className="font-bold">
          {total} produk
        </span>{" "}
        akan kadaluarsa dalam 7 hari ke depan —
        segera tindak lanjuti.
      </p>

      <button className="text-amber-600 text-xs font-bold hover:underline whitespace-nowrap flex-shrink-0">
        Lihat Detail →
      </button>
    </div>
  );
}