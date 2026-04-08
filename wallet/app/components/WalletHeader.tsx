'use client'

import Link from 'next/link'

interface WalletHeaderProps {
  address: string | null
  onDisconnect: () => Promise<void> | void
}

export function WalletHeader({ address, onDisconnect }: WalletHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-4 shadow-sm shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-950/95 dark:shadow-black/10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 bg-gray-900 dark:bg-gray-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            NexUSD Wallet
          </span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <button className="rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white">
            Announcements
          </button>
          <button className="rounded-full bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm shadow-slate-900/10 transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200">
            Transactions
          </button>
          <button className="rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white">
            Deposit
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm shadow-slate-200/40 dark:bg-slate-900 dark:text-slate-100 dark:shadow-black/10">
            {address
              ? `${address.slice(0, 6)}...${address.slice(-4)}`
              : 'Connected'}
          </div>
          <button
            type="button"
            onClick={onDisconnect}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800">
            Disconnect
          </button>
        </div>
      </div>
    </header>
  )
}
