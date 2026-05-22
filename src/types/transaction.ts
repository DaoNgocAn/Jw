export type OrderType = 'bet_game' | 'trading'
export type Result = 'win' | 'lose' | 'draw'

export interface Transaction {
  id: string
  entryTime: string
  order: string
  orderType: OrderType
  amount: number
  rate?: number
  cutOrder?: string
  cutAmount?: number
  profit: number
  result: Result
  reason: string
  createdAt: string
}

export interface TransactionFormData {
  entryTime: string
  order: string
  orderType: OrderType
  amount: number
  rate?: number
  cutOrder?: string
  cutAmount?: number
  profit: number
  reason: string
}

export const ORDER_TYPE_LABELS: Record<OrderType, string> = {
  bet_game: 'Bet Game',
  trading: 'Trading',
}

export const RESULT_LABELS: Record<Result, string> = {
  win: 'Thắng',
  lose: 'Thua',
  draw: 'Hòa',
}

export function calcResult(profit: number): Result {
  if (profit > 0) return 'win'
  if (profit < 0) return 'lose'
  return 'draw'
}
