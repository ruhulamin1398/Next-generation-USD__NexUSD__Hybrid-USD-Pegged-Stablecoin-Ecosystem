export default function ComplianceSection() {
  return (
    <>
      <section
        id="compliance"
        className="py-24 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 backdrop-blur-sm transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gray-800 text-gray-200 border border-gray-700">
                Trust & Security
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Compliance & Transparency
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Built with
              <span className="text-white font-semibold">
                {" "}
                regulatory compliance{" "}
              </span>
              and maximum transparency at its core
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
            {/* Auditor Oracle Network */}
            <div className="group  backdrop-blur-sm rounded-3xl p-10 border border-1 shadow-xl hover:shadow-2xl ">
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-gray-900 dark:bg-gray-700 rounded-2xl flex items-center justify-center mr-6 shadow-lg group-hover:shadow-xl  transform hover:scale-102 transition-all duration-500">
                  <span className="text-white text-3xl">🧠</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-300 dark:text-white">
                  Custom Auditor Oracle Network
                </h3>
              </div>

              <div className="space-y-6">
                <div className="   dark:bg-gray-900 backdrop-blur-sm rounded-2xl p-6 border border-sm border-gray-700 dark:border-gray-700 shadow-lg hover:shadow-xl  transform hover:scale-102 transition-all duration-500">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-gray-600 rounded-full mr-3 animate-pulse"></div>
                    <h4 className="font-bold text-gray-300 dark:text-white text-lg">
                      Real-time Proof of Reserves
                    </h4>
                  </div>
                  <p className="text-gray-50 dark:text-gray-300 leading-relaxed">
                    Decentralized oracles continuously verify and report
                    collateral backing for both fiat and crypto reserves with
                    live transparency.
                  </p>
                </div>

                <div className="   dark:bg-gray-900 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 dark:border-gray-700 shadow-lg hover:shadow-xl  transform hover:scale-102 transition-all duration-500">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-gray-600 rounded-full mr-3 animate-pulse"></div>
                    <h4 className="font-bold text-gray-300 dark:text-white text-lg">
                      Risk Exposure Metrics
                    </h4>
                  </div>
                  <p className="text-gray-50 dark:text-gray-300 leading-relaxed">
                    Live monitoring of collateralization ratios, liquidity
                    metrics, and comprehensive system health indicators.
                  </p>
                </div>

                <div className="   dark:bg-gray-900 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 dark:border-gray-700 shadow-lg hover:shadow-xl  transform hover:scale-102 transition-all duration-500">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-gray-700 rounded-full mr-3 animate-pulse"></div>
                    <h4 className="font-bold text-gray-300 dark:text-white text-lg">
                      Public Transparency
                    </h4>
                  </div>
                  <p className="text-gray-50 dark:text-gray-300 leading-relaxed">
                    All reserve data and audit results published on-chain for
                    complete transparency and unparalleled user trust.
                  </p>
                </div>
              </div>
            </div>

            {/* Programmable Compliance */}
            <div className="group  dark:bg-gray-800 rounded-3xl p-10 border  dark:border-gray-700 shadow-xl hover:shadow-2xl  ">
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-gray-900 dark:bg-gray-700 rounded-2xl flex items-center justify-center mr-6 shadow-lg group-hover:shadow-xl  transform hover:scale-102 transition-all duration-500">
                  <span className="text-white text-3xl">🧱</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-300 dark:text-white">
                  Programmable Compliance Layer
                </h3>
              </div>

              <div className="space-y-6">
                <div className="   dark:bg-gray-900 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 dark:border-gray-700 shadow-lg hover:shadow-xl  transform hover:scale-102 transition-all duration-500">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3   0 rounded-full mr-3 animate-pulse"></div>
                    <h4 className="font-bold text-gray-300 dark:text-white text-lg">
                      KYC/AML Enforcement
                    </h4>
                  </div>
                  <p className="text-gray-50 dark:text-gray-300 leading-relaxed">
                    Smart contract-level identity verification and anti-money
                    laundering compliance built into every transaction
                    seamlessly.
                  </p>
                </div>

                <div className="   dark:bg-gray-900 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 dark:border-gray-700 shadow-lg hover:shadow-xl  transform hover:scale-102 transition-all duration-500">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-gray-600 rounded-full mr-3 animate-pulse"></div>
                    <h4 className="font-bold text-gray-300 dark:text-white text-lg">
                      Jurisdictional Controls
                    </h4>
                  </div>
                  <p className="text-gray-50 dark:text-gray-300 leading-relaxed">
                    Configurable compliance rules that intelligently adapt to
                    different regulatory requirements across global markets.
                  </p>
                </div>

                <div className="   dark:bg-gray-900 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 dark:border-gray-700 shadow-lg hover:shadow-xl  transform hover:scale-102 transition-all duration-500">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-gray-700 rounded-full mr-3 animate-pulse"></div>
                    <h4 className="font-bold text-gray-300 dark:text-white text-lg">
                      Dual Mode Operation
                    </h4>
                  </div>
                  <p className="text-gray-50 dark:text-gray-300 leading-relaxed">
                    Supports both permissioned and permissionless modes
                    depending on network requirements and user preferences.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
