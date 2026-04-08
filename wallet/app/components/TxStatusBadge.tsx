'use client'

interface TxStatusBadgeProps {
  status: string
}

const statusStyles: Record<string, string> = {
  confirmed:
    'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  pending:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
}

export function TxStatusBadge({ status }: TxStatusBadgeProps) {
  const cls =
    statusStyles[status.toLowerCase()] ||
    'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${cls}`}>
      {status}
    </span>
  )
}
