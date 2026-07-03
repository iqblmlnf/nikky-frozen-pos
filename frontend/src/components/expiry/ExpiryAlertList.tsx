import { storageUrl } from "../../lib/api";
import {
  CheckCircle,
  Download,
} from "lucide-react";

import { daysFromNow } from "../../utils/date";

interface Props {
  products: any[];
}

export default function ExpiryAlertList({
  products,
}: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-gray-900">
            Daftar Produk Perlu Perhatian
          </h3>

          <p className="text-xs text-gray-400 mt-0.5">
            Diurutkan berdasarkan urgensi
            kadaluarsa
          </p>
        </div>

        <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700">
          <Download className="w-3.5 h-3.5" />
          Export
        </button>
      </div>

      <div className="divide-y divide-gray-50">
        {products.map((p) => {
          const days = daysFromNow(
            p.expiry
          );

          const isExpired =
            days < 0;

          const isToday =
            days === 0;

          const isUrgent =
            days > 0 &&
            days <= 3;

          const barColor = isExpired
            ? "bg-red-500"
            : isToday
            ? "bg-orange-500"
            : isUrgent
            ? "bg-amber-500"
            : "bg-yellow-400";

          const tagColor = isExpired
            ? "bg-red-500 text-white"
            : isToday
            ? "bg-orange-500 text-white"
            : isUrgent
            ? "bg-amber-500 text-white"
            : "bg-yellow-400 text-yellow-900";

          const tagLabel = isExpired
            ? "KADALUARSA"
            : isToday
            ? "HARI INI"
            : isUrgent
            ? "MENDESAK"
            : "PERHATIAN";

          const timeText = isExpired
            ? `${Math.abs(days)} hari lalu`
            : isToday
            ? "Hari ini!"
            : `${days} hari lagi`;

          return (
            <div
              key={p.id}
              className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50"
            >
              <div
                className={`w-1 h-12 rounded-full ${barColor}`}
              />

              <img
                src={storageUrl(p.image)}
                alt={p.name}
                className="w-12 h-12 rounded-xl object-cover border"
              />

              <div className="flex-1">
                <p className="font-bold text-gray-900">
                  {p.name}
                </p>

                <div className="flex gap-2 text-xs text-gray-400 mt-1 flex-wrap">
                  <span>
                    {p.category}
                  </span>

                  <span>•</span>

                  <span>
                    Stok:{" "}
                    {p.stock ??
                      0}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold">
                  {timeText}
                </p>

                <p className="text-xs text-gray-400">
                  {p.expiry}
                </p>
              </div>

              <span
                className={`text-[10px] font-bold px-2.5 py-1.5 rounded-xl ${tagColor}`}
              >
                {tagLabel}
              </span>
            </div>
          );
        })}
      </div>

      {products.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-9 h-9 text-emerald-500" />
          </div>

          <p className="font-bold text-gray-700">
            Semua produk aman!
          </p>

          <p className="text-sm text-gray-400 mt-1">
            Tidak ada produk yang akan
            kadaluarsa dalam 30 hari ke depan
          </p>
        </div>
      )}
    </div>
  );
}