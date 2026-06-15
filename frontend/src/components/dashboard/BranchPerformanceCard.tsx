import { Building2 } from "lucide-react";
import { fmt } from "../../utils/currency";

export function BranchPerformanceCard({ branches }: any) {
  if (!Array.isArray(branches)) {
    return null;
  }

  const maxRevenue = Math.max(
    ...branches.map((b: any) => Number(b.revenue)),
    1,
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 className="font-bold text-gray-900 mb-5">Performa Cabang</h3>

      <div className="space-y-4">
        {branches.map((branch: any) => {
          const pct = (Number(branch.revenue) / maxRevenue) * 100;

          return (
            <div key={branch.id}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-400" />

                  <span>{branch.name}</span>
                </div>

                <span>{fmt(Number(branch.revenue))}</span>
              </div>

              <div className="w-full bg-gray-200 h-2 rounded">
                <div
                  className="bg-blue-600 h-2 rounded"
                  style={{
                    width: `${pct}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
