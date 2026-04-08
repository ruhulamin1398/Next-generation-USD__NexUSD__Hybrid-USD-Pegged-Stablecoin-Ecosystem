'use client'

import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useDisconnect } from 'wagmi'
import { useWalletSession } from '@/app/hooks/useWalletSession'
import { BalanceSidebar, BalanceSidebarItem } from './BalanceSidebar'

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

interface TransactionItem {
  id: string
  txHash: string
  chain: string
  type: string
  token: string
  tokenType: string
  amount: string
  from: string
  to: string
  status: string
  timestamp: number
  networkTitle?: string
  explorerUrl?: string
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 4,
    minimumFractionDigits: 0
  }).format(value)
}

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

function safeDecimal(value: string) {
  const parsed = parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function createFakeTxHash() {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const bytes = new Uint8Array(32)
    crypto.getRandomValues(bytes)
    return `0x${Array.from(bytes)
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('')}`
  }

  return `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`
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

async function fetchTransactions(address: string): Promise<TransactionItem[]> {
  const response = await fetch(
    `/api/tx?address=${encodeURIComponent(address)}&limit=5`
  )
  if (!response.ok) {
    throw new Error('Unable to load recent transactions.')
  }

  const data = await response.json()
  return data.transactions ?? []
}

async function saveTransfer(body: Record<string, unknown>) {
  const response = await fetch('/api/tx/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    const payload = await response.json().catch(() => null)
    throw new Error(payload?.error || 'Unable to save transfer record.')
  }

  return response.json()
}

export function WalletDashboard() {
  const session = useWalletSession()
  const { disconnect } = useDisconnect()
  const queryClient = useQueryClient()
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [selectedNetwork, setSelectedNetwork] = useState<string>('')
  const [transferStatus, setTransferStatus] = useState<string | null>(null)

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

  const balancesQuery = useQuery({
    queryKey: ['balances', session.address],
    queryFn: () => fetchBalances(session.address ?? ''),
    enabled: !!session.address
  })

  const transactionsQuery = useQuery({
    queryKey: ['transactions', session.address],
    queryFn: () => fetchTransactions(session.address ?? ''),
    enabled: !!session.address
  })

  const transferMutation = useMutation({
    mutationFn: async () => {
      const current = balancesQuery.data?.find(
        (item) => item.network === selectedNetwork
      )
      if (!session.address || !current) {
        throw new Error('Please choose a network before sending.')
      }

      const amountValue = parseFloat(amount)
      if (
        !recipient ||
        !/^0x[0-9a-fA-F]{40}$/.test(recipient) ||
        amountValue <= 0
      ) {
        throw new Error('Please enter a valid recipient address and amount.')
      }

      const txHash = createFakeTxHash()

      return saveTransfer({
        address: session.address,
        chain: current.network,
        txHash,
        type: 'transfer',
        amount,
        token: current.symbol,
        tokenType: current.tokenType,
        from: session.address,
        to: recipient,
        status: 'pending',
        timestamp: Date.now(),
        metadata: {
          networkTitle: current.title,
          explorerUrl: current.explorerUrl
        }
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['transactions', session.address]
      })
      queryClient.invalidateQueries({ queryKey: ['balances', session.address] })
      setRecipient('')
      setAmount('')
      setTransferStatus(
        'Transfer recorded successfully. Transaction will appear in history shortly.'
      )
    },
    onError: (error: unknown) => {
      setTransferStatus(
        error instanceof Error ? error.message : 'Transfer failed.'
      )
    }
  })

  useEffect(() => {
    if (balancesQuery.data?.length && !selectedNetwork) {
      setSelectedNetwork(balancesQuery.data[0].network)
    }
  }, [balancesQuery.data, selectedNetwork])

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

  const recentTransactions = transactionsQuery.data ?? []

  const sidebarBalances = balancesQuery.data?.length ? balancesQuery.data : []

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <main className="mx-auto flex w-full max-w-[1600px] flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="space-y-6">
            <BalanceSidebar balances={sidebarBalances} />
          </aside>

          <section className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/20">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">
                    Transaction Activity
                  </p>
                  <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">
                    Transaction Activity
                  </h1>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    balancesQuery.refetch()
                    transactionsQuery.refetch()
                  }}
                  className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200">
                  Refresh data
                </button>
              </div>

              <div className="mt-6 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-10 text-center dark:border-slate-800 dark:bg-slate-900">
                {transactionsQuery.isLoading ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Loading activity...
                  </p>
                ) : recentTransactions.length ? (
                  <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 dark:border-slate-800">
                    <table className="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-800">
                      <thead className="bg-white text-slate-600 dark:bg-slate-950 dark:text-slate-300">
                        <tr>
                          <th className="px-4 py-3">Type</th>
                          <th className="px-4 py-3">Network</th>
                          <th className="px-4 py-3">Amount</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white text-slate-700 dark:divide-slate-800 dark:bg-slate-950 dark:text-slate-200">
                        {recentTransactions.map((tx) => (
                          <tr key={tx.id}>
                            <td className="px-4 py-4 font-semibold text-slate-900 dark:text-white">
                              {tx.type}
                            </td>
                            <td className="px-4 py-4">
                              {tx.networkTitle ?? tx.chain}
                            </td>
                            <td className="px-4 py-4">
                              {formatNumber(safeDecimal(tx.amount))} {tx.token}
                            </td>
                            <td className="px-4 py-4">
                              <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                                {tx.status}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <span>
                                {new Date(tx.timestamp).toLocaleDateString()}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-white p-14 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      You don't have any transactions
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
