export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="py-24 bg-white dark:bg-gray-800 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
              Innovation in Action
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            How It Works
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Understanding the innovative
            <span className="text-gray-900 dark:text-white font-semibold">
              {" "}
              dual-collateral system{" "}
            </span>
            and seamless swap mechanism
          </p>
        </div>

        {/* Collateral Model */}
        <div className="mb-24">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Dual Collateral Model
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="group bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gray-900 dark:bg-gray-700 rounded-2xl flex items-center justify-center mr-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <span className="text-white font-bold text-xl">1</span>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Fiat-Backed Tokens
                  </h4>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                  Backed by real USD held in regulated bank accounts, ensuring
                  compliance and stability for institutional users.
                </p>
                <div className="mt-6 flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    Regulatory Compliant
                  </span>
                </div>
              </div>

              <div className="group bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gray-900 dark:bg-gray-700 rounded-2xl flex items-center justify-center mr-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <span className="text-white font-bold text-xl">2</span>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Crypto-Backed Tokens
                  </h4>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                  Over-collateralized by crypto assets like Ethereum, providing
                  decentralized backing and DeFi compatibility.
                </p>
                <div className="mt-6 flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-600 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    DeFi Compatible
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 backdrop-blur-md rounded-3xl p-10 border border-gray-200 dark:border-gray-700 shadow-xl">
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                Live Token Distribution
              </h4>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-700 dark:text-gray-300 font-semibold">
                      Fiat-Backed MUSD
                    </span>
                    <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      67%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4 overflow-hidden">
                    <div className="w-2/3 h-4 bg-gray-900 dark:bg-gray-500 rounded-full animate-pulse"></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-700 dark:text-gray-300 font-semibold">
                      Crypto-Backed MUSD
                    </span>
                    <span className="text-xl font-bold text-gray-800 dark:text-gray-200">
                      33%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4 overflow-hidden">
                    <div className="w-1/3 h-4 bg-gray-700 dark:bg-gray-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-gray-100 dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    $1.2B+
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Value Locked
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Swap Example */}
        <div>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Fiat ↔ Crypto Swap Example
          </h3>
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-10 border border-gray-200 dark:border-gray-700 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
              {/* Before */}
              <div className="lg:col-span-2 text-center">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
                  <div className="w-16 h-16 bg-gray-900 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <span className="text-white text-2xl">👤</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Alice's Portfolio
                  </h4>
                  <div className="space-y-3">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 backdrop-blur-sm">
                      <div className="text-gray-900 dark:text-gray-100 font-bold text-2xl">
                        100 MUSD
                      </div>
                      <div className="text-gray-700 dark:text-gray-300 font-medium">
                        Crypto-backed
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Collateral: $140 ETH
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="lg:col-span-1 text-center">
                <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg mx-auto max-w-32">
                  <div className="text-gray-900 dark:text-gray-100 text-4xl mb-3 animate-bounce">
                    ⇄
                  </div>
                  <div className="text-sm font-bold text-gray-700 dark:text-gray-300">
                    Instant Swap
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Liquidity Provider
                  </div>
                </div>
              </div>

              {/* After */}
              <div className="lg:col-span-2 text-center">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
                  <div className="w-16 h-16 bg-gray-900 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <span className="text-white text-2xl">✨</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Alice Receives
                  </h4>
                  <div className="space-y-3">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 backdrop-blur-sm">
                      <div className="text-gray-900 dark:text-gray-100 font-bold text-2xl">
                        140 MUSD
                      </div>
                      <div className="text-gray-700 dark:text-gray-300 font-medium">
                        Fiat-backed
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Backed by USD in banks
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 bg-gray-100 dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gray-900 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-lg">💡</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-3">
                    Why This Works:
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    The crypto-backed stablecoin is over-collateralized (140% in
                    this example), allowing users to receive more fiat-backed
                    tokens than the original number of crypto-backed tokens.
                    This provides additional value while maintaining system
                    stability through intelligent liquidity management.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                      Over-collateralized
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                      Value Preserving
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                      Instant Settlement
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
