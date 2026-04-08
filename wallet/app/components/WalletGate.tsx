'use client'

import { useDisconnect } from 'wagmi'
import { useWalletSession } from '@/app/hooks/useWalletSession'
import { useEffect, useRef, useState } from 'react'
import { ConnectModal } from './ConnectModal'

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function WalletGate({ children }: { children: React.ReactNode }) {
  const session = useWalletSession()
  const { disconnect } = useDisconnect()
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    if (session.ready && !session.isConnected) {
      setShowLogin(true)
    }
    if (session.isConnected) {
      setShowLogin(false)
    }
  }, [session.isConnected, session.ready])

  const disconnectHandler = async () => {
    if (session.isDummy) {
      session.disconnectDummy()
      setShowLogin(true)
      return
    }

    try {
      await disconnect()
      setShowLogin(true)
    } catch {
      // swallow disconnect errors for UI simplicity
    }
  }

  if (!session.ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <p className="rounded-3xl border border-slate-200 bg-white/90 px-6 py-4 text-sm text-slate-700 shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-950/90 dark:text-slate-300">
          Restoring wallet session...
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {!session.isConnected && showLogin ? (
        <ConnectModal
          onSelectDummy={session.connectDummy}
          dummyLoading={session.dummyLoading}
          dummyError={session.dummyError}
        />
      ) : null}

      {session.isConnected ? (
        <div className="min-h-screen">
          <main className="w-full  ">{children}</main>
        </div>
      ) : null}
    </div>
  )
}
