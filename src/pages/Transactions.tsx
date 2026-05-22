import { useState, useMemo } from 'react'
import { Plus, Search, X } from 'lucide-react'
import { getYear, getMonth } from 'date-fns'
import { useGroupedByDay, type FilterOptions } from '@/hooks/useTransactions'
import TransactionCard from '@/components/transaction/TransactionCard'
import TransactionForm from '@/components/transaction/TransactionForm'
import { formatCurrency, formatProfit, cn } from '@/lib/utils'
import type { OrderType, Result } from '@/types/transaction'

const now = new Date()
const currentYear = getYear(now)
const currentMonth = getMonth(now) + 1
const years = Array.from({ length: 5 }, (_, i) => currentYear - i)
const months = Array.from({ length: 12 }, (_, i) => i + 1)

export default function Transactions() {
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [year, setYear] = useState<number | undefined>(currentYear)
  const [month, setMonth] = useState<number | undefined>(currentMonth)
  const [orderType, setOrderType] = useState<OrderType | 'all'>('all')
  const [result, setResult] = useState<Result | 'all'>('all')

  const filters = useMemo<FilterOptions>(
    () => ({ year, month, orderType, result, search }),
    [year, month, orderType, result, search]
  )

  const groups = useGroupedByDay(filters)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Giao dịch</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} /> Thêm mới
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-blue-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Giao dịch mới</h3>
          <TransactionForm onDone={() => setShowForm(false)} />
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm lệnh, lý do..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border pl-8 pr-8 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={14} />
            </button>
          )}
        </div>

        <select
          value={year ?? ''}
          onChange={(e) => setYear(e.target.value ? Number(e.target.value) : undefined)}
          className={filterCls}
        >
          <option value="">Tất cả năm</option>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>

        <select
          value={month ?? ''}
          onChange={(e) => setMonth(e.target.value ? Number(e.target.value) : undefined)}
          className={filterCls}
        >
          <option value="">Tất cả tháng</option>
          {months.map((m) => <option key={m} value={m}>Tháng {m}</option>)}
        </select>

        <select value={orderType} onChange={(e) => setOrderType(e.target.value as OrderType | 'all')} className={filterCls}>
          <option value="all">Tất cả loại</option>
          <option value="bet_game">Bet Game</option>
          <option value="trading">Trading</option>
        </select>

        <select value={result} onChange={(e) => setResult(e.target.value as Result | 'all')} className={filterCls}>
          <option value="all">Tất cả kết quả</option>
          <option value="win">Thắng</option>
          <option value="lose">Thua</option>
          <option value="draw">Hòa</option>
        </select>
      </div>

      {groups.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">Không có giao dịch nào.</div>
      ) : (
        <div className="space-y-6">
          {groups.map((group) => (
            <div key={group.date}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600">{group.label}</h3>
                <span className={cn('text-sm font-bold', group.totalProfit >= 0 ? 'text-green-600' : 'text-red-600')}>
                  {formatProfit(group.totalProfit)}
                </span>
              </div>
              <div className="space-y-2">
                {group.transactions.map((tx) => (
                  <TransactionCard key={tx.id} tx={tx} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const filterCls = 'rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white'
