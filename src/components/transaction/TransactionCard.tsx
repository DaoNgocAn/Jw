import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { type Transaction, ORDER_TYPE_LABELS, RESULT_LABELS } from '@/types/transaction'
import { useTransactionStore } from '@/store/transactionStore'
import { cn, formatCurrency, formatProfit } from '@/lib/utils'
import TransactionForm from './TransactionForm'

const resultColor: Record<string, string> = {
  win: 'text-green-600 bg-green-50 border-green-200',
  lose: 'text-red-600 bg-red-50 border-red-200',
  draw: 'text-gray-600 bg-gray-50 border-gray-200',
}

const profitColor: Record<string, string> = {
  win: 'text-green-600',
  lose: 'text-red-600',
  draw: 'text-gray-500',
}

export default function TransactionCard({ tx }: { tx: Transaction }) {
  const remove = useTransactionStore((s) => s.remove)
  const [editing, setEditing] = useState(false)
  const [expanded, setExpanded] = useState(false)

  if (editing) {
    return (
      <div className="rounded-xl border border-blue-200 bg-white p-4 shadow-sm">
        <TransactionForm editing={tx} onDone={() => setEditing(false)} />
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-gray-900">{tx.order}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
              {ORDER_TYPE_LABELS[tx.orderType]}
            </span>
            <span className={cn('text-xs px-2 py-0.5 rounded-full border font-medium', resultColor[tx.result])}>
              {RESULT_LABELS[tx.result]}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            {format(parseISO(tx.entryTime), 'HH:mm')} · Vào: {formatCurrency(tx.amount)}
          </p>
        </div>
        <span className={cn('font-bold text-base shrink-0', profitColor[tx.result])}>
          {formatProfit(tx.profit)}
        </span>
        {expanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </div>

      {expanded && (
        <div className="border-t px-4 py-3 bg-gray-50 space-y-2">
          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-700">Lý do: </span>{tx.reason}
          </p>
          {tx.orderType === 'bet_game' && (
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {tx.rate !== undefined && (
                <span><span className="font-medium text-gray-700">Tỉ lệ:</span> {tx.rate}x</span>
              )}
              {tx.cutOrder && (
                <span><span className="font-medium text-gray-700">Cắt:</span> {tx.cutOrder}</span>
              )}
              {tx.cutAmount !== undefined && (
                <span><span className="font-medium text-gray-700">Tiền cắt:</span> {formatCurrency(tx.cutAmount)}</span>
              )}
            </div>
          )}
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
            >
              <Pencil size={13} /> Sửa
            </button>
            <button
              onClick={() => { if (confirm('Xóa giao dịch này?')) remove(tx.id) }}
              className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50 transition-colors"
            >
              <Trash2 size={13} /> Xóa
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
