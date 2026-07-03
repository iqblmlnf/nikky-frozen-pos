import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import Swal from "sweetalert2";
import { Plus, Trash2 } from "lucide-react";

export default function ExpensePage() {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const [expenses, setExpenses] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    category: "",
    amount: "",
    description: "",
  });

  const loadExpenses = async () => {
    try {
      const res = await api.get("/expenses");

      setExpenses(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const saveExpense = async () => {
    try {
      await api.post("/expenses", {
        category: form.category,
        amount: form.amount,
        description: form.description,
        expense_date: new Date().toISOString().split("T")[0],
      });

      await Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Pengeluaran berhasil ditambahkan",
      });

      setForm({
        category: "",
        amount: "",
        description: "",
      });

      setOpen(false);

      loadExpenses();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteExpense = async (id: number) => {
    const confirm = await Swal.fire({
      title: "Hapus Pengeluaran?",
      text: "Data tidak dapat dikembalikan",
      icon: "warning",
      showCancelButton: true,
    });

    if (!confirm.isConfirmed) return;

    try {
      await api.delete(`/expenses/${id}`);

      loadExpenses();

      Swal.fire("Berhasil", "Pengeluaran dihapus", "success");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Pengeluaran Operasional</h1>

        <button
          onClick={() => setOpen(true)}
          className="
            flex items-center gap-2
            px-4 py-2
            bg-red-500
            hover:bg-red-600
            text-white
            rounded-xl
          "
        >
          <Plus className="w-4 h-4" />
          Tambah
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Kategori</th>
              <th className="p-4 text-left">Nominal</th>
              <th className="p-4 text-left">Keterangan</th>
              <th className="p-4 text-left">Tanggal</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id} className="border-t">
                <td className="p-4">{expense.category}</td>

                <td className="p-4">
                  Rp {Number(expense.amount).toLocaleString("id-ID")}
                </td>

                <td className="p-4">{expense.description}</td>

                <td className="p-4">
                  {new Date(expense.created_at).toLocaleDateString("id-ID")}
                </td>

                <td className="p-4 text-center">
                  <button
                    onClick={() => deleteExpense(expense.id)}
                    className="
                      p-2
                      bg-red-100
                      text-red-600
                      rounded-lg
                    "
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg space-y-4">
            <h2 className="text-xl font-bold">Tambah Pengeluaran</h2>

            <input
              type="text"
              placeholder="Kategori"
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category: e.target.value,
                })
              }
              className="
                w-full
                border
                rounded-xl
                px-4 py-3
              "
            />

            <input
              type="number"
              placeholder="Nominal"
              value={form.amount}
              onChange={(e) =>
                setForm({
                  ...form,
                  amount: e.target.value,
                })
              }
              className="
                w-full
                border
                rounded-xl
                px-4 py-3
              "
            />

            <textarea
              placeholder="Keterangan"
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
              className="
                w-full
                border
                rounded-xl
                px-4 py-3
              "
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="
                  px-4 py-2
                  border
                  rounded-xl
                "
              >
                Batal
              </button>

              <button
                onClick={saveExpense}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
