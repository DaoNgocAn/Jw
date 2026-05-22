import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { transactionSchema, type TransactionSchema } from '@/lib/schemas'
import { ORDER_TYPE_LABELS, type Transaction } from '@/types/transaction'
import { useTransactionStore } from '@/store/transactionStore'

interface Props {
  editing?: Transaction
  onDone: () => void
}

export default function TransactionForm({ editing, onDone }: Props) {
  const { add, update } = useTransactionStore()

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<TransactionSchema>({
    resolver: zodResolver(transactionSchema),
    defaultValues: editing
      ? {
          entryTime: editing.entryTime.slice(0, 16),
          order: editing.order,
          orderType: editing.orderType,
          amount: editing.amount,
          rate: editing.rate,
          cutOrder: editing.cutOrder,
          cutAmount: editing.cutAmount,
          profit: editing.profit,
          reason: editing.reason,
        }
      : {
          entryTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
          orderType: 'trading',
        },
  })

  const orderType = watch('orderType')
  const isBetGame = orderType === 'bet_game'

  useEffect(() => {
    if (!isBetGame) {
      reset((v) => ({ ...v, rate: undefined, cutOrder: undefined, cutAmount: undefined }))
    }
  }, [isBetGame, reset])

  function onSubmit(data: TransactionSchema) {
    if (editing) {
      update(editing.id, data)
    } else {
      add(data)
    }
    onDone()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Giờ vào lệnh" error={errors.entryTime?.message}>
          <input type="datetime-local" {...register('entryTime')} className={inputCls} />
        </Field>

        <Field label="Loại lệnh" error={errors.orderType?.message}>
          <select {...register('orderType')} className={inputCls}>
            {(Object.keys(ORDER_TYPE_LABELS) as Array<keyof typeof ORDER_TYPE_LABELS>).map((k) => (
              <option key={k} value={k}>{ORDER_TYPE_LABELS[k]}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Tên lệnh / Ký hiệu" error={errors.order?.message}>
        <input type="text" placeholder="VD: BTC/USDT, Over 2.5..." {...register('order')} className={inputCls} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Tiền vào (VNĐ)" error={errors.amount?.message}>
          <input type="number" min={0} {...register('amount')} className={inputCls} />
        </Field>

        <Field label="Lợi nhuận (VNĐ)" error={errors.profit?.message}>
          <input type="number" {...register('profit')} className={inputCls} />
        </Field>
      </div>

      {isBetGame && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 space-y-4">
          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Thông tin Bet Game</p>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Rate / Tỉ lệ" error={errors.rate?.message}>
              <input type="number" step="0.01" min={0} {...register('rate')} className={inputCls} />
            </Field>
            <Field label="Lệnh cắt" error={errors.cutOrder?.message}>
              <input type="text" placeholder="VD: Under 1.5" {...register('cutOrder')} className={inputCls} />
            </Field>
            <Field label="Tiền cắt (VNĐ)" error={errors.cutAmount?.message}>
              <input type="number" min={0} {...register('cutAmount')} className={inputCls} />
            </Field>
          </div>
        </div>
      )}

      <Field label="Lý do vào lệnh" error={errors.reason?.message}>
        <textarea rows={3} placeholder="Phân tích, tín hiệu, lý do vào lệnh..." {...register('reason')} className={inputCls} />
      </Field>

      <div className="flex gap-3 pt-2">
        <button type="submit" className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
          {editing ? 'Cập nhật' : 'Thêm giao dịch'}
        </button>
        <button type="button" onClick={onDone} className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-gray-50 transition-colors">
          Hủy
        </button>
      </div>
    </form>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

const inputCls =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
