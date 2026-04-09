'use client'

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useWalletSession } from '@/app/hooks/useWalletSession'
import { TxStatusBadge } from './TxStatusBadge'

interface NetworkItem {
  network: string
  title: string
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
  direction?: 'sent' | 'received'
}

interface TransactionApiResponse {
  address: string
  page: number
  limit: number
  total: number
  transactions: TransactionItem[]
}

const pageSize = 20

function formatRelativeTime(timestamp: number) {
  const now = Date.now()
  const diffMs = now - timestamp
  const minutes = Math.round(diffMs / 60000)
  const hours = Math.round(diffMs / 3600000)
  const days = Math.round(diffMs / 86400000)

  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  return `${days} day${days === 1 ? '' : 's'} ago`
}

export function TransactionHistory() {
  const session = useWalletSession()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const initialPage = Number(searchParams.get('page') ?? '1') || 1
  const initialNetwork = searchParams.get('network') ?? 'all'
  const initialType = searchParams.get('type') ?? 'all'
  const initialStartDate = searchParams.get('startDate') ?? ''
  const initialEndDate = searchParams.get('endDate') ?? ''

  const [page, setPage] = useState(initialPage)
  const [networkFilter, setNetworkFilter] = useState(initialNetwork)
  const [typeFilter, setTypeFilter] = useState(initialType)
  const [startDate, setStartDate] = useState(initialStartDate)
  const [endDate, setEndDate] = useState(initialEndDate)

  useEffect(() => {
    setPage(initialPage)
    setNetworkFilter(initialNetwork)
    setTypeFilter(initialType)
    setStartDate(initialStartDate)
    setEndDate(initialEndDate)
  }, [
    initialPage,
    initialNetwork,
    initialType,
    initialStartDate,
    initialEndDate
  ])

  const updateParams = (params: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(params)) {
      if (value === null) {
        newParams.delete(key)
      } else {
        newParams.set(key, value)
      }
    }
    router.replace(`${pathname}?${newParams.toString()}`)
  }

  const { data: networkData } = useQuery({
    queryKey: ['networks'],
    queryFn: async () => {
      const response = await fetch('/api/networks')
      if (!response.ok) throw new Error('Unable to load networks')
      return response.json() as Promise<{ networks: NetworkItem[] }>
    }
  })

  const selectedAddress = session.address

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [
      'transactions',
      selectedAddress,
      page,
      networkFilter,
      typeFilter,
      startDate,
      endDate
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        address: selectedAddress ?? '',
        page: String(page),
        limit: String(pageSize)
      })

      if (networkFilter !== 'all') params.set('network', networkFilter)
      if (typeFilter !== 'all') params.set('type', typeFilter)
      if (startDate) params.set('startDate', startDate)
      if (endDate) params.set('endDate', endDate)

      const response = await fetch(`/api/tx?${params.toString()}`)
      if (!response.ok) throw new Error('Unable to load transactions')
      return response.json() as Promise<TransactionApiResponse>
    },
    enabled: !!selectedAddress
  })

  const transactions = data?.transactions ?? []
  const total = data?.total ?? 0
  const pageCount = Math.max(1, Math.ceil(total / pageSize))

  const title = useMemo(
    () =>
      networkFilter === 'all'
        ? 'All Networks'
        : (networkData?.networks?.find((n) => n.network === networkFilter)
            ?.title ?? networkFilter),
    [networkFilter, networkData]
  )

  const handleFilterChange = (next: {
    network?: string
    type?: string
    startDate?: string
    endDate?: string
  }) => {
    const nextPage =
      next.network || next.type || next.startDate || next.endDate ? 1 : page

    if (next.network !== undefined) setNetworkFilter(next.network)
    if (next.type !== undefined) setTypeFilter(next.type)
    if (next.startDate !== undefined) setStartDate(next.startDate)
    if (next.endDate !== undefined) setEndDate(next.endDate)
    setPage(nextPage)

    updateParams({
      page: String(nextPage),
      network: next.network ?? networkFilter,
      type: next.type ?? typeFilter,
      startDate:
        next.startDate !== undefined ? next.startDate : startDate || null,
      endDate: next.endDate !== undefined ? next.endDate : endDate || null
    })
  }

  const handlePage = (nextPage: number) => {
    setPage(nextPage)
    updateParams({ page: String(nextPage) })
  }

  if (!session.isConnected) {
    return null
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">
            Activity
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">
            Transaction History
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Showing {transactions.length} of {total} transactions for {title}.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:grid sm:grid-cols-4">
          <select
            value={networkFilter}
            onChange={(e) => handleFilterChange({ network: e.target.value })}
            className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-slate-400 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100">
            <option value="all">All Networks</option>
            {networkData?.networks?.map((network) => (
              <option key={network.network} value={network.network}>
                {network.title}
              </option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => handleFilterChange({ type: e.target.value })}
            className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-slate-400 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100">
            <option value="all">All Types</option>
            <option value="transfer">Transfer</option>
            <option value="receive">Receive</option>
            <option value="bridge">Bridge</option>
          </select>
          <input
            type="date"
            value={startDate}
            onChange={(e) => handleFilterChange({ startDate: e.target.value })}
            className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-slate-400 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => handleFilterChange({ endDate: e.target.value })}
            className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-slate-400 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/20">
        {isError ? (
          <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 p-6 text-slate-800 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-100">
            <p className="text-lg font-semibold">Unable to load transactions</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              There was a problem fetching transaction history. Please try
              again.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 inline-flex rounded-3xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm shadow-slate-200 transition hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800">
              Retry
            </button>
          </div>
        ) : isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-16 rounded-[1.5rem] bg-slate-100 dark:bg-slate-900"
              />
            ))}
          </div>
        ) : transactions.length ? (
          <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 dark:border-slate-800">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-800">
              <thead className="bg-white text-slate-600 dark:bg-slate-950 dark:text-slate-300">
                <tr>
                  <th className="px-4 py-3">Type</th>
                  <th className="hidden sm:table-cell px-4 py-3">Network</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white text-slate-700 dark:divide-slate-800 dark:bg-slate-950 dark:text-slate-200">
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>
                      <span className="px-4 py-4 text-slate-900 dark:text-white">
                        <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-900 dark:bg-slate-900 dark:text-slate-100">
                          {tx.type === 'bridge'
                            ? '⇄'
                            : tx.direction === 'received'
                              ? '↓'
                              : '↑'}
                        </span>
                        <span>
                          {tx.type === 'bridge'
                            ? 'Bridge'
                            : tx.direction === 'received'
                              ? 'Receive'
                              : 'Send'}
                        </span>
                      </span>
                    </td>
                    <td className="hidden sm:table-cell px-4 py-4">
                      {tx.networkTitle ?? tx.chain}
                    </td>
                    <td className="px-4 py-4">
                      {Number(tx.amount).toLocaleString(undefined, {
                        maximumFractionDigits: 4,
                        minimumFractionDigits: 0
                      })}{' '}
                      {tx.token}
                    </td>
                    <td className="px-4 py-4">
                      <TxStatusBadge status={tx.status} />
                    </td>
                    <td className="px-4 py-4 text-slate-900 dark:text-slate-100">
                      <div className="flex items-center gap-3">
                        <span>{formatRelativeTime(tx.timestamp)}</span>
                        <a
                          href={`${tx.explorerUrl ?? '#'}${tx.explorerUrl?.endsWith('/') ? '' : '/'}tx/${tx.txHash}`}
                          target="_blank"
                          rel="noreferrer"
                          title="View transaction on explorer"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-900 shadow-sm transition hover:bg-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 p-14 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              No transactions found
            </p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Try adjusting your filters to find matching history.
            </p>
          </div>
        )}

        {pageCount > 1 ? (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4 text-sm text-slate-700 dark:border-slate-800 dark:text-slate-300">
            <div>
              Page {page} of {pageCount}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handlePage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800">
                Prev
              </button>
              <button
                type="button"
                onClick={() => handlePage(Math.min(pageCount, page + 1))}
                disabled={page >= pageCount}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800">
                Next
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
