'use client'

import { WalletGate } from '@/app/components/WalletGate'
import { TransactionHistory } from '@/app/components/TransactionHistory'

export default function HistoryPage() {
  return (
    <WalletGate>
      <TransactionHistory />
    </WalletGate>
  )
}
