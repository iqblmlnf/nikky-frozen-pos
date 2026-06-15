// src/components/charts/RevenueChart.tsx

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { RevenueTooltip } from "./RevenueTooltip"

interface RevenueData {
  day: string
  revenue: number
  orders: number
}

interface RevenueChartProps {
  data: RevenueData[]
  formatCurrency: (value: number) => string
}

export function RevenueChart({
  data,
  formatCurrency,
}: RevenueChartProps) {
  return (
    <ResponsiveContainer
      width="100%"
      height={200}
    >
      <AreaChart
        data={data}
        margin={{
          top: 5,
          right: 5,
          bottom: 0,
          left: 0,
        }}
      >
        <defs>
          <linearGradient
            id="revGrad"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="5%"
              stopColor="#1565C0"
              stopOpacity={0.15}
            />
            <stop
              offset="95%"
              stopColor="#1565C0"
              stopOpacity={0}
            />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#F1F5F9"
          vertical={false}
        />

        <XAxis
          dataKey="day"
          tick={{
            fontSize: 11,
            fill: "#94A3B8",
          }}
          axisLine={false}
          tickLine={false}
        />

        <YAxis
          tick={{
            fontSize: 10,
            fill: "#94A3B8",
          }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) =>
            `${(v / 1000000).toFixed(1)}Jt`
          }
        />

        <Tooltip
          content={
            <RevenueTooltip
              formatCurrency={formatCurrency}
            />
          }
        />

        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#1565C0"
          strokeWidth={2.5}
          fill="url(#revGrad)"
          dot={{
            fill: "#1565C0",
            r: 3,
            strokeWidth: 0,
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}