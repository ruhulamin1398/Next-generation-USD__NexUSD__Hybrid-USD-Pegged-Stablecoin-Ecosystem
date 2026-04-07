'use client'

import { WalletGate } from '@/app/components/WalletGate'

export default function Home() {
  return (
    <WalletGate>
      <section className="rounded-[2rem] border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-950/90 dark:shadow-black/20">
        <div className="space-y-4">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">
              NexUSD Wallet
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Your wallet is ready.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
              Select the wallet mode at first launch. After that, the app will preserve the selected session for the current browser tab.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                What you can do next
              </p>
              <ul className="mt-4 space-y-3 text-sm text-slate-700 dark:text-slate-300">
                <li>• View your wallet address and connection status</li>
                <li>• Use demo wallet mode for fast testing</li>
                <li>• Open the wallet dashboard and transfer tools next</li>
              </ul>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                Demo wallet note
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
                The demo wallet only exposes an address for Stage 2. Private key operations stay on the server and will be used later for same-chain transfers.
              </p>
            </div>
          </div>
        </div>
      </section>
    </WalletGate>
  )
}
