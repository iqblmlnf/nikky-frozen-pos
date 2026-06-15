// src/components/charts/CategoryChart.tsx

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts"

interface CategoryData {
  name: string
  value: number
  color: string
}

interface CategoryChartProps {
  data: CategoryData[]
}

export function CategoryChart({
  data,
}: CategoryChartProps) {
  return (
    <>
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
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.color}
              />
            ))}
          </Pie>

          <Tooltip
            formatter={(v) => [
              `${v}%`,
              "",
            ]}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-3 space-y-2">
        {data.map((c) => (
          <div
            key={c.name}
            className="flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-sm"
                style={{
                  background: c.color,
                }}
              />
              <span className="text-gray-500">
                {c.name}
              </span>
            </div>

            <span className="font-bold text-gray-800">
              {c.value}%
            </span>
          </div>
        ))}
      </div>
    </>
  )
}