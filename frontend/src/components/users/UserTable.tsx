import UserRoleBadge from "./UserRoleBadge";
import { Avatar } from "../ui/Avatar";
import { Edit2, Trash2 } from "lucide-react";
import type { AppUser } from "../../types/user";

interface Props {
  users: AppUser[];
  onEdit: (user: AppUser) => void;
  onDelete: (user: AppUser) => void;
}

export default function UserTable({ users, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {["Pengguna", "Email", "Role", "Cabang", ""].map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-left text-xs uppercase tracking-wider text-gray-400 font-bold"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                {/* USER */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar
                      initials={user.name
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .substring(0, 2)
                        .toUpperCase()}
                      size="md"
                    />

                    <div>
                      <p className="font-bold text-gray-900">{user.name}</p>
                    </div>
                  </div>
                </td>

                {/* EMAIL */}
                <td className="px-4 py-3 text-gray-500">{user.email}</td>

                {/* ROLE */}
                <td className="px-4 py-3">
                  <UserRoleBadge role={user.role} />
                </td>

                {/* CABANG */}
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold">
                    {user.branch?.name ?? "-"}
                  </span>
                </td>

                {/* AKSI */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEdit(user)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDelete(user)}
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

        {users.length === 0 && (
          <div className="py-10 text-center text-gray-400">
            Belum ada data pengguna
          </div>
        )}
      </div>
    </div>
  );
}
