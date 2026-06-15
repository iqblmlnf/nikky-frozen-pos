// src/components/charts/RevenueTooltip.tsx

interface RevenueTooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
  formatCurrency: (value: number) => string
}

export function RevenueTooltip({
  active,
  payload,
  label,
  formatCurrency,
}: RevenueTooltipProps) {
  if (!active || !payload?.length) return null

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-xl p-3 text-xs">
      <p className="font-bold text-gray-700 mb-1.5">
        {label}
      </p>

      <p className="text-blue-600 font-semibold">
        {formatCurrency(payload[0].value)}
      </p>

      {payload[1] && (
        <p className="text-gray-500 mt-0.5">
          {payload[1].value} pesanan
        </p>
      )}
    </div>
  )
}