import { useState } from "react";
import { Search } from "lucide-react";
import { Badge } from "../ui";
import { fmt } from "../../utils/currency";

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

interface Props {
  transactions: Transaction[];
}

export default function FinanceTransactionTable({
  transactions,
}: Props) {
  const [search, setSearch] =
    useState("");

  const filtered =
    transactions.filter((t) =>
      t.invoice
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

      {/* HEADER */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">

        <h3 className="font-bold text-gray-900">
          Jurnal Transaksi
        </h3>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Cari transaksi..."
            className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">

        <table className="w-full text-sm">

          <thead>

            <tr className="border-b border-gray-100 bg-gray-50/70">

              {[
                "ID Transaksi",
                "Tanggal",
                "Kasir",
                "Cabang",
                "Item",
                "Pembayaran",
                "Total",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                >
                  {h}
                </th>
              ))}

            </tr>

          </thead>

          <tbody className="divide-y divide-gray-50">

            {filtered.map((t) => (
              <tr
                key={t.id}
                className="hover:bg-blue-50/20 transition-colors"
              >
                <td className="px-4 py-3.5">

                  <code className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                    {t.invoice}
                  </code>

                </td>

                <td className="px-4 py-3.5 text-gray-600">
                  {t.date}
                </td>

                <td className="px-4 py-3.5 font-semibold text-gray-900">
                  {t.cashier}
                </td>

                <td className="px-4 py-3.5 text-gray-500 text-xs">
                  {t.branch}
                </td>

                <td className="px-4 py-3.5 text-center">
                  {t.items}
                </td>

                <td className="px-4 py-3.5">

                  <Badge
                    variant={
                      t.payment === "Cash"
                        ? "success"
                        : t.payment === "QRIS"
                        ? "cyan"
                        : "info"
                    }
                  >
                    {t.payment}
                  </Badge>

                </td>

                <td className="px-4 py-3.5 font-bold text-blue-600">
                  {fmt(t.total)}
                </td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>

      {/* FOOTER */}
      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">

        <span className="text-xs text-gray-500">
          Total:
          <span className="font-bold text-gray-900 ml-1">
            {fmt(
              filtered.reduce(
                (s, t) =>
                  s + t.total,
                0
              )
            )}
          </span>
        </span>

        <div className="flex gap-1">

          {["‹", "1", "›"].map(
            (p, i) => (
              <button
                key={i}
                className={
                  p === "1"
                    ? "px-3 py-1.5 rounded-lg text-xs bg-blue-600 text-white font-bold"
                    : "px-3 py-1.5 rounded-lg text-xs border border-gray-200 text-gray-500 hover:bg-gray-100"
                }
              >
                {p}
              </button>
            )
          )}

        </div>

      </div>

    </div>
  );
}