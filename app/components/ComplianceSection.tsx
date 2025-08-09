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
            <div className="group bg-white dark:bg-gray-800 rounded-3xl p-10 border border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500">
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-gray-900 dark:bg-gray-700 rounded-2xl flex items-center justify-center mr-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <span className="text-white text-3xl">🧠</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  Custom Auditor Oracle Network
                </h3>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-900 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-gray-500 rounded-full mr-3 animate-pulse"></div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                      Real-time Proof of Reserves
                    </h4>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Decentralized oracles continuously verify and report
                    collateral backing for both fiat and crypto reserves with
                    live transparency.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-gray-600 rounded-full mr-3 animate-pulse"></div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                      Risk Exposure Metrics
                    </h4>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Live monitoring of collateralization ratios, liquidity
                    metrics, and comprehensive system health indicators.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-gray-700 rounded-full mr-3 animate-pulse"></div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                      Public Transparency
                    </h4>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    All reserve data and audit results published on-chain for
                    complete transparency and unparalleled user trust.
                  </p>
                </div>
              </div>
            </div>

            {/* Programmable Compliance */}
            <div className="group bg-white dark:bg-gray-800 rounded-3xl p-10 border border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500">
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-gray-900 dark:bg-gray-700 rounded-2xl flex items-center justify-center mr-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <span className="text-white text-3xl">🧱</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  Programmable Compliance Layer
                </h3>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-900 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-gray-500 rounded-full mr-3 animate-pulse"></div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                      KYC/AML Enforcement
                    </h4>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Smart contract-level identity verification and anti-money
                    laundering compliance built into every transaction
                    seamlessly.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-gray-600 rounded-full mr-3 animate-pulse"></div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                      Jurisdictional Controls
                    </h4>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Configurable compliance rules that intelligently adapt to
                    different regulatory requirements across global markets.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-gray-700 rounded-full mr-3 animate-pulse"></div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                      Dual Mode Operation
                    </h4>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Supports both permissioned and permissionless modes
                    depending on network requirements and user preferences.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="compliance222"
        className="bg-white dark:bg-gray-800 backdrop-blur-md rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Trust & Security Indicators
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group text-center bg-white dark:bg-gray-800 backdrop-blur-md rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gray-900 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <span className="text-white text-2xl">🕐</span>
              </div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                24/7
              </div>
              <div className="text-gray-800 dark:text-gray-200 font-semibold text-lg mb-2">
                Reserve Monitoring
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Continuous oversight and real-time validation
              </div>
            </div>

            <div className="group text-center bg-white dark:bg-gray-800 backdrop-blur-md rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gray-900 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <span className="text-white text-2xl">💯</span>
              </div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                100%
              </div>
              <div className="text-gray-800 dark:text-gray-200 font-semibold text-lg mb-2">
                Backed Reserves
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Fully collateralized and verified
              </div>
            </div>

            <div className="group text-center bg-white dark:bg-gray-800 backdrop-blur-md rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gray-900 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <span className="text-white text-2xl">🔍</span>
              </div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                Multi
              </div>
              <div className="text-gray-800 dark:text-gray-200 font-semibold text-lg mb-2">
                Audit Partners
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Independent verification network
              </div>
            </div>

            <div className="group text-center bg-white dark:bg-gray-800 backdrop-blur-md rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gray-900 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <span className="text-white text-2xl">⚡</span>
              </div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                Live
              </div>
              <div className="text-gray-800 dark:text-gray-200 font-semibold text-lg mb-2">
                Transparency
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Real-time public dashboards
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-white dark:bg-gray-800 backdrop-blur-md rounded-3xl p-12 border border-gray-200 dark:border-gray-700 shadow-2xl">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Experience Unmatched Transparency
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              View real-time reserves, audit reports, and compliance metrics on
              our public transparency dashboard
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2">
                View Transparency Dashboard
              </button>
              <button className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-900 dark:hover:border-gray-400 px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200">
                Download Audit Reports
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
