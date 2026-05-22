import { useState } from 'react'
import { getYear, getMonth, getDate } from 'date-fns'
import StatCard from '@/components/dashboard/StatCard'
import { DailyProfitChart, MonthlyProfitChart } from '@/components/dashboard/ProfitChart'
import { useStats } from '@/hooks/useTransactions'
import { formatCurrency, formatProfit } from '@/lib/utils'

type View = 'day' | 'month' | 'year'

const now = new Date()
const currentYear = getYear(now)
const currentMonth = getMonth(now) + 1
const currentDay = getDate(now)

export default function Dashboard() {
  const [view, setView] = useState<View>('month')
  const [year, setYear] = useState(currentYear)
  const [month, setMonth] = useState(currentMonth)

  const filters =
    view === 'day'
      ? { year, month, day: currentDay }
      : view === 'month'
      ? { year, month }
      : { year }

  const stats = useStats(filters)

  const profitColor =
    stats.totalProfit > 0 ? 'green' : stats.totalProfit < 0 ? 'red' : 'gray'

  const years = Array.from({ length: 5 }, (_, i) => currentYear - i)
  const months = Array.from({ length: 12 }, (_, i) => i + 1)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg border overflow-hidden">
          {(['day', 'month', 'year'] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                view === v ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {v === 'day' ? 'Ngày' : v === 'month' ? 'Tháng' : 'Năm'}
            </button>
          ))}
        </div>

        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="rounded-lg border px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>

        {(view === 'day' || view === 'month') && (
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="rounded-lg border px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {months.map((m) => <option key={m} value={m}>Tháng {m}</option>)}
          </select>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="col-span-2">
          <StatCard
            label="Tổng lợi nhuận"
            value={formatProfit(stats.totalProfit)}
            sub={`${stats.totalCount} giao dịch`}
            color={profitColor}
          />
        </div>
        <StatCard label="Win rate" value={`${stats.winRate}%`} color="blue" />
        <StatCard label="Thắng" value={String(stats.winCount)} color="green" />
        <StatCard label="Thua" value={String(stats.loseCount)} color="red" />
        <StatCard label="Hòa" value={String(stats.drawCount)} color="gray" />
      </div>

      {view !== 'year' && (
        <DailyProfitChart year={year} month={month} />
      )}
      <MonthlyProfitChart year={year} />

      {stats.totalCount === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm">
          Chưa có giao dịch nào trong khoảng thời gian này.
        </div>
      )}

      {stats.totalProfit !== 0 && (
        <div className="rounded-xl border bg-white p-4 text-sm text-gray-600">
          <p>
            <span className="font-medium">Tổng vốn thắng: </span>
            <span className="text-green-600 font-semibold">{formatCurrency(stats.totalProfit > 0 ? stats.totalProfit : 0)}</span>
            {' · '}
            <span className="font-medium">Tổng lỗ: </span>
            <span className="text-red-600 font-semibold">{formatCurrency(stats.totalProfit < 0 ? Math.abs(stats.totalProfit) : 0)}</span>
          </p>
        </div>
      )}
    </div>
  )
}
