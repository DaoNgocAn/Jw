import { cn } from '@/lib/utils'

interface Props {
  label: string
  value: string
  sub?: string
  color?: 'green' | 'red' | 'blue' | 'gray'
}

const colors = {
  green: 'bg-green-50 border-green-200 text-green-700',
  red: 'bg-red-50 border-red-200 text-red-700',
  blue: 'bg-blue-50 border-blue-200 text-blue-700',
  gray: 'bg-gray-50 border-gray-200 text-gray-700',
}

export default function StatCard({ label, value, sub, color = 'blue' }: Props) {
  return (
    <div className={cn('rounded-xl border p-4 space-y-1', colors[color])}>
      <p className="text-xs font-medium opacity-70 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
      {sub && <p className="text-xs opacity-60">{sub}</p>}
    </div>
  )
}
