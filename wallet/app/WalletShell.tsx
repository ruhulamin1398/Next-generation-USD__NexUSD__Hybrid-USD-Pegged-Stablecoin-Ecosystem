'use client'

import { useDisconnect } from 'wagmi'
import { useWalletSession } from './hooks/useWalletSession'
import { WalletHeader } from './components/WalletHeader'

export function WalletShell({ children }: { children: React.ReactNode }) {
  const session = useWalletSession()
  const { disconnect } = useDisconnect()

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
    <>
      <WalletHeader
        address={session.address}
        onDisconnect={disconnectHandler}
      />
      {children}
    </>
  )
}
