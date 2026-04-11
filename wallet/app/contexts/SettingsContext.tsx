'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type ThemeOption = 'light' | 'dark' | 'system'

export interface AppSettings {
  defaultNetwork: string
  showUsd: boolean
  theme: ThemeOption
}

interface SettingsContextValue {
  settings: AppSettings
  setDefaultNetwork: (network: string) => void
  setShowUsd: (show: boolean) => void
  setTheme: (theme: ThemeOption) => void
  isSettingsOpen: boolean
  openSettings: () => void
  closeSettings: () => void
}

const SettingsContext = createContext<SettingsContextValue | undefined>(
  undefined
)

const STORAGE_KEY = 'nexusd_settings'

const initialSettings: AppSettings = {
  defaultNetwork: '',
  showUsd: false,
  theme: 'system'
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(initialSettings)
  const [isSettingsOpen, setSettingsOpen] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return

    try {
      const parsed = JSON.parse(stored) as Partial<AppSettings>
      setSettings((current) => ({
        defaultNetwork:
          typeof parsed.defaultNetwork === 'string'
            ? parsed.defaultNetwork
            : current.defaultNetwork,
        showUsd:
          typeof parsed.showUsd === 'boolean'
            ? parsed.showUsd
            : current.showUsd,
        theme:
          parsed.theme === 'light' ||
          parsed.theme === 'dark' ||
          parsed.theme === 'system'
            ? parsed.theme
            : current.theme
      }))
    } catch {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    if (typeof document === 'undefined') return
    const html = document.documentElement
    html.classList.remove('light', 'dark')

    if (settings.theme === 'dark') {
      html.classList.add('dark')
    }
  }, [settings.theme])

  const value = useMemo(
    () => ({
      settings,
      setDefaultNetwork: (network: string) =>
        setSettings((current) => ({ ...current, defaultNetwork: network })),
      setShowUsd: (show: boolean) =>
        setSettings((current) => ({ ...current, showUsd: show })),
      setTheme: (theme: ThemeOption) =>
        setSettings((current) => ({ ...current, theme })),
      isSettingsOpen,
      openSettings: () => setSettingsOpen(true),
      closeSettings: () => setSettingsOpen(false)
    }),
    [settings, isSettingsOpen]
  )

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
