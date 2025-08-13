"use client";

import { useState } from "react";
import { networks } from "../utils/const/networks";
import { Network } from "../interfaces/network";

export default function MultiChainSection() {
  const [activeTab, setActiveTab] = useState("fiat");

  const cryptoBackedNetworks = networks.filter(
    (network) => network.type === "crypto"
  );
  const fiatBackedNetworks = networks.filter(
    (network) => network.type === "fiat"
  );

  const handleNetworkClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      id="multichain"
      className="relative py-16 sm:py-20 md:py-24 bg-white dark:bg-gray-800 transition-colors duration-300 overflow-hidden"
    >
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
            Access NexUSD across multiple blockchain testnet networks with both{" "}
            <span className="text-gray-900 dark:text-white font-semibold">
              crypto-backed
            </span>{" "}
            and{" "}
            <span className="text-gray-900 dark:text-white font-semibold">
              fiat-backed
            </span>{" "}
            implementations
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8 sm:mb-12">
          <div className="inline-flex rounded-xl bg-gray-100 dark:bg-gray-700 p-1 sm:p-2">
            <button
              onClick={() => setActiveTab("fiat")}
              className={`px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 ${
                activeTab === "fiat"
                  ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Fiat Backed
            </button>
            <button
              onClick={() => setActiveTab("crypto")}
              className={`px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 ${
                activeTab === "crypto"
                  ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Crypto Backed
            </button>
          </div>
        </div>

        {/* Networks Grid */}
        <div className="transition-all duration-500 ease-in-out">
          {activeTab === "crypto" && (
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

          {activeTab === "fiat" && (
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
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12 sm:mt-16">
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
            NexUSD testnet deployments across multiple blockchain networks for
            both crypto-backed and fiat-backed implementations. Click on any
            network to view the testnet block explorer.
          </p>
        </div>
      </div>
    </section>
  );
}

// Network Card Component
interface NetworkCardProps {
  network: Network;
  onClick: () => void;
}

function NetworkCard({ network, onClick }: NetworkCardProps) {
  const LogoComponent = network.logo;
  const isReactComponent = typeof network.logo === "function";

  return (
    <div
      onClick={onClick}
      className={`group relative bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer ${
        network.status === "coming-soon" ? "opacity-75" : ""
      }`}
    >
      {/* Status Badge for Coming Soon */}
      {network.status === "coming-soon" && (
        <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
          Soon
        </div>
      )}

      {/* Network Logo */}
      <div className="flex items-center justify-center mb-3 sm:mb-4">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 p-2">
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
      </div>

      {/* Network Name */}
      <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white text-center group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
        {network.name}
      </h3>

      {/* Hover Effect */}
      <div className="mt-3 sm:mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-full h-1 bg-gray-900 dark:bg-gray-500 rounded-full"></div>
      </div>
    </div>
  );
}
