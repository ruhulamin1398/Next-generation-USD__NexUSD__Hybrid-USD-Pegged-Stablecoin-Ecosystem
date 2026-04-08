'use client'

import { useState } from 'react'
import Link from 'next/link'

interface WalletHeaderProps {
  address: string | null
  isDummy?: boolean
  onDisconnect: () => Promise<void> | void
  onSettingsClick?: () => void
}

export function WalletHeader({
  address,
  isDummy,
  onDisconnect,
  onSettingsClick
}: WalletHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

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

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 md:hidden">
            <span className="text-xl">☰</span>
          </button>

          <div className="hidden items-center gap-2 md:flex">
            <div className="rounded-full bg-amber-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
              {address
                ? `${address.slice(0, 6)}...${address.slice(-4)}`
                : 'Not connected'}
            </div>
            {address ? (
              <button
                type="button"
                onClick={onDisconnect}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800">
                Disconnect
              </button>
            ) : null}

            {onSettingsClick ? (
              <button
                type="button"
                onClick={onSettingsClick}
                aria-label="Settings"
                className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800">
                ⚙️
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {mobileOpen ? (
        <div className="absolute inset-x-0 top-full z-40 border-t border-slate-200 bg-white px-4 py-4 shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 md:hidden">
          <div className="flex flex-col gap-3">
            <Link
              href="https://nex-usd.vercel.app/faucet#faucet"
              target="_blank"
              className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800">
              Faucet
            </Link>
            <button
              type="button"
              onClick={onSettingsClick}
              aria-label="Settings"
              className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800">
              ⚙️
            </button>
            <button
              type="button"
              onClick={onDisconnect}
              className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800">
              Disconnect
            </button>
          </div>
        </div>
      ) : null}
    </header>
  )
}
