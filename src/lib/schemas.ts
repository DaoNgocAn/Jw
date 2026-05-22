import { z } from 'zod'

export const transactionSchema = z.object({
  entryTime: z.string().min(1, 'Vui lòng chọn giờ vào lệnh'),
  order: z.string().min(1, 'Vui lòng nhập tên lệnh'),
  orderType: z.enum(['bet_game', 'trading']),
  amount: z.coerce.number().min(1, 'Tiền vào phải lớn hơn 0'),
  rate: z.coerce.number().optional(),
  cutOrder: z.string().optional(),
  cutAmount: z.coerce.number().optional(),
  profit: z.coerce.number(),
  reason: z.string().min(1, 'Vui lòng nhập lý do vào lệnh'),
})

export type TransactionSchema = z.infer<typeof transactionSchema>
