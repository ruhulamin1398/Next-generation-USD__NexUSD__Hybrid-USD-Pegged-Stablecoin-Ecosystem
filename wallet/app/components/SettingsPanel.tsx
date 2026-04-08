'use client'

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSettings } from '@/app/contexts/SettingsContext'

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { settings, setDefaultNetwork, setShowUsd, setTheme } = useSettings()

  const { data } = useQuery({
    queryKey: ['networks'],
    queryFn: async () => {
      const response = await fetch('/api/networks')
      if (!response.ok) throw new Error('Unable to load networks')
      return response.json() as Promise<{
        networks: Array<{ network: string; title: string }>
      }>
    }
  })

  const networkOptions = useMemo(() => data?.networks ?? [], [data])

  return (
    <div
      className={`fixed inset-0 z-40 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'} transition-all`}>
      <div
        className={`absolute inset-0 bg-slate-950/50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md transform bg-white p-6 shadow-2xl transition-transform duration-300 dark:bg-slate-950 dark:text-slate-100 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              Settings
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
              Wallet preferences
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800">
            Close
          </button>
        </div>

        <div className="mt-8 space-y-8">
          <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Default network
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Choose the network to highlight in your balance sidebar.
            </p>
            <select
              value={settings.defaultNetwork}
              onChange={(event) => setDefaultNetwork(event.target.value)}
              className="mt-4 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-slate-400 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100">
              <option value="">No default network</option>
              {networkOptions.map((network) => (
                <option key={network.network} value={network.network}>
                  {network.title}
                </option>
              ))}
            </select>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Display settings
            </h3>
            <div className="mt-4 flex items-center justify-between gap-4 rounded-3xl bg-white px-4 py-4 shadow-sm dark:bg-slate-950">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  Show USD value
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Toggle between USD and raw token amounts.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowUsd(!settings.showUsd)}
                className={`h-10 w-20 rounded-full p-1 transition ${settings.showUsd ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'}`}>
                <span
                  className={`block h-8 w-8 rounded-full bg-white transition-transform ${settings.showUsd ? 'translate-x-10' : 'translate-x-0'}`}
                />
              </button>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Theme
            </h3>
            <div className="mt-4 space-y-3">
              {(['system', 'light', 'dark'] as const).map((option) => (
                <label
                  key={option}
                  className="flex cursor-pointer items-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-950">
                  <input
                    type="radio"
                    name="theme"
                    value={option}
                    checked={settings.theme === option}
                    onChange={() => setTheme(option)}
                    className="h-4 w-4 accent-emerald-600"
                  />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {option === 'system'
                        ? 'System'
                        : option === 'light'
                          ? 'Light'
                          : 'Dark'}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {option === 'system'
                        ? 'Follow your device preference.'
                        : option === 'light'
                          ? 'Use light mode.'
                          : 'Use dark mode.'}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </section>
        </div>
      </aside>
    </div>
  )
}
