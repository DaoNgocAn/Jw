import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { useDailyChartData, useMonthlyChartData } from '@/hooks/useTransactions'
import { formatCurrency } from '@/lib/utils'

function formatAxisValue(v: number) {
  if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`
  if (Math.abs(v) >= 1_000) return `${(v / 1_000).toFixed(0)}K`
  return String(v)
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null
  const val = payload[0]!.value
  return (
    <div className="rounded-lg border bg-white px-3 py-2 shadow-lg text-sm">
      <p className="text-gray-500 mb-1">{label}</p>
      <p className={val >= 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
        {formatCurrency(val)}
      </p>
    </div>
  )
}

export function DailyProfitChart({ year, month }: { year: number; month: number }) {
  const data = useDailyChartData(year, month)
  return (
    <div className="rounded-xl border bg-white p-4">
      <p className="text-sm font-semibold text-gray-700 mb-3">Lợi nhuận theo ngày — T{month}/{year}</p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis dataKey="day" tick={{ fontSize: 11 }} />
          <YAxis tickFormatter={formatAxisValue} tick={{ fontSize: 11 }} width={48} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="#d1d5db" />
          <Bar dataKey="profit" radius={[3, 3, 0, 0]}
            fill="#3b82f6"
            label={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function MonthlyProfitChart({ year }: { year: number }) {
  const data = useMonthlyChartData(year)
  return (
    <div className="rounded-xl border bg-white p-4">
      <p className="text-sm font-semibold text-gray-700 mb-3">Lợi nhuận theo tháng — {year}</p>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} />
          <YAxis tickFormatter={formatAxisValue} tick={{ fontSize: 11 }} width={48} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="#d1d5db" />
          <Line type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
