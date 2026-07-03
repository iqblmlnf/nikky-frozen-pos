import { useEffect, useState } from "react";
import { api } from "../../lib/api";

interface AuditLog {
  id: number;
  action: string;
  module: string;
  description: string;
  created_at: string;
  user?: {
    name: string;
  };
}

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLogs = async () => {
    try {
      const res = await api.get("/audit-logs");

      setLogs(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const getBadgeColor = (action: string) => {
    switch (action) {
      case "CREATE":
        return "bg-green-100 text-green-700";

      case "UPDATE":
        return "bg-yellow-100 text-yellow-700";

      case "DELETE":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Audit Trail</h2>

          <p className="text-sm text-gray-500 mt-1">
            Riwayat seluruh aktivitas pengguna
          </p>
        </div>

        {loading ? (
          <div className="p-10 text-center">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-3 text-left">User</th>

                  <th className="px-4 py-3 text-left">Aksi</th>

                  <th className="px-4 py-3 text-left">Modul</th>

                  <th className="px-4 py-3 text-left">Deskripsi</th>

                  <th className="px-4 py-3 text-left">Waktu</th>
                </tr>
              </thead>

              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{log.user?.name || "-"}</td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getBadgeColor(
                          log.action,
                        )}`}
                      >
                        {log.action}
                      </span>
                    </td>

                    <td className="px-4 py-3">{log.module}</td>

                    <td className="px-4 py-3">{log.description}</td>

                    <td className="px-4 py-3">
                      {new Date(log.created_at).toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
