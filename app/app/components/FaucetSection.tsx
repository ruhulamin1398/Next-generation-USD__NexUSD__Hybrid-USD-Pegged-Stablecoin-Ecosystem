import React, { useEffect, useState } from 'react'
import { useNetworkConfig } from '../hooks/useNetworkConfig'
import type { Network } from '../interfaces/network'

export const FaucetSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'fiat' | 'crypto'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>([])
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [networkAddressMap, setNetworkAddressMap] = useState<
    Record<string, string>
  >({})
  const { fiatNetworks, cryptoNetworks } = useNetworkConfig()

  const allNetworks = [...fiatNetworks, ...cryptoNetworks]

  const getNetworkKey = (network: Network) => `${network.type}:${network.name}`
  const availableNetworks =
    activeTab === 'fiat'
      ? fiatNetworks
      : activeTab === 'crypto'
        ? cryptoNetworks
        : allNetworks

  const filteredNetworks = availableNetworks.filter((network) =>
    network.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleNetworkClick = (network: Network) => {
    if (network.status === 'coming-soon') {
      setToastMessage(`${network.name} is coming soon. Stay tuned!`)
      return
    }

    setSelectedNetworks((prev) => {
      const key = getNetworkKey(network)
      if (prev.includes(key)) {
        const next = prev.filter((item) => item !== key)
        setNetworkAddressMap((addressMap) => {
          const { [key]: _, ...remaining } = addressMap
          return remaining
        })
        return next
      }
      return [...prev, key]
    })
  }

  const selectedNetworkItems = allNetworks.filter((network) =>
    selectedNetworks.includes(getNetworkKey(network))
  )

  const handleAddressChange = (network: Network, value: string) => {
    setNetworkAddressMap((prev) => ({
      ...prev,
      [getNetworkKey(network)]: value
    }))
  }

  type RequestState = {
    status: 'idle' | 'pending' | 'success' | 'error'
    txHash?: string
    error?: string
  }

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [networkRequestState, setNetworkRequestState] = useState<
    Record<string, RequestState>
  >({})

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)

  const resolveExplorerUrl = (network: Network, hash: string) => {
    if (!network.explorerUrl) return '#'
    const base = network.explorerUrl.replace(/\/address\/.*$/i, '')
    return base.endsWith('/') ? `${base}tx/${hash}` : `${base}/tx/${hash}`
  }

  const getRequestNetworkId = (network: Network) =>
    network.id || network.name.toLowerCase().replace(/\s+/g, '-')

  const handleGetTokens = async () => {
    setIsSubmitting(true)
    setNetworkRequestState((prev) => {
      const next = { ...prev }
      selectedNetworkItems.forEach((network) => {
        next[getNetworkKey(network)] = { status: 'pending' }
      })
      return next
    })

    await Promise.all(
      selectedNetworkItems.map(async (network) => {
        const key = getNetworkKey(network)
        const address = networkAddressMap[key]?.trim() ?? ''
        if (!address) {
          setNetworkRequestState((prev) => ({
            ...prev,
            [key]: { status: 'error', error: 'Address required' }
          }))
          return
        }

        try {
          const response = await fetch('/api/airdrop', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              network: getRequestNetworkId(network),
              address,
              amount: 500
            })
          })

          if (!response.ok) {
            const payload = await response.text()
            throw new Error(payload || response.statusText)
          }

          const data = await response.json()
          setNetworkRequestState((prev) => ({
            ...prev,
            [key]: {
              status: 'success',
              txHash: data.txHash ?? data.hash ?? ''
            }
          }))
        } catch (error) {
          setNetworkRequestState((prev) => ({
            ...prev,
            [key]: {
              status: 'error',
              error: error instanceof Error ? error.message : 'Request failed'
            }
          }))
        }
      })
    )

    setIsSubmitting(false)
    setToastMessage('Airdrop requests completed. Check your transaction links.')
  }

  useEffect(() => {
    if (!toastMessage) return
    const timer = window.setTimeout(() => setToastMessage(null), 2800)
    return () => window.clearTimeout(timer)
  }, [toastMessage])

  const isSelected = (network: Network) =>
    selectedNetworks.includes(getNetworkKey(network))

  return (
    <section className="py-16 sm:py-20 md:py-24 relative">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-purple-500 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-indigo-500 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 px-4">
            Request for free NexUSD
          </h1>
          {/* <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-3 md:mb-6 px-4">
            Get testnet NexUSD tokens for development and testing. Request up to{" "}
            <span className="text-gray-900 dark:text-white font-semibold">
              500 tokens
            </span>{" "}
            per request for both fiat-backed and crypto-backed implementations.
          </p> */}
        </div>

        {/* Faucet Filter + Network Cards */}
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-4 md:gap-6 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white">
                Choose Faucets
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Select one or more networks to request 500 NexUSD each.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="inline-flex flex-wrap items-center gap-2 rounded-2xl bg-gray-100 dark:bg-gray-700 p-2">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    activeTab === 'all'
                      ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-blue-500 shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}>
                  All
                </button>
                <button
                  onClick={() => setActiveTab('fiat')}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    activeTab === 'fiat'
                      ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-blue-500 shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}>
                  Fiat Backed
                </button>
                <button
                  onClick={() => setActiveTab('crypto')}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    activeTab === 'crypto'
                      ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-blue-500 shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}>
                  Crypto Backed
                </button>
              </div>
              <div className="relative flex-1 min-w-0">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search networks"
                  className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {toastMessage ? (
            <div className="mb-4 rounded-2xl border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-900 dark:border-yellow-600 dark:bg-yellow-950 dark:text-yellow-100">
              {toastMessage}
            </div>
          ) : null}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-28">
            {filteredNetworks.map((network) => {
              const LogoComponent = network.logo
              const isReactComponent = typeof network.logo === 'function'
              const disabled = network.status === 'coming-soon'

              return (
                <button
                  key={`${network.name}-${network.type}`}
                  type="button"
                  onClick={() => handleNetworkClick(network)}
                  disabled={disabled}
                  className={`relative group text-left rounded-3xl border p-6 bg-white dark:bg-gray-900 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    disabled
                      ? 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500'
                      : isSelected(network)
                        ? 'border-blue-500 ring-1 ring-blue-500'
                        : 'border-gray-200 dark:border-gray-700 hover:shadow-lg'
                  }`}>
                  <div className="flex items-start justify-between  gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-white">
                        {isReactComponent ? (
                          <LogoComponent />
                        ) : (
                          <img
                            src={network.logo as string}
                            alt={network.name}
                            className="w-8 h-8 object-contain"
                          />
                        )}
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          {network.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          500 NexUSD{' '}
                          {network.type === 'fiat'
                            ? '(fiat-backed)'
                            : '(crypto-backed)'}
                        </div>
                      </div>
                    </div>
                    <div>
                      {network.status === 'coming-soon' ? (
                        <div className="inline-flex rounded-full px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] transition-colors duration-200 bg-orange-100 text-orange-800  ">
                          Coming&nbsp;Soon
                        </div>
                      ) : (
                        <div
                          className={`flex items-center justify-center h-10 w-10 rounded-full border-2 transition-colors duration-200 ${
                            isSelected(network)
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}>
                          <span
                            className={`inline-block h-3 w-3 rounded-full ${
                              isSelected(network)
                                ? 'bg-white'
                                : 'bg-transparent'
                            }`}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {selectedNetworks.length > 0 && (
            <div className="fixed left-0 right-0 bottom-4 z-30 mx-auto w-full max-w-5xl rounded-3xl border border-gray-200 bg-white/95 p-4 shadow-xl shadow-gray-300/10 backdrop-blur-xl dark:border-gray-700 dark:bg-gray-950/95 dark:shadow-black/20">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedNetworks.length} network(s) selected
                </div>
                <button
                  type="button"
                  disabled={selectedNetworks.length === 0}
                  onClick={handleOpenModal}
                  className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 text-white font-semibold shadow-lg transition-colors duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400">
                  Continue
                </button>
              </div>
            </div>
          )}

          {isModalOpen && (
            <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4 py-6 sm:px-6">
              <div className="w-full max-w-3xl overflow-hidden rounded-[32px] bg-white text-gray-900 shadow-2xl dark:bg-gray-950 dark:text-white">
                <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5 dark:border-gray-800">
                  <div>
                    <h2 className="text-2xl font-semibold">Get tokens</h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      Confirm your addresses and get the tokens.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="rounded-full border border-gray-200 bg-white p-2 text-gray-500 transition hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white">
                    ×
                  </button>
                </div>

                <div className="divide-y divide-gray-200 max-h-[65vh] overflow-y-auto dark:divide-gray-800">
                  {selectedNetworkItems.map((network) => {
                    const key = getNetworkKey(network)
                    return (
                      <div key={key} className="px-6 py-5 last:pb-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
                              {typeof network.logo === 'function' ? (
                                <network.logo />
                              ) : (
                                <img
                                  src={network.logo as string}
                                  alt={network.name}
                                  className="h-8 w-8 object-contain"
                                />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="truncate text-base font-semibold">
                                {network.name}
                              </div>
                              <div className="truncate text-sm text-gray-500 dark:text-gray-400">
                                500 NexUSD •{' '}
                                {network.type === 'fiat'
                                  ? 'Fiat-backed'
                                  : 'Crypto-backed'}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end sm:flex-1">
                            <label
                              className="sr-only"
                              htmlFor={`address-${key}`}>
                              Wallet address for {network.name}
                            </label>
                            <input
                              id={`address-${key}`}
                              type="text"
                              value={networkAddressMap[key] ?? ''}
                              onChange={(event) =>
                                handleAddressChange(network, event.target.value)
                              }
                              placeholder="Enter wallet address"
                              disabled={
                                Boolean(
                                  networkRequestState[key]?.status === 'success'
                                ) || isSubmitting
                              }
                              className="min-w-0 flex-1 rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-500"
                            />
                            {networkRequestState[key]?.status === 'success' &&
                            networkRequestState[key]?.txHash ? (
                              <a
                                href={resolveExplorerUrl(
                                  network,
                                  networkRequestState[key]!.txHash!
                                )}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex flex-shrink-0 items-center justify-center rounded-2xl border border-emerald-500 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-400 dark:bg-emerald-900/60 dark:text-emerald-200 dark:hover:bg-emerald-800">
                                View transaction
                              </a>
                            ) : networkRequestState[key]?.status ===
                              'pending' ? (
                              <div className="inline-flex flex-shrink-0 items-center justify-center rounded-2xl border border-gray-200 bg-white p-3 text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                                <svg
                                  className="h-4 w-4 animate-spin"
                                  viewBox="0 0 24 24">
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                  />
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                  />
                                </svg>
                              </div>
                            ) : networkRequestState[key]?.status === 'error' ? (
                              <div className="inline-flex flex-shrink-0 items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-500/40 dark:bg-red-900/30 dark:text-red-200">
                                Error
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedNetworks((prev) =>
                                    prev.filter((item) => item !== key)
                                  )
                                  setNetworkAddressMap((prev) => {
                                    const { [key]: _, ...remaining } = prev
                                    return remaining
                                  })
                                }}
                                className="inline-flex flex-shrink-0 items-center justify-center rounded-2xl border border-gray-200 bg-white p-3 text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800">
                                <span className="sr-only">Remove</span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="h-4 w-4">
                                  <line x1="18" y1="6" x2="6" y2="18" />
                                  <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="border-t border-gray-200 px-6 py-5 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={handleGetTokens}
                    className="w-full rounded-2xl bg-blue-600 px-6 py-3 text-white font-semibold shadow-lg transition-colors duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                    disabled={
                      isSubmitting ||
                      selectedNetworkItems.length === 0 ||
                      selectedNetworkItems.every(
                        (network) =>
                          networkRequestState[getNetworkKey(network)]
                            ?.status === 'success'
                      )
                    }>
                    {isSubmitting
                      ? 'Requesting…'
                      : selectedNetworkItems.every(
                            (network) =>
                              networkRequestState[getNetworkKey(network)]
                                ?.status === 'success'
                          )
                        ? 'Transactions ready'
                        : 'Get tokens'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Important Notes */}
        <div className="max-w-4xl mx-auto mt-12 p-6 bg-gray-100 dark:bg-gray-800 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Important Notes:
          </h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            <li>• Maximum 500 NexUSD tokens per request</li>
            <li>• Only testnet networks are supported</li>
            <li>• Tokens are for testing and development purposes only</li>
            <li>• Ensure you have enough gas tokens for the target network</li>
            <li>• Transaction may take a few minutes to complete</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
