'use client'

import { useEffect, useState } from 'react'
import { useNetworkConfig } from '../hooks/useNetworkConfig'
import { Network } from '../interfaces/network'
import Link from 'next/link'

export default function MultiChainSection() {
  const [activeTab, setActiveTab] = useState('fiat')
  const { cryptoNetworks, fiatNetworks, isLoading, error } = useNetworkConfig()

  const cryptoBackedNetworks = cryptoNetworks
  const fiatBackedNetworks = fiatNetworks

  useEffect(() => {
    // Reset to fiat tab if there is an error loading crypto networks
    console.log('Crypto Networks:', cryptoBackedNetworks)
    console.log('Fiat Networks:', fiatBackedNetworks)
  }, [fiatBackedNetworks])

  const handleNetworkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <section
      id="multichain"
      className="relative py-16 sm:py-20 md:py-24 bg-white dark:bg-gray-800 transition-colors duration-300 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-purple-500 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-indigo-500 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 px-4">
            NexUSD Goes Multi-Chain
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-3 md:mb-6 px-4">
            Access NexUSD across multiple blockchain testnet networks with both{' '}
            <span className="text-gray-900 dark:text-white font-semibold">
              crypto-backed
            </span>{' '}
            and{' '}
            <span className="text-gray-900 dark:text-white font-semibold">
              fiat-backed
            </span>{' '}
            implementations.{' '}
            <Link
              href="/faucet#faucet"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors duration-200">
              Get free NexUSD tokens here
            </Link>
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8 sm:mb-12">
          <div className="inline-flex rounded-xl bg-gray-100 dark:bg-gray-700 p-1 sm:p-2">
            <button
              onClick={() => setActiveTab('fiat')}
              className={`px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 ${
                activeTab === 'fiat'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}>
              Fiat Backed
            </button>
            <button
              onClick={() => setActiveTab('crypto')}
              className={`px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 ${
                activeTab === 'crypto'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}>
              Crypto Backed
            </button>
          </div>
        </div>

        {/* Networks Grid */}
        <div className="transition-all duration-500 ease-in-out">
          {isLoading && activeTab === 'fiat' ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 dark:border-gray-600 dark:border-t-white rounded-full animate-spin"></div>
            </div>
          ) : error && activeTab === 'fiat' ? (
            <div className="text-center py-20 text-red-500 dark:text-red-400">
              <p>Failed to load fiat networks: {error}</p>
            </div>
          ) : (
            <>
              {activeTab === 'crypto' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                  {cryptoBackedNetworks.map((network, index) => (
                    <NetworkCard
                      key={`crypto-${index}`}
                      network={network}
                      onClick={() => handleNetworkClick(network.url)}
                    />
                  ))}
                </div>
              )}

              {activeTab === 'fiat' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                  {fiatBackedNetworks.map((network, index) => (
                    <NetworkCard
                      key={`fiat-${index}`}
                      network={network}
                      onClick={() => handleNetworkClick(network.url)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Note */}
        {/* <div className="text-center mt-12 sm:mt-16">
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
            NexUSD testnet deployments across multiple blockchain networks for
            both crypto-backed and fiat-backed implementations. Click on any
            network to view the testnet block explorer.
          </p>
        </div> */}
      </div>
    </section>
  )
}

// Network Card Component
interface NetworkCardProps {
  network: Network
  onClick: () => void
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString()
}

function NetworkCard({ network, onClick }: NetworkCardProps) {
  const LogoComponent = network.logo
  const isReactComponent = typeof network.logo === 'function'
  const isComingSoon = network.status === 'coming-soon'
  const hasStats =
    network.totalSupply !== undefined ||
    network.totalHolders !== undefined ||
    network.totalTransferred !== undefined

  return (
    <div
      className={`group relative flex flex-col bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden ${
        isComingSoon ? 'opacity-70' : ''
      }`}>
      {/* Status pill */}
      <div className="absolute top-3 right-3 z-10">
        {isComingSoon ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border border-amber-200 dark:border-amber-700">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
            Soon
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
            Live
          </span>
        )}
      </div>

      {/* Card top: logo + name */}
      <div className="flex flex-col items-center pt-6 pb-4 px-4">
        <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 p-2 shadow-sm">
          {isReactComponent ? (
            <LogoComponent />
          ) : (
            <img
              src={network.logo as string}
              alt={`${network.name} logo`}
              className="w-full h-full object-contain"
            />
          )}
        </div>
        <h3 className="text-sm font-bold text-gray-900 dark:text-white text-center leading-tight">
          {network.name}
        </h3>
      </div>

      {/* Divider */}
      {hasStats && <div className="mx-4 h-px bg-gray-100 dark:bg-gray-800" />}

      {/* Stats grid */}
      {hasStats && (
        <div className="grid grid-cols-3 gap-px bg-gray-100 dark:bg-gray-800 mx-4 my-3 rounded-xl overflow-hidden text-center">
          <div className="bg-white dark:bg-gray-900 px-1 py-2">
            <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
              {network.totalSupply !== undefined
                ? formatNumber(network.totalSupply)
                : '—'}
            </p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
              Supply
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 px-1 py-2">
            <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
              {network.totalHolders !== undefined
                ? formatNumber(network.totalHolders)
                : '—'}
            </p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
              Holders
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 px-1 py-2">
            <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
              {network.totalTransferred !== undefined
                ? formatNumber(network.totalTransferred)
                : '—'}
            </p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
              Transfers
            </p>
          </div>
        </div>
      )}

      {/* Explorer link */}
      <div className="px-4 pb-4 mt-auto">
        {!isComingSoon && network.explorerUrl ? (
          <button
            type="button"
            onClick={onClick}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-800 transition-colors duration-200">
            Explorer
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-3 h-3">
              <path
                fillRule="evenodd"
                d="M8.914 6.025a.75.75 0 0 1 1.06 0 3.5 3.5 0 0 1 0 4.95l-2 2a3.5 3.5 0 0 1-5.396-4.402.75.75 0 0 1 1.251.827 2 2 0 0 0 3.085 2.514l2-2a2 2 0 0 0 0-2.829.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M7.086 9.975a.75.75 0 0 1-1.06 0 3.5 3.5 0 0 1 0-4.95l2-2a3.5 3.5 0 0 1 5.396 4.402.75.75 0 0 1-1.251-.827 2 2 0 0 0-3.085-2.514l-2 2a2 2 0 0 0 0 2.829.75.75 0 0 1 0 1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        ) : isComingSoon ? (
          <div className="w-full py-1.5 rounded-lg text-xs font-semibold text-center text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
            Coming soon
          </div>
        ) : null}
      </div>
    </div>
  )
}
