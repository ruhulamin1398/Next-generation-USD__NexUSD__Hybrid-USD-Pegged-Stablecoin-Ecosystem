'use client'

export function WalletFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white/95 px-4 py-5 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950/95 dark:text-slate-400 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-4">
          <a
            href="#"
            className="transition hover:text-slate-900 dark:hover:text-slate-100">
            Knowledge Base
          </a>
          <a
            href="#"
            className="transition hover:text-slate-900 dark:hover:text-slate-100">
            Transparency
          </a>
          <a
            href="#"
            className="transition hover:text-slate-900 dark:hover:text-slate-100">
            Legal
          </a>
          <a
            href="#"
            className="transition hover:text-slate-900 dark:hover:text-slate-100">
            Fees
          </a>
          <a
            href="#"
            className="transition hover:text-slate-900 dark:hover:text-slate-100">
            Cookie settings
          </a>
        </div>
        <div>© 2013 - 2026 Tether Operations Limited. All rights reserved.</div>
      </div>
    </footer>
  )
}
