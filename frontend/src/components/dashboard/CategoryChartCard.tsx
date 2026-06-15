// src/components/dashboard/CategoryChartCard.tsx

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

interface CategoryItem {
  name: string;
  value: number;
  color: string;
}

interface CategoryChartCardProps {
  data: CategoryItem[];
}

export function CategoryChartCard({
  data,
}: CategoryChartCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 className="font-bold text-gray-900 mb-4">
        Kategori Produk
      </h3>

      <ResponsiveContainer
        width="100%"
        height={150}
      >
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={65}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((item, index) => (
              <Cell
                key={index}
                fill={item.color}
              />
            ))}
          </Pie>

          <Tooltip
            formatter={(value) => [
              `${value}%`,
              "",
            ]}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-3 space-y-2">
        {data.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                style={{
                  background: item.color,
                }}
              />

              <span className="text-gray-500">
                {item.name}
              </span>
            </div>

            <span className="font-bold text-gray-800">
              {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}