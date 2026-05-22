import { useMemo } from 'react'
import { format, parseISO, getYear, getMonth, getDate } from 'date-fns'
import { useTransactionStore } from '@/store/transactionStore'
import type { Transaction, Result, OrderType } from '@/types/transaction'

export interface DayGroup {
  date: string
  label: string
  transactions: Transaction[]
  totalProfit: number
}

export interface StatsResult {
  totalProfit: number
  totalCount: number
  winCount: number
  loseCount: number
  drawCount: number
  winRate: number
}

export interface FilterOptions {
  year?: number
  month?: number
  day?: number
  orderType?: OrderType | 'all'
  result?: Result | 'all'
  search?: string
}

function matchesFilter(tx: Transaction, filters: FilterOptions): boolean {
  const dt = parseISO(tx.entryTime)
  if (filters.year !== undefined && getYear(dt) !== filters.year) return false
  if (filters.month !== undefined && getMonth(dt) + 1 !== filters.month) return false
  if (filters.day !== undefined && getDate(dt) !== filters.day) return false
  if (filters.orderType && filters.orderType !== 'all' && tx.orderType !== filters.orderType) return false
  if (filters.result && filters.result !== 'all' && tx.result !== filters.result) return false
  if (filters.search) {
    const q = filters.search.toLowerCase()
    if (!tx.order.toLowerCase().includes(q) && !tx.reason.toLowerCase().includes(q)) return false
  }
  return true
}

export function useFilteredTransactions(filters: FilterOptions) {
  const transactions = useTransactionStore((s) => s.transactions)
  return useMemo(
    () => transactions.filter((tx) => matchesFilter(tx, filters)),
    [transactions, filters]
  )
}

export function useGroupedByDay(filters: FilterOptions): DayGroup[] {
  const filtered = useFilteredTransactions(filters)
  return useMemo(() => {
    const map = new Map<string, Transaction[]>()
    for (const tx of filtered) {
      const key = tx.entryTime.slice(0, 10)
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(tx)
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, txs]) => ({
        date,
        label: format(parseISO(date), 'dd/MM/yyyy'),
        transactions: txs.sort((a, b) => b.entryTime.localeCompare(a.entryTime)),
        totalProfit: txs.reduce((sum, tx) => sum + tx.profit, 0),
      }))
  }, [filtered])
}

export function useStats(filters: FilterOptions): StatsResult {
  const filtered = useFilteredTransactions(filters)
  return useMemo(() => {
    const totalProfit = filtered.reduce((sum, tx) => sum + tx.profit, 0)
    const totalCount = filtered.length
    const winCount = filtered.filter((tx) => tx.result === 'win').length
    const loseCount = filtered.filter((tx) => tx.result === 'lose').length
    const drawCount = filtered.filter((tx) => tx.result === 'draw').length
    const winRate = totalCount > 0 ? Math.round((winCount / totalCount) * 100) : 0
    return { totalProfit, totalCount, winCount, loseCount, drawCount, winRate }
  }, [filtered])
}

export function useDailyChartData(year: number, month: number) {
  const transactions = useTransactionStore((s) => s.transactions)
  return useMemo(() => {
    const daysInMonth = new Date(year, month, 0).getDate()
    const data = Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      profit: 0,
    }))
    for (const tx of transactions) {
      const dt = parseISO(tx.entryTime)
      if (getYear(dt) === year && getMonth(dt) + 1 === month) {
        data[getDate(dt) - 1]!.profit += tx.profit
      }
    }
    return data
  }, [transactions, year, month])
}

export function useMonthlyChartData(year: number) {
  const transactions = useTransactionStore((s) => s.transactions)
  return useMemo(() => {
    const data = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      label: `T${i + 1}`,
      profit: 0,
    }))
    for (const tx of transactions) {
      const dt = parseISO(tx.entryTime)
      if (getYear(dt) === year) {
        data[getMonth(dt)]!.profit += tx.profit
      }
    }
    return data
  }, [transactions, year])
}
