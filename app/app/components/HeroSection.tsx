'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useNetworkConfig } from '../hooks/useNetworkConfig'

export default function HeroSection() {
  const { fiatNetworks, isLoading, networksSummary } = useNetworkConfig()

  const compactNum = (n: number) =>
    new Intl.NumberFormat('en', {
      notation: 'compact',
      maximumFractionDigits: 2
    }).format(n)

  const [animatedCounts, setAnimatedCounts] = useState({
    networks: 0,
    supply: 0,
    holders: 0
  })

  useEffect(() => {
    if (isLoading) {
      setAnimatedCounts({ networks: 0, supply: 0, holders: 0 })
      return
    }

    const targetNetworks = fiatNetworks.length
    const targetSupply = networksSummary.totalSupply
    const targetHolders = networksSummary.totalHolders
    const duration = 1200
    const frameRate = 60
    const totalFrames = Math.round((duration / 1000) * frameRate)

    const networkStep = targetNetworks / totalFrames
    const supplyStep = targetSupply / totalFrames
    const holdersStep = targetHolders / totalFrames

    let frame = 0
    const interval = window.setInterval(() => {
      frame += 1
      setAnimatedCounts({
        networks: Math.min(targetNetworks, Math.round(networkStep * frame)),
        supply: Math.min(targetSupply, Math.round(supplyStep * frame)),
        holders: Math.min(targetHolders, Math.round(holdersStep * frame))
      })

      if (frame >= totalFrames) {
        window.clearInterval(interval)
      }
    }, duration / totalFrames)

    return () => {
      window.clearInterval(interval)
    }
  }, [
    isLoading,
    fiatNetworks.length,
    networksSummary.totalSupply,
    networksSummary.totalHolders
  ])

  return (
    <>
      <section className="relative min-h-screen bg-gray-900 backdrop-blur-sm py-12 lg:py-20 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gray-400/10 dark:bg-gray-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-500/10 dark:bg-gray-700/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gray-300/5 dark:bg-gray-800/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* <div className="mb-6 sm:mb-8">
              <span className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-gray-800 text-gray-200 border border-gray-700">
                <span className="w-2 h-2 bg-gray-500 rounded-full mr-2 animate-pulse"></span>
                Now Live on Multiple Blockchains
              </span>
            </div> */}

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-7xl font-bold text-white mb-2 sm:mb-3 leading-tight px-2">
              Next-Generation
              <span className="block text-gray-100">USD Stablecoin</span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 mb-8 sm:mb-8 max-w-5xl mx-auto leading-relaxed font-light px-4">
              Hybrid USD-pegged stablecoin ecosystem backed by fiat reserves and
              crypto assets.
              {/* <span className="block mt-2 font-medium text-white">
                Designed for scalability, transparency, and interoperability.
              </span> */}
            </p>

            <div className="mx-auto mb-10 max-w-5xl px-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl">
                  <div className="text-sm uppercase tracking-[0.24em] text-gray-400 mb-4">
                    Live Networks
                  </div>
                  <div className="text-4xl font-semibold text-white">
                    {isLoading ? '...' : animatedCounts.networks}
                  </div>
                  <div className="mt-2 text-sm text-gray-400">
                    More comming soon.
                  </div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl">
                  <div className="text-sm uppercase tracking-[0.24em] text-gray-400 mb-4">
                    Total Supply
                  </div>
                  <div className="text-4xl font-semibold text-white">
                    {isLoading
                      ? '...'
                      : `${compactNum(animatedCounts.supply)}+`}
                  </div>
                  <div className="mt-2 text-sm text-gray-400">
                    Combined across networks.
                  </div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl">
                  <div className="text-sm uppercase tracking-[0.24em] text-gray-400 mb-4">
                    Total Holders
                  </div>
                  <div className="text-4xl font-semibold text-white">
                    {isLoading
                      ? '...'
                      : `${compactNum(animatedCounts.holders)}+`}
                  </div>
                  <div className="mt-2 text-sm text-gray-400">
                    Total wallets holding NexUSD today.
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12 sm:mb-16 px-4">
              <button className="group bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 border border-gray-600 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-base sm:text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2">
                <span className="flex items-center justify-center">
                  Launch App
                  <svg
                    className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </button>
              <Link
                href="/#multichain"
                className="group bg-gray-800 border-2 border-gray-600 text-gray-300 hover:border-gray-400 hover:text-gray-100 hover:bg-gray-700 px-6 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-base sm:text-lg font-semibold transition-all duration-300 hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-gray-900">
                <span className="flex items-center justify-center">
                  View Networks
                  <svg
                    className="ml-2 w-5 h-5 group-hover:translate-y-1 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 5v14m0 0l6-6m-6 6l-6-6"
                    />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 md:py-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Key Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="group bg-white dark:bg-gray-800 backdrop-blur-md rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                Hybrid
              </div>
              <div className="text-gray-800 dark:text-gray-200 font-semibold text-base sm:text-lg mb-2">
                Collateral Model
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Fiat + Crypto Backed for maximum stability and flexibility
              </div>
              <div className="mt-3 sm:mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gray-900 dark:bg-gray-500 h-2 rounded-full w-4/5 animate-pulse"></div>
              </div>
            </div>

            <div className="group bg-white dark:bg-gray-800 backdrop-blur-md rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                Multi
              </div>
              <div className="text-gray-800 dark:text-gray-200 font-semibold text-base sm:text-lg mb-2">
                Chain Support
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Cross-chain protocol enabling seamless interoperability
              </div>
              <div className="mt-3 sm:mt-4 flex space-x-2">
                <div className="w-3 h-3 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-gray-600 rounded-full animate-bounce delay-100"></div>
                <div className="w-3 h-3 bg-gray-700 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>

            <div className="group bg-white dark:bg-gray-800 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3">
                Instant
              </div>
              <div className="text-gray-800 dark:text-gray-200 font-semibold text-lg mb-2">
                Fiat ↔ Crypto Swaps
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Seamless liquidity with intelligent swap mechanisms
              </div>
              <div className="mt-4 flex items-center justify-center">
                <div className="text-2xl animate-bounce">⇄</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
