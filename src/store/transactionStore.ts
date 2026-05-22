import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import { type Transaction, type TransactionFormData, calcResult } from '@/types/transaction'
import { SAMPLE_TRANSACTIONS } from '@/lib/seedData'

interface TransactionStore {
  transactions: Transaction[]
  add: (data: TransactionFormData) => void
  update: (id: string, data: TransactionFormData) => void
  remove: (id: string) => void
  importAll: (data: Transaction[]) => void
}

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set) => ({
      transactions: SAMPLE_TRANSACTIONS,

      add: (data) => {
        const tx: Transaction = {
          ...data,
          id: uuidv4(),
          result: calcResult(data.profit),
          createdAt: new Date().toISOString(),
        }
        set((s) => ({ transactions: [tx, ...s.transactions] }))
      },

      update: (id, data) => {
        set((s) => ({
          transactions: s.transactions.map((tx) =>
            tx.id === id
              ? { ...tx, ...data, result: calcResult(data.profit) }
              : tx
          ),
        }))
      },

      remove: (id) => {
        set((s) => ({ transactions: s.transactions.filter((tx) => tx.id !== id) }))
      },

      importAll: (data) => {
        set({ transactions: data })
      },
    }),
    { name: 'ghichep_transactions' }
  )
)
