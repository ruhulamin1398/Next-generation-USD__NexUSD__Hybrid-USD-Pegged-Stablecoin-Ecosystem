export default function DevelopersSection() {
  return (
    <section
      id="developers"
      className="min-h-screen flex flex-col justify-center py-20 bg-white backdrop-blur-sm transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-16">
          <div className="mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gray-800 text-gray-200 border border-gray-700">
              Developer-First Platform
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Built for Developers
          </h2>
          <p className="text-xl md:text-2xl text-gray-800 max-w-4xl mx-auto leading-relaxed">
            Comprehensive tools and APIs for{" "}
            <span className="text-gray-900 font-semibold">
              seamless integration
            </span>{" "}
            into your applications
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* SDK & APIs */}
          <div className="group bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500">
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 bg-gray-900 dark:bg-gray-700 rounded-2xl flex items-center justify-center mr-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <span className="text-gray-900text-3xl">🧰</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                Stablecoin SDK & APIs
              </h3>
            </div>

            <p className="text-gray-800 dark:text-gray-800 mb-8 text-lg leading-relaxed">
              Developer-focused SDK and APIs for integrating stablecoin
              functionality into DeFi protocols, wallets, dApps, and payment
              platforms with minimal effort.
            </p>

            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 bg-gray-500 rounded-full mr-3 animate-pulse"></div>
                  <h4 className="font-bold text-gray-900 dark:text-gray-900text-lg">
                    Core Functions
                  </h4>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                    Minting & redemption
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                    Cross-chain transfers
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                    Compliance checks
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                    Balance queries
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 bg-gray-600 rounded-full mr-3 animate-pulse"></div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                    Integration Support
                  </h4>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                    REST & GraphQL APIs
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                    WebSocket real-time
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                    Multiple language SDKs
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                    Comprehensive docs
                  </div>
                </div>
              </div>
            </div>

            <button className="mt-8 w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2">
              View Documentation
            </button>
          </div>

          {/* Merchant Gateway */}
          <div className="group bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500">
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 bg-gray-900 dark:bg-gray-700 rounded-2xl flex items-center justify-center mr-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <span className="text-white text-3xl">🏢</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Enterprise Payment Gateway
              </h3>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg leading-relaxed">
              Merchant-facing tools and APIs enabling settlement, invoicing, and
              payments in stablecoins for businesses of all sizes with
              enterprise-grade reliability.
            </p>

            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-900 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 bg-gray-500 rounded-full mr-3 animate-pulse"></div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                    E-commerce Plugins
                  </h4>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-800 dark:text-gray-800">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                    Shopify integration
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                    WooCommerce plugin
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                    Magento extension
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                    Custom checkout flows
                  </div>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 bg-gray-600 rounded-full mr-3 animate-pulse"></div>
                  <h4 className="font-bold text-gray-800 dark:text-white text-lg">
                    Enterprise Features
                  </h4>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-800 dark:text-gray-800">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                    Bulk payment processing
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                    Multi-currency support
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                    Automated invoicing
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                    Real-time settlement
                  </div>
                </div>
              </div>
            </div>

            <button className="mt-8 w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2">
              Get Started
            </button>
          </div>
        </div>

        {/* Additional Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="group bg-white/80 dark:bg-gray-700/80 backdrop-blur-md rounded-2xl p-6 border border-gray-200/50 dark:border-gray-600/50 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
              <span className="text-white text-2xl">📈</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Yield-Bearing Options
            </h3>
            <p className="text-gray-800 dark:text-gray-800 mb-6 leading-relaxed">
              Opt into yield-generating versions backed by short-term T-bills or
              on-chain DeFi strategies.
            </p>
            <div className="space-y-2 text-sm text-gray-800 dark:text-gray-800">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                T-bill backed yields
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                DeFi strategy options
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                Institutional grade
              </div>
            </div>
          </div>

          <div className="group bg-white/80 dark:bg-gray-700/80 backdrop-blur-md rounded-2xl p-6 border border-gray-200/50 dark:border-gray-600/50 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
              <span className="text-white text-2xl">🏦</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Fiat On/Off-Ramp
            </h3>
            <p className="text-gray-800 dark:text-gray-800 mb-6 leading-relaxed">
              Seamless conversion between USD bank deposits and stablecoin via
              banking APIs.
            </p>
            <div className="space-y-2 text-sm text-gray-800 dark:text-gray-800">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                Bank account linking
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                Instant conversions
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                Licensed providers
              </div>
            </div>
          </div>

          <div className="group bg-white/80 dark:bg-gray-700/80 backdrop-blur-md rounded-2xl p-6 border border-gray-200/50 dark:border-gray-600/50 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
              <span className="text-white text-2xl">👛</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Unified Wallet Interface
            </h3>
            <p className="text-gray-800 dark:text-gray-800 mb-6 leading-relaxed">
              Non-custodial wallet for managing all stablecoin operations in one
              place.
            </p>
            <div className="space-y-2 text-sm text-gray-800 dark:text-gray-800">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                Multi-chain support
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                Swap functionality
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>
                Compliance management
              </div>
            </div>
          </div>

          <div className="group bg-white/80 dark:bg-gray-700/80 backdrop-blur-md rounded-2xl p-6 border border-gray-200/50 dark:border-gray-600/50 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
              <span className="text-white text-2xl">🚫</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Gasless Transactions
            </h3>
            <p className="text-gray-800 dark:text-gray-800 mb-6 leading-relaxed">
              Meta-transaction support allows interaction without holding native
              gas tokens.
            </p>
            <div className="space-y-2 text-sm text-gray-800 dark:text-gray-800">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>
                No gas token needed
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></span>
                Enhanced UX
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                New user friendly
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Code Example */}
        <div className="bg-gray-900 rounded-3xl p-8 text-white shadow-2xl border border-gray-700">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl md:text-3xl font-bold">
              Quick Integration Example
            </h3>
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 overflow-x-auto border border-gray-700">
            <pre className="text-sm md:text-base">
              <code className="language-javascript">
                {`// Install the NexUSD SDK
npm install @nexusd/sdk

// Initialize and mint tokens
import { NexUSD } from '@nexusd/sdk';

const nexusd = new NexUSD({
  network: 'mainnet',
  apiKey: 'your-api-key'
});

// Mint fiat-backed stablecoin
const result = await nexusd.mint({
  amount: 1000,
  type: 'fiat-backed',
  recipient: '0x...'
});

// Swap between variants
await nexusd.swap({
  from: 'crypto-backed',
  to: 'fiat-backed',
  amount: 500
});

// Check compliance status
const status = await nexusd.checkCompliance({
  address: '0x...',
  jurisdiction: 'US'
});`}
              </code>
            </pre>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button className="bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2">
              Try in Sandbox
            </button>
            <button className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-900 dark:hover:border-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 px-8 py-4 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2">
              View Full Examples
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
