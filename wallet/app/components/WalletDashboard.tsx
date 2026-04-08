'use client'

import { useEffect, useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useDisconnect } from 'wagmi'
import { useWalletSession } from '@/app/hooks/useWalletSession'
import { useToast } from '@/app/hooks/useToast'
import { BalanceSidebar, BalanceSidebarItem } from './BalanceSidebar'
import { TransferModal } from './TransferModal'
import { TransactionHistory } from './TransactionHistory'

export interface BalanceItem {
  network: string
  title: string
  contractAddress: string
  explorerUrl?: string
  logoUrl?: string
  symbol: string
  decimals: number
  balance: string
  tokenType: string
}

function safeDecimal(value: string) {
  const parsed = parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

async function fetchBalances(address: string): Promise<BalanceItem[]> {
  const response = await fetch('/api/balances', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address })
  })

  if (!response.ok) {
    throw new Error('Unable to load balances.')
  }

  const data = await response.json()
  return data.balances ?? []
}

export function WalletDashboard() {
  const session = useWalletSession()
  const { disconnect } = useDisconnect()
  const queryClient = useQueryClient()
  const [transferTarget, setTransferTarget] =
    useState<BalanceSidebarItem | null>(null)

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

  const { addToast } = useToast()

  const balancesQuery = useQuery({
    queryKey: ['balances', session.address],
    queryFn: () => fetchBalances(session.address ?? ''),
    enabled: !!session.address
  })

  useEffect(() => {
    if (balancesQuery.isError) {
      addToast('Could not load balances.', 'error')
    }
  }, [balancesQuery.isError, addToast])

  const totalBalance = useMemo(
    () =>
      balancesQuery.data?.reduce(
        (sum, item) => sum + safeDecimal(item.balance),
        0
      ) ?? 0,
    [balancesQuery.data]
  )

  const tokens = useMemo(
    () => balancesQuery.data?.map((item) => item.title).join(' · ') ?? '-',
    [balancesQuery.data]
  )

  const sidebarBalances = balancesQuery.data?.length ? balancesQuery.data : []

  const handleTransferSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: ['transactions', session.address]
    })
    queryClient.invalidateQueries({ queryKey: ['balances', session.address] })
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <main className="mx-auto flex w-full max-w-[1600px] flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="space-y-6">
            <BalanceSidebar
              balances={sidebarBalances}
              isLoading={balancesQuery.isLoading}
              isError={balancesQuery.isError}
              onRetry={() => balancesQuery.refetch()}
              onTransfer={setTransferTarget}
            />
          </aside>

          <section className="space-y-6">
            <TransactionHistory />
          </section>
        </div>
      </main>
      <TransferModal
        isOpen={Boolean(transferTarget)}
        onClose={() => setTransferTarget(null)}
        balance={transferTarget}
        fromAddress={session.address}
        onSuccess={handleTransferSuccess}
      />
    </div>
  )
}
