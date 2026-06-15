import { Edit2, Trash2, Building2 } from "lucide-react";

interface Props {
  branches: any[];
  onEdit: (branch: any) => void;
  onDelete: (branch: any) => void;
}

export default function BranchTable({ branches, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-gray-400 font-bold">
                Nama Cabang
              </th>

              <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-gray-400 font-bold">
                Alamat
              </th>

              <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-gray-400 font-bold">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {branches.map((branch) => (
              <tr
                key={branch.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-blue-600" />
                    </div>

                    <span className="font-semibold text-gray-900">
                      {branch.name}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-3 text-gray-500">
                  {branch.address || "-"}
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEdit(branch)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDelete(branch)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {branches.length === 0 && (
          <div className="py-10 text-center text-gray-400">
            Belum ada data cabang
          </div>
        )}
      </div>
    </div>
  );
}
