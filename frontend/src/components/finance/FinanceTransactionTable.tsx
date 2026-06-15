import { fmt } from "../../utils/currency";
import { TrendingUp, TrendingDown } from "lucide-react";

interface Transaction {
  id: number;
  title: string;
  category: string;
  amount: number;
  type: string;
  date: string;
}

interface Props {
  transactions: Transaction[];
}

export default function FinanceTransactionTable({ transactions }: Props) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      {/* HEADER */}
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">Transaksi Terbaru</h3>

          <p className="text-sm text-gray-400 mt-1">
            Riwayat pemasukan dan pengeluaran
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold">
          {transactions.length} Data
        </span>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {["Transaksi", "Kategori", "Tanggal", "Nominal", "Status"].map(
                (header) => (
                  <th
                    key={header}
                    className="
                    px-5
                    py-4
                    text-left
                    text-xs
                    uppercase
                    tracking-wider
                    text-gray-400
                    font-bold
                  "
                  >
                    {header}
                  </th>
                ),
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {transactions.map((item) => (
              <tr
                key={item.id}
                className="
                  hover:bg-blue-50/30
                  transition-colors
                "
              >
                {/* TRANSAKSI */}
                <td className="px-5 py-4">
                  <div>
                    <p className="font-semibold text-gray-900">{item.title}</p>

                    <p className="text-xs text-gray-400">ID #{item.id}</p>
                  </div>
                </td>

                {/* KATEGORI */}
                <td className="px-5 py-4">
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                    {item.category}
                  </span>
                </td>

                {/* TANGGAL */}
                <td className="px-5 py-4 text-gray-500">{item.date}</td>

                {/* NOMINAL */}
                <td className="px-5 py-4">
                  <span
                    className={`font-bold ${
                      item.type === "income"
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {item.type === "income" ? "+" : "-"}
                    {fmt(item.amount)}
                  </span>
                </td>

                {/* STATUS */}
                <td className="px-5 py-4">
                  {item.type === "income" ? (
                    <span
                      className="
                        inline-flex
                        items-center
                        gap-1
                        px-3
                        py-1
                        rounded-full
                        bg-emerald-100
                        text-emerald-700
                        text-xs
                        font-bold
                      "
                    >
                      <TrendingUp className="w-3 h-3" />
                      Pemasukan
                    </span>
                  ) : (
                    <span
                      className="
                        inline-flex
                        items-center
                        gap-1
                        px-3
                        py-1
                        rounded-full
                        bg-red-100
                        text-red-700
                        text-xs
                        font-bold
                      "
                    >
                      <TrendingDown className="w-3 h-3" />
                      Pengeluaran
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="px-5 py-4 border-t border-gray-100 bg-gray-50">
        <p className="text-xs text-gray-500">
          Menampilkan {transactions.length} transaksi terakhir
        </p>
      </div>
    </div>
  );
}
