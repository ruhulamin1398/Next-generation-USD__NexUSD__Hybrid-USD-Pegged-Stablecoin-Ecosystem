import React, { useEffect, useState } from 'react'
import { useNetworkConfig } from '../hooks/useNetworkConfig'
import type { Network } from '../interfaces/network'

export const FaucetSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'fiat' | 'crypto'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>([])
  const [toastMessage, setToastMessage] = useState<string | null>(null)
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
        return prev.filter((item) => item !== key)
      }
      return [...prev, key]
    })
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
                  className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 text-white font-semibold shadow-lg transition-colors duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400">
                  Continue
                </button>
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
