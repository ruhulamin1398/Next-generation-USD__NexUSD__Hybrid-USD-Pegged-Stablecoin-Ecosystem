'use client'

import { useModal } from 'connectkit'

interface ConnectModalProps {
  onSelectDummy: () => Promise<void>
  dummyLoading: boolean
  dummyError: string | null
}

export function ConnectModal({
  onSelectDummy,
  dummyLoading,
  dummyError
}: ConnectModalProps) {
  const { setOpen } = useModal()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 text-slate-950 dark:text-slate-100">
      <div className="w-full max-w-lg overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-950">
        <div className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">
            NexUSD Wallet
          </p>
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">
            Connect wallet to continue
          </h2>
          {/* <p className="mx-auto max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            Choose your own wallet or open the demo wallet mode for an instant
            preview.
          </p> */}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex min-h-[4.5rem] items-center justify-center rounded-3xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800">
            Use own wallet
          </button>

          <button
            type="button"
            onClick={onSelectDummy}
            disabled={dummyLoading}
            className="flex min-h-[4.5rem] items-center justify-center rounded-3xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-slate-950">
            {dummyLoading ? 'Starting demo wallet...' : 'Use demo wallet'}
          </button>
        </div>

        {dummyError ? (
          <div className="mt-5 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-200">
            {dummyError}
          </div>
        ) : null}

        <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          <p className="font-medium text-slate-900 dark:text-slate-100">
            Demo wallet mode
          </p>
          <p className="mt-1">
            Choose your own wallet or open the demo wallet mode for an instant
            preview.
          </p>
        </div>
      </div>
    </div>
  )
}
