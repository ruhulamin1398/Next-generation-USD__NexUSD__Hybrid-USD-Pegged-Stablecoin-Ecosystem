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

interface FaucetResult {
  network: string
  title: string
  status: 'success' | 'error'
  message: string
  txHash?: string
  explorerUrl?: string
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
  const [faucetLoading, setFaucetLoading] = useState<Record<string, boolean>>(
    {}
  )
  const [faucetResult, setFaucetResult] = useState<FaucetResult | null>(null)

  const hasEthereum =
    typeof window !== 'undefined' &&
    session.isOwn &&
    Boolean((window as any).ethereum)

  const isFaucetLoading = (network: string) => Boolean(faucetLoading[network])

  const handleFaucet = async (balance: BalanceSidebarItem) => {
    if (!session.address) {
      addToast('Please connect a wallet before using the faucet.', 'error')
      return
    }

    setFaucetLoading((current) => ({
      ...current,
      [balance.network]: true
    }))

    try {
      const response = await fetch('/api/faucet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          network: balance.network,
          address: session.address
        })
      })

      const data = await response.json()
      if (!response.ok) {
        const message = data?.error || 'Faucet request failed.'
        setFaucetResult({
          network: balance.network,
          title: balance.title,
          status: 'error',
          message,
          txHash: data?.txHash,
          explorerUrl:
            data?.txHash && balance.explorerUrl
              ? `${balance.explorerUrl.replace(/\/$/, '')}/tx/${data.txHash}`
              : undefined
        })
        addToast(message, 'error')
        return
      }

      setFaucetResult({
        network: balance.network,
        title: balance.title,
        status: 'success',
        message: data?.status
          ? `Faucet completed: ${data.status}`
          : 'Faucet completed successfully.',
        txHash: data?.txHash,
        explorerUrl:
          data?.txHash && balance.explorerUrl
            ? `${balance.explorerUrl.replace(/\/$/, '')}/tx/${data.txHash}`
            : undefined
      })
      addToast('Faucet request completed.', 'success')
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Faucet request failed.'
      setFaucetResult({
        network: balance.network,
        title: balance.title,
        status: 'error',
        message,
        txHash: undefined
      })
      addToast(message, 'error')
    } finally {
      setFaucetLoading((current) => ({
        ...current,
        [balance.network]: false
      }))
    }
  }

  const closeFaucetModal = () => setFaucetResult(null)

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
                  className="rounded-3xl bg-slate-100 px-4 py-2 text-xs font-semibold text-gray-600 cursor-pointer  dark:bg-slate-900/40 dark:text-slate-600 hover:bg-emerald-700 hover:text-white dark:hover:bg-emerald-700 dark:hover:text-white border border-gray-300 dark:border-slate-700">
                  Transfer
                </button>
                <button
                  type="button"
                  disabled
                  title="Coming soon"
                  className="rounded-3xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-400 cursor-not-allowed dark:bg-slate-900/40 dark:text-slate-600 border border-gray-300 dark:border-slate-700">
                  Bridge
                </button>
                <button
                  type="button"
                  onClick={() => handleFaucet(balance)}
                  disabled={isFaucetLoading(balance.network)}
                  className="rounded-3xl bg-slate-100 px-4 py-2 text-xs font-semibold text-gray-600 transition disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-900/40 dark:text-slate-600 hover:bg-emerald-700 hover:text-white dark:hover:bg-emerald-700 dark:hover:text-white border border-gray-300 dark:border-slate-700">
                  {isFaucetLoading(balance.network) ? 'Requesting…' : 'Faucet'}
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
    faucetLoading,
    addToast
  ])

  return (
    <div className="relative rounded-[2rem] border border-emerald-200 bg-emerald-50/80 p-6 shadow-xl shadow-emerald-200/30 dark:border-emerald-700 dark:bg-slate-950/80 dark:shadow-emerald-900/25">
      {faucetResult ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 px-4 py-6 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-0 shadow-[0_30px_80px_rgba(15,23,42,0.25)] dark:border-slate-800 dark:from-slate-950 dark:to-slate-900">
            <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-500" />
            <div className="relative p-6 sm:p-8">
              <div className="flex flex-col gap-4 rounded-[2rem] bg-white/95 p-6 shadow-xl shadow-slate-900/10 backdrop-blur dark:bg-slate-950/95 dark:text-slate-100">
                <div className="flex items-start gap-4">
                  <div
                    className={`mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-3xl text-lg font-semibold shadow-sm ${
                      faucetResult.status === 'success'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
                    }`}>
                    {faucetResult.status === 'success' ? '✓' : '!'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">
                        Faucet{' '}
                        {faucetResult.status === 'success'
                          ? 'Completed'
                          : 'Failed'}
                      </span>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          faucetResult.status === 'success'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200'
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200'
                        }`}>
                        {faucetResult.status === 'success'
                          ? 'Success'
                          : 'Error'}
                      </span>
                    </div>
                    <h2 className=" text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                      {faucetResult.title}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={closeFaucetModal}
                    className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-700 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
                    ✕
                  </button>
                </div>

                <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 text-sm leading-7 text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                  <p className="text-base leading-7">{faucetResult.message}</p>
                  {faucetResult.txHash ? (
                    faucetResult.explorerUrl ? (
                      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                          Transaction ID:{' '}
                          <span className="font-mono text-slate-700 dark:text-slate-200">
                            {faucetResult.txHash}
                          </span>
                        </p>
                        <a
                          href={faucetResult.explorerUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center rounded-3xl bg-gradient-to-r from-emerald-600 to-cyan-500 px-5 py-3 text-xs font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:opacity-95">
                          View&nbsp;transaction
                        </a>
                      </div>
                    ) : (
                      <p className="mt-5 text-xs text-slate-500 dark:text-slate-400">
                        TX: {faucetResult.txHash}
                      </p>
                    )
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

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
