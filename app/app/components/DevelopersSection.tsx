export default function DevelopersSection() {
  return (
    <section
      id="developers"
      className="min-h-screen flex flex-col justify-center py-6 md:py-6 bg-white backdrop-blur-sm transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <div className="mb-4 sm:mb-6">
            <span className="inline-flex items-center px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
              Developer-First Platform
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 px-4">
            Built for Developers
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-800 max-w-4xl mx-auto leading-relaxed px-4">
            Comprehensive tools and APIs for{" "}
            <span className="text-gray-900 font-semibold">
              seamless integration
            </span>{" "}
            into your applications
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 mb-8 sm:mb-12 md:mb-16">
          {/* SDK & APIs */}
          <div className="group bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 mt-2 border border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500">
            <div className="flex items-center mb-6 sm:mb-8">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gray-900 dark:bg-gray-700 rounded-xl sm:rounded-2xl hidden md:flex items-center justify-center mr-3 sm:mr-4 md:mr-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <span className="text-white text-lg sm:text-2xl md:text-3xl">
                  🧰
                </span>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">
                Stablecoin SDK & APIs
              </h3>
            </div>

            <p className="text-gray-800 dark:text-gray-800 mb-6 sm:mb-8 text-sm sm:text-base md:text-lg leading-relaxed">
              Developer-focused SDK and APIs for integrating stablecoin
              functionality into DeFi protocols, wallets, dApps, and payment
              platforms with minimal effort.
            </p>

            <div className="space-y-4 sm:space-y-6">
              <div className="bg-white dark:bg-gray-800 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-500 rounded-full mr-2 sm:mr-3 animate-pulse"></div>
                  <h4 className="font-bold text-gray-900 dark:text-gray-900 text-sm sm:text-base md:text-lg">
                    Core Functions
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full mr-2"></span>
                    Minting & redemption
                  </div>
                  <div className="flex items-center">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full mr-2"></span>
                    Cross-chain transfers
                  </div>
                  <div className="flex items-center">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full mr-2"></span>
                    Compliance checks
                  </div>
                  <div className="flex items-center">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full mr-2"></span>
                    Balance queries
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-600 rounded-full mr-2 sm:mr-3 animate-pulse"></div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base md:text-lg">
                    Integration Support
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full mr-2"></span>
                    REST & GraphQL APIs
                  </div>
                  <div className="flex items-center">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full mr-2"></span>
                    WebSocket real-time
                  </div>
                  <div className="flex items-center">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full mr-2"></span>
                    Multiple language SDKs
                  </div>
                  <div className="flex items-center">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full mr-2"></span>
                    Comprehensive docs
                  </div>
                </div>
              </div>
            </div>

            <button className="mt-6 sm:mt-8 w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2">
              View Documentation
            </button>
          </div>

          {/* Merchant Gateway */}
          <div className="group bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl mt-2 p-4 sm:p-6 md:p-8 border border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500">
            <div className="flex items-center mb-6 sm:mb-8">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gray-900 dark:bg-gray-700 rounded-xl sm:rounded-2xl hidden  md:flex items-center justify-center mr-3 sm:mr-4 md:mr-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <span className="text-white text-lg sm:text-2xl md:text-3xl">
                  🏢
                </span>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                Enterprise Payment Gateway
              </h3>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 text-sm sm:text-base md:text-lg leading-relaxed">
              Merchant-facing tools and APIs enabling settlement, invoicing, and
              payments in stablecoins for businesses of all sizes with
              enterprise-grade reliability.
            </p>

            <div className="space-y-4 sm:space-y-6">
              <div className="bg-gray-50 dark:bg-gray-900 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-500 rounded-full mr-2 sm:mr-3 animate-pulse"></div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base md:text-lg">
                    E-commerce Plugins
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm text-gray-800 dark:text-gray-800">
                  <div className="flex items-center">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full mr-2"></span>
                    Shopify integration
                  </div>
                  <div className="flex items-center">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full mr-2"></span>
                    WooCommerce plugin
                  </div>
                  <div className="flex items-center">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full mr-2"></span>
                    Magento extension
                  </div>
                  <div className="flex items-center">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full mr-2"></span>
                    Custom checkout flows
                  </div>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-600 rounded-full mr-2 sm:mr-3 animate-pulse"></div>
                  <h4 className="font-bold text-gray-800 dark:text-white text-sm sm:text-base md:text-lg">
                    Enterprise Features
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm text-gray-800 dark:text-gray-800">
                  <div className="flex items-center">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full mr-2"></span>
                    Bulk payment processing
                  </div>
                  <div className="flex items-center">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full mr-2"></span>
                    Multi-currency support
                  </div>
                  <div className="flex items-center">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full mr-2"></span>
                    Automated invoicing
                  </div>
                  <div className="flex items-center">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full mr-2"></span>
                    Real-time settlement
                  </div>
                </div>
              </div>
            </div>

            <button className="mt-6 sm:mt-8 w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2">
              Get Started
            </button>
          </div>
        </div>
      </div>
      {/* Enhanced Code Example */}
      <div
        id="code"
        className="bg-gray-900  p-4 sm:p-6 md:p-8 text-white shadow-2xl border border-gray-700"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-4 sm:mb-0">
              Quick Integration Example
            </h3>
            <div className="flex space-x-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-600 rounded-full"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-400 rounded-full"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-400 rounded-full"></div>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 overflow-x-auto border border-gray-700">
            <pre className="text-xs sm:text-sm md:text-base">
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
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button className="bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2">
              Try in Sandbox
            </button>
            <button className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-900 dark:hover:border-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2">
              View Full Examples
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
