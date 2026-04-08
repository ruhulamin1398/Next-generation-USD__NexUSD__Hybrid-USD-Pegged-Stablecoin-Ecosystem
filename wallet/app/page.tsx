'use client'

import { WalletGate } from '@/app/components/WalletGate'
import { WalletDashboard } from '@/app/components/WalletDashboard'

export default function Home() {
  return (
    <WalletGate>
      <WalletDashboard />
    </WalletGate>
  )
}
