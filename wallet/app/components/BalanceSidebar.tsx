'use client'

import { useMemo, useState } from 'react'
import { useSettings } from '@/app/contexts/SettingsContext'
import { useToast } from '@/app/hooks/useToast'
import { useWalletSession } from '@/app/hooks/useWalletSession'
import { Skeleton } from './Skeleton'

export interface BalanceSidebarItem {
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

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 4,
    minimumFractionDigits: 0
  }).format(value)
}

function safeDecimal(value: string) {
  const parsed = parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

interface BalanceSidebarProps {
  balances: BalanceSidebarItem[]
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
  onTransfer?: (item: BalanceSidebarItem) => void
}

export function BalanceSidebar({
  balances,
  isLoading,
  isError,
  onRetry,
  onTransfer
}: BalanceSidebarProps) {
  const session = useWalletSession()
  const { settings } = useSettings()
  const { addToast } = useToast()
  const [addingToken, setAddingToken] = useState<Record<string, boolean>>({})
  const [addedToken, setAddedToken] = useState<Record<string, boolean>>({})

  const hasEthereum =
    typeof window !== 'undefined' &&
    session.isOwn &&
    Boolean((window as any).ethereum)

  const balancesContent = useMemo(() => {
    if (isError) {
      return (
        <div className="rounded-[2rem] border border-red-200 bg-red-50 p-6 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
          <p className="font-semibold">Unable to load balances</p>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Something went wrong while fetching wallet balances.
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 inline-flex items-center rounded-3xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm shadow-slate-200 transition hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800">
            Retry
          </button>
        </div>
      )
    }

    if (isLoading) {
      return (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-[1.5rem] border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
              <Skeleton className="h-14 w-full" />
            </div>
          ))}
        </div>
      )
    }

    return (
      <div className="space-y-3">
        {balances.map((balance) => {
          const isDefault = settings.defaultNetwork === balance.network
          const displayAmount = settings.showUsd
            ? `$${formatNumber(safeDecimal(balance.balance))}`
            : `${formatNumber(safeDecimal(balance.balance))} ${balance.symbol}`

          const isAdding = addingToken[balance.network]
          const isAdded = addedToken[balance.network]

          const handleAddToMetaMask = async () => {
            if (!hasEthereum) {
              addToast('MetaMask is not available in this browser.', 'error')
              return
            }

            const ethereum = (window as any).ethereum
            if (!ethereum?.request) {
              addToast('MetaMask is not available in this browser.', 'error')
              return
            }

            setAddingToken((current) => ({
              ...current,
              [balance.network]: true
            }))
            try {
              const added = await ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                  type: 'ERC20',
                  options: {
                    address: balance.contractAddress,
                    symbol: balance.symbol,
                    decimals: balance.decimals,
                    image: balance.logoUrl || undefined
                  }
                }
              })

              if (added) {
                setAddedToken((current) => ({
                  ...current,
                  [balance.network]: true
                }))
                addToast(`${balance.symbol} added to MetaMask.`, 'success')
              } else {
                addToast('Token addition canceled.', 'info')
              }
            } catch (error) {
              addToast('Could not add token to MetaMask.', 'error')
            } finally {
              setAddingToken((current) => ({
                ...current,
                [balance.network]: false
              }))
            }
          }

          return (
            <div
              key={balance.network}
              className={`flex flex-col gap-4 rounded-[1.5rem] border px-4 py-4 text-sm shadow-sm transition ${
                isDefault
                  ? 'border-emerald-500 bg-emerald-50/80 dark:border-emerald-400 dark:bg-emerald-900/30'
                  : 'border-emerald-100 bg-white/90 dark:border-emerald-900/40 dark:bg-slate-900/90'
              }`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold uppercase tracking-[0.14em] text-emerald-900 dark:text-emerald-200">
                    {balance.title}
                  </p>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    {displayAmount}
                  </p>
                </div>
                {isDefault ? (
                  <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                    Default
                  </span>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onTransfer?.(balance)}
                  className="rounded-3xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700">
                  Transfer
                </button>
                <button
                  type="button"
                  disabled
                  title="Coming soon"
                  className="rounded-3xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-400 cursor-not-allowed dark:bg-slate-900/40 dark:text-slate-600">
                  Bridge
                </button>
                {hasEthereum ? (
                  <button
                    type="button"
                    onClick={handleAddToMetaMask}
                    disabled={isAdding || isAdded}
                    className="rounded-3xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800">
                    {isAdded
                      ? 'Added to MetaMask'
                      : isAdding
                        ? 'Adding…'
                        : 'Add to MetaMask'}
                  </button>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>
    )
  }, [
    balances,
    isError,
    isLoading,
    onRetry,
    onTransfer,
    settings.defaultNetwork,
    settings.showUsd,
    hasEthereum,
    addingToken,
    addedToken,
    addToast
  ])

  return (
    <div className="rounded-[2rem] border border-emerald-200 bg-emerald-50/80 p-6 shadow-xl shadow-emerald-200/30 dark:border-emerald-700 dark:bg-slate-950/80 dark:shadow-emerald-900/25">
      <div className="flex flex-wrap items-center gap-3">
        <button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-emerald-500/30">
          Tether <span className="text-xs">(USDT)</span>
        </button>
        <button className="rounded-full border border-emerald-200 bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-200 dark:border-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200 dark:hover:bg-emerald-900/40">
          NexUSD <span className="text-xs">(Crypto)</span>
        </button>
      </div>

      <div className="mt-6">{balancesContent}</div>
    </div>
  )
}
