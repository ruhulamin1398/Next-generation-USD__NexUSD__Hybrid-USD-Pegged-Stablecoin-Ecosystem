'use client'

import { useState } from 'react'
import { useDisconnect } from 'wagmi'
import { useWalletSession } from './hooks/useWalletSession'
import { WalletHeader } from './components/WalletHeader'
import { SettingsPanel } from './components/SettingsPanel'
import { Toast } from './components/Toast'
import { SettingsProvider } from './contexts/SettingsContext'

export function WalletShell({ children }: { children: React.ReactNode }) {
  const session = useWalletSession()
  const { disconnect } = useDisconnect()
  const [settingsOpen, setSettingsOpen] = useState(false)

  const disconnectHandler = async () => {
    if (session.isDummy) {
      session.disconnectDummy()
      return
    }

    try {
      await disconnect()
    } catch {
      // ignore disconnect errors for better UX
    }
  }

  return (
    <SettingsProvider>
      <WalletHeader
        address={session.address}
        isDummy={session.isDummy}
        onDisconnect={disconnectHandler}
        onSettingsClick={() => setSettingsOpen(true)}
      />
      {children}
      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
      <Toast />
    </SettingsProvider>
  )
}
