'use client'

import { useToast } from '@/app/hooks/useToast'

const toastStyle: Record<string, string> = {
  success:
    'border-emerald-500/20 bg-emerald-50 text-emerald-900 dark:border-emerald-400/20 dark:bg-emerald-900/90 dark:text-emerald-100',
  error:
    'border-rose-500/20 bg-rose-50 text-rose-900 dark:border-rose-400/20 dark:bg-rose-950/90 dark:text-rose-100',
  info: 'border-sky-500/20 bg-sky-50 text-sky-900 dark:border-sky-400/20 dark:bg-sky-950/90 dark:text-sky-100'
}

export function Toast() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex w-full max-w-sm flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          data-testid="toast"
          className={`pointer-events-auto flex items-start justify-between gap-4 rounded-3xl border px-4 py-4 shadow-xl shadow-slate-900/5 transition-all ${toastStyle[toast.type]}`}>
          <div className="space-y-1">
            <p className="text-sm font-semibold">
              {toast.type === 'success'
                ? 'Success'
                : toast.type === 'error'
                  ? 'Error'
                  : 'Info'}
            </p>
            <p className="text-sm leading-6 text-current">{toast.message}</p>
          </div>
          <button
            type="button"
            onClick={() => removeToast(toast.id)}
            className="rounded-full border border-current/10 bg-white/70 px-2 py-1 text-xs font-semibold text-current shadow-sm transition hover:bg-white dark:bg-slate-950/80">
            Close
          </button>
        </div>
      ))}
    </div>
  )
}
