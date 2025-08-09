export default function FeaturesSection() {
  const features = [
    {
      icon: "🔐",
      title: "Dual Collateral Model",
      description:
        "Backed by a combination of regulated fiat reserves and on-chain crypto assets. Ensures both regulatory compliance and decentralization.",
    },
    {
      icon: "🌉",
      title: "Cross-Chain Deployment",
      description:
        "Deployed across major blockchain networks with custom cross-chain communication protocol for seamless movement across chains.",
    },
    {
      icon: "🔄",
      title: "Fiat ↔ Crypto Swap System",
      description:
        "Switch between fiat-backed and crypto-backed stablecoin variants depending on liquidity, availability, and use case.",
    },
    {
      icon: "🧠",
      title: "Custom Auditor Oracle Network",
      description:
        "Decentralized network providing real-time on-chain proof of reserves and risk exposure metrics for maximum transparency.",
    },
    {
      icon: "🧱",
      title: "Programmable Compliance Layer",
      description:
        "Smart contract-level compliance engine supporting KYC/AML enforcement, blacklisting, and jurisdictional controls.",
    },
    {
      icon: "📈",
      title: "Yield-Bearing Option",
      description:
        "Opt into yield-generating version backed by short-term T-bills or on-chain DeFi strategies for additional utility.",
    },
    {
      icon: "🏦",
      title: "Native Fiat On/Off-Ramp",
      description:
        "Seamless conversion between USD bank deposits and stablecoin via banking APIs or licensed payment providers.",
    },
    {
      icon: "🚫",
      title: "Gasless Transactions",
      description:
        "Meta-transaction support allows users to interact without holding native gas tokens, enhancing UX for new users.",
    },
  ];

  return (
    <section
      id="features"
      className="py-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
              Comprehensive Infrastructure
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Core Features
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Comprehensive stablecoin infrastructure designed for the
            <span className="text-gray-900 dark:text-white font-semibold">
              {" "}
              next generation{" "}
            </span>
            of digital finance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white dark:bg-gray-800 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="w-16 h-16 rounded-2xl bg-gray-900 dark:bg-gray-700 flex items-center justify-center text-3xl mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {feature.description}
              </p>

              {/* Hover effect indicator */}
              <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-8 h-1 bg-gray-900 dark:bg-gray-500 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-white dark:bg-gray-800 backdrop-blur-md rounded-3xl p-12 border border-gray-200 dark:border-gray-700 shadow-xl">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Experience the Future?
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users already leveraging our innovative
              stablecoin ecosystem
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2">
                Start Building
              </button>
              <button className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-900 dark:hover:border-gray-400 px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200">
                View Integration Guide
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
