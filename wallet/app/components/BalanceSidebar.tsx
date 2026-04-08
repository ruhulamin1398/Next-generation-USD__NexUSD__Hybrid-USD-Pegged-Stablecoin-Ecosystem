'use client'

export interface BalanceSidebarItem {
  network: string
  title: string
  contractAddress: string
  explorerUrl?: string
  logoUrl?: string
  symbol: string
  decimals: number
  balance: string
  tokenType: string
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 4,
    minimumFractionDigits: 0
  }).format(value)
}

function safeDecimal(value: string) {
  const parsed = parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

interface BalanceSidebarProps {
  balances: BalanceSidebarItem[]
  onTransfer?: (item: BalanceSidebarItem) => void
}

export function BalanceSidebar({ balances, onTransfer }: BalanceSidebarProps) {
  return (
    <div className="rounded-[2rem] border border-emerald-200 bg-emerald-50/80 p-6 shadow-xl shadow-emerald-200/30 dark:border-emerald-700 dark:bg-slate-950/80 dark:shadow-emerald-900/25">
      <div className="flex flex-wrap items-center gap-3">
        <button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-emerald-500/30">
          Tether <span className="text-xs">(USDT)</span>
        </button>
        <button className="rounded-full border border-emerald-200 bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-200 dark:border-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200 dark:hover:bg-emerald-900/40">
          NexUSD <span className="text-xs">(Crypto)</span>
        </button>
      </div>

      <div className="mt-6">
        <div className="space-y-3">
          {balances.map((balance) => (
            <div
              key={balance.network}
              className="flex items-center justify-between gap-1 rounded-[1.5rem] border border-emerald-100 bg-white/90 px-4 py-4 text-sm text-slate-900 shadow-sm shadow-emerald-100 dark:border-emerald-900/40 dark:bg-slate-900/90 dark:text-slate-100">
              <div>
                <p className="font-semibold text-emerald-900 dark:text-emerald-200 uppercase">
                  {balance.title}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  $ {formatNumber(safeDecimal(balance.balance))}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onTransfer?.(balance)}
                  className="rounded-3xl bg-emerald-100 px-4 py-2 text-xs font-semibold text-emerald-900 transition hover:bg-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-200 dark:hover:bg-emerald-900/40">
                  Transfer
                </button>
                <button
                  type="button"
                  disabled
                  title="Coming soon"
                  className="rounded-3xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-400 cursor-not-allowed dark:bg-slate-900/40 dark:text-slate-600">
                  Bridge
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
