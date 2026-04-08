'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  createPublicClient,
  encodeFunctionData,
  formatUnits,
  http,
  parseUnits
} from 'viem'
import { estimateContractGas } from 'viem/actions'
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi'
import { useToast } from '@/app/hooks/useToast'
import { useWalletSession } from '@/app/hooks/useWalletSession'
import { NETWORK_CHAIN_IDS } from '@/lib/networks'
import type { BalanceSidebarItem } from './BalanceSidebar'

const TRANSFER_ABI = [
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'bool' }]
  }
] as const

function getFriendlyErrorMessage(error: unknown) {
  const extractMessage = (value: unknown): string => {
    if (typeof value === 'string') return value
    if (value instanceof Error) return value.message
    if (typeof value === 'object' && value !== null) {
      const obj = value as Record<string, unknown>
      const nestedKeys = [
        'message',
        'error',
        'reason',
        'shortMessage',
        'data',
        'body',
        'details',
        'cause'
      ] as const
      for (const key of nestedKeys) {
        const nested = obj[key]
        if (typeof nested === 'string' && nested.trim()) return nested
        if (nested && typeof nested === 'object') {
          const nestedMessage = extractMessage(nested)
          if (nestedMessage) return nestedMessage
        }
      }
      if (Array.isArray(obj.errors)) {
        const combined = obj.errors
          .map(extractMessage)
          .filter(Boolean)
          .join('; ')
        if (combined) return combined
      }
    }
    return String(value)
  }

  const rawMessage = extractMessage(error)
  const message = rawMessage.replace(/^Error:\s*/i, '').trim()
  const errorPayload =
    typeof error === 'object' && error !== null
      ? JSON.stringify(error, Object.getOwnPropertyNames(error))
      : ''
  const customErrorDetected =
    /custom error/i.test(message) ||
    /unknown custom error/i.test(message) ||
    /custom error/i.test(errorPayload)

  if (customErrorDetected) {
    return 'Transaction failed due to a contract error. Please verify the transfer details and try again.'
  }

  if (/execution reverted/i.test(message)) {
    return 'Transaction failed on-chain. Please verify the recipient, amount, and token approval.'
  }

  if (/insufficient funds/i.test(message)) {
    return 'Insufficient balance to cover the transfer and fees.'
  }

  if (/replacement fee too low|transaction underpriced/i.test(message)) {
    return 'Gas settings were too low. Please try again with a higher fee.'
  }

  if (/call exception|call_exception|CALL_EXCEPTION/i.test(message)) {
    return 'The transaction reverted during execution. Check the contract call and try again.'
  }

  if (/action="estimateGas"|estimateGas/i.test(message)) {
    return 'Gas estimation failed. The contract call may be invalid or the recipient may be incorrect.'
  }

  return 'Transaction failed. Please try again.'
}

interface TransferModalProps {
  isOpen: boolean
  onClose: () => void
  balance: BalanceSidebarItem | null
  fromAddress: string | null
  onSuccess: () => void
}

export function TransferModal({
  isOpen,
  onClose,
  balance,
  fromAddress,
  onSuccess
}: TransferModalProps) {
  const session = useWalletSession()
  const { addToast } = useToast()
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [estimatedGas, setEstimatedGas] = useState<string | null>(null)

  const parsedAmount = useMemo(() => {
    if (!balance || !amount) return null
    try {
      return parseUnits(amount, balance.decimals)
    } catch {
      return null
    }
  }, [amount, balance])

  const validRecipient = /^0x[0-9a-fA-F]{40}$/.test(recipient)
  const balanceValue = parseFloat(balance?.balance ?? '0')
  const amountValue = parseFloat(amount)
  const sufficientBalance =
    !Number.isNaN(amountValue) && amountValue > 0 && amountValue <= balanceValue
  const canSend =
    !!balance &&
    validRecipient &&
    !!parsedAmount &&
    sufficientBalance &&
    !!fromAddress

  useEffect(() => {
    let cancelled = false

    async function loadEstimate() {
      if (!balance || !validRecipient || !parsedAmount || !fromAddress) {
        setEstimatedGas(null)
        return
      }

      setEstimatedGas('Fetching estimate...')

      try {
        const response = await fetch('/api/networks')
        if (!response.ok)
          throw new Error('Failed to load network configuration')

        const data = await response.json()
        const networkInfo = data.networks?.find(
          (item: any) => item.network === balance.network
        )
        if (!networkInfo?.rpcUrl) throw new Error('RPC URL not available')

        const client = createPublicClient({
          transport: http(networkInfo.rpcUrl)
        })
        const gas = await estimateContractGas(client, {
          address: balance.contractAddress as `0x${string}`,
          abi: TRANSFER_ABI,
          functionName: 'transfer',
          args: [recipient as `0x${string}`, parsedAmount],
          account: fromAddress as `0x${string}`
        })

        if (!cancelled) {
          setEstimatedGas(`${formatUnits(gas, 9)} gwei`)
        }
      } catch {
        if (!cancelled) {
          setEstimatedGas('Estimate unavailable')
        }
      }
    }

    loadEstimate()

    return () => {
      cancelled = true
    }
  }, [balance, parsedAmount, recipient, validRecipient, fromAddress])

  const request = useMemo(() => {
    if (!balance || !parsedAmount || !validRecipient) return undefined

    return {
      to: balance.contractAddress as `0x${string}`,
      data: encodeFunctionData({
        abi: TRANSFER_ABI,
        functionName: 'transfer',
        args: [recipient as `0x${string}`, parsedAmount]
      })
    }
  }, [balance, parsedAmount, recipient, validRecipient])

  const sendResult = useSendTransaction({
    mutation: {
      onError(err) {
        const message = getFriendlyErrorMessage(err)
        setError(message)
        addToast(`Transfer failed: ${message}`, 'error')
      },
      onSuccess(data) {
        setTxHash(data as string)
        setStatusMessage('Transaction submitted. Waiting for confirmation...')
        addToast('Transfer submitted. Waiting for confirmation...', 'info')
      }
    }
  })

  const isWriteLoading = sendResult.status === 'pending'
  const sendError = sendResult.error
  const sendTransactionAsync = sendResult.mutateAsync

  const receiptResult = useWaitForTransactionReceipt({
    hash: txHash ? (txHash as `0x${string}`) : undefined,
    chainId: balance ? NETWORK_CHAIN_IDS[balance.network] : undefined
  })

  useEffect(() => {
    if (!isConfirmed && receiptResult.isSuccess) {
      setIsConfirmed(true)
      setStatusMessage('Transfer confirmed successfully.')
      addToast('Transfer confirmed successfully.', 'success')
      onSuccess()
    }
  }, [receiptResult.isSuccess, isConfirmed, onSuccess, addToast])

  useEffect(() => {
    if (receiptResult.isError) {
      addToast('Transaction failed to confirm.', 'error')
      setError('Transaction failed to confirm.')
    }
  }, [receiptResult.isError, addToast])

  useEffect(() => {
    if (!isOpen) {
      setRecipient('')
      setAmount('')
      setError(null)
      setStatusMessage(null)
      setTxHash(null)
      setIsConfirmed(false)
    }
  }, [isOpen])

  const handleMax = () => {
    setAmount(balance?.balance ?? '')
  }

  const submitDummyTransfer = async () => {
    if (!balance || !fromAddress || !canSend) return

    setError(null)
    setStatusMessage('Submitting transfer via demo wallet...')

    try {
      const response = await fetch('/api/tx/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          network: balance.network,
          contractAddress: balance.contractAddress,
          to: recipient,
          amount,
          decimals: balance.decimals,
          fromAddress
        })
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.error || 'Dummy transfer failed')
      }

      setTxHash(data.txHash)
      setStatusMessage('Transfer submitted. Waiting for confirmation...')
    } catch (err: unknown) {
      const message = getFriendlyErrorMessage(err)
      setError(message)
      setStatusMessage(null)
      addToast(`Dummy transfer failed: ${message}`, 'error')
    }
  }

  const handleSend = async () => {
    if (!balance || !fromAddress) {
      setError('Transfer data is incomplete.')
      return
    }

    if (!validRecipient) {
      setError('Please enter a valid recipient address.')
      return
    }

    if (!sufficientBalance) {
      setError('Please enter an amount within your available balance.')
      return
    }

    setError(null)

    if (session.isDummy) {
      await submitDummyTransfer()
      return
    }

    if (!sendTransactionAsync || !request) {
      setError('Unable to submit transaction. Please try again.')
      return
    }

    setStatusMessage('Sending transaction...')
    try {
      await sendTransactionAsync({
        to: request.to,
        data: request.data
      })
    } catch (err: unknown) {
      setError(getFriendlyErrorMessage(err))
    }
  }

  const handleSave = async () => {
    if (!txHash || !balance || !fromAddress) return

    try {
      await fetch('/api/tx/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: fromAddress,
          chain: balance.network,
          txHash,
          type: 'transfer',
          amount,
          token: balance.symbol,
          tokenType: balance.tokenType as 'fiat' | 'crypto',
          from: fromAddress,
          to: recipient,
          status: 'confirmed',
          timestamp: Date.now(),
          metadata: {
            networkTitle: balance.title,
            explorerUrl: balance.explorerUrl
          }
        })
      })
    } catch {
      addToast('Transfer sent but history save failed.', 'info')
    }
  }

  useEffect(() => {
    if (receiptResult.isSuccess) {
      void handleSave()
    }
  }, [receiptResult.isSuccess])

  if (!isOpen || !balance) {
    return null
  }

  const explorerTxUrl = txHash
    ? `${balance.explorerUrl ?? '#'}${balance.explorerUrl?.endsWith('/') ? '' : '/'}tx/${txHash}`
    : '#'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-10">
      <div className="w-full max-w-2xl rounded-[2rem] bg-white p-6 shadow-2xl shadow-slate-950/20 dark:bg-slate-950 dark:text-slate-100">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              Transfer NexUSD
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">
              {balance.title}
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Balance: ${balance.balance}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800">
            Close
          </button>
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Recipient address
            </label>
            <input
              value={recipient}
              onChange={(event) => setRecipient(event.target.value)}
              placeholder="0x..."
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-600 dark:focus:ring-slate-800"
            />
          </div>

          <div>
            <div className="flex items-center justify-between gap-4">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Amount (NexUSD)
              </label>
              <button
                type="button"
                onClick={handleMax}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 transition hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
                MAX
              </button>
            </div>
            <input
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="0.00"
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-600 dark:focus:ring-slate-800"
            />
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            <p>Estimated fee: {estimatedGas ?? 'Pending...'}</p>
          </div>

          {error ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </div>
          ) : null}

          {statusMessage ? (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
              {statusMessage}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-3xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800">
              Cancel
            </button>
            {isConfirmed && txHash ? (
              <a
                href={explorerTxUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-3xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">
                View on blockchain
              </a>
            ) : (
              <button
                type="button"
                onClick={handleSend}
                disabled={
                  !canSend ||
                  isWriteLoading ||
                  receiptResult.isLoading ||
                  Boolean(txHash && !isConfirmed)
                }
                className="rounded-3xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500">
                {receiptResult.isLoading || isWriteLoading
                  ? 'Sending…'
                  : 'Send Transfer'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
