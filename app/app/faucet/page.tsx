"use client";

import { useState } from "react";
import { networks } from "../utils/const/networks";
import { Network } from "../interfaces/network";
import Breadcrumbs from "../components/Breadcrumbs";

interface FaucetForm {
  address: string;
  network: string;
  amount: string;
}

interface FaucetResponse {
  success: boolean;
  transactionHash?: string;
  error?: string;
  network?: {
    name: string;
    explorerUrl: string;
  };
}

export default function FaucetPage() {
  const [activeTab, setActiveTab] = useState("fiat");
  const [fiatForm, setFiatForm] = useState<FaucetForm>({
    address: "",
    network: "",
    amount: "",
  });
  const [cryptoForm, setCryptoForm] = useState<FaucetForm>({
    address: "",
    network: "",
    amount: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState<{
    fiat?: FaucetResponse;
    crypto?: FaucetResponse;
  }>({});

  const cryptoBackedNetworks = networks.filter(
    (network) => network.type === "crypto"
  );
  const fiatBackedNetworks = networks.filter(
    (network) => network.type === "fiat"
  );

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Faucet", href: "/faucet" },
  ];

  const handleSubmit = async (type: "fiat" | "crypto") => {
    const form = type === "fiat" ? fiatForm : cryptoForm;
    const setForm = type === "fiat" ? setFiatForm : setCryptoForm;

    // Validation
    if (!form.address || !form.network || !form.amount) {
      setResponses((prev) => ({
        ...prev,
        [type]: { success: false, error: "Please fill in all fields" },
      }));
      return;
    }

    // Validate amount (max 500)
    const amount = parseFloat(form.amount);
    if (isNaN(amount) || amount <= 0 || amount > 500) {
      setResponses((prev) => ({
        ...prev,
        [type]: {
          success: false,
          error: "Amount must be between 1 and 500 tokens",
        },
      }));
      return;
    }

    // Validate address format (basic check for Ethereum address)
    const addressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!addressRegex.test(form.address)) {
      setResponses((prev) => ({
        ...prev,
        [type]: { success: false, error: "Invalid wallet address format" },
      }));
      return;
    }

    setIsLoading(true);
    setResponses((prev) => ({ ...prev, [type]: undefined }));

    try {
      const response = await fetch("/api/faucet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: form.address,
          network: form.network,
          amount: form.amount,
          type: type,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResponses((prev) => ({
          ...prev,
          [type]: {
            success: true,
            transactionHash: data.transactionHash,
            network: data.network,
          },
        }));
        // Reset form on success
        setForm({ address: "", network: "", amount: "" });
      } else {
        setResponses((prev) => ({
          ...prev,
          [type]: {
            success: false,
            error: data.error || "Failed to mint tokens",
          },
        }));
      }
    } catch (error) {
      setResponses((prev) => ({
        ...prev,
        [type]: { success: false, error: "Network error. Please try again." },
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailableNetworks = (type: "fiat" | "crypto") => {
    return type === "fiat" ? fiatBackedNetworks : cryptoBackedNetworks;
  };

  const getCurrentForm = (type: "fiat" | "crypto") => {
    return type === "fiat" ? fiatForm : cryptoForm;
  };

  const updateForm = (
    type: "fiat" | "crypto",
    field: keyof FaucetForm,
    value: string
  ) => {
    const setForm = type === "fiat" ? setFiatForm : setCryptoForm;

    // For amount field, just set the value as-is and let validation happen elsewhere
    if (field === "amount") {
      // Only allow numbers, decimal points, and empty string
      if (value === "" || /^\d*\.?\d*$/.test(value)) {
        setForm((prev) => ({ ...prev, [field]: value }));
      }
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  const FaucetForm = ({ type }: { type: "fiat" | "crypto" }) => {
    const form = getCurrentForm(type);
    const availableNetworks = getAvailableNetworks(type);
    const response = responses[type];

    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          {type === "fiat" ? "Fiat-Backed" : "Crypto-Backed"} NexUSD Faucet
        </h3>

        <div className="space-y-4">
          {/* Address Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Wallet Address
            </label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => updateForm(type, "address", e.target.value)}
              placeholder="0x..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          {/* Network Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Network
            </label>
            <select
              value={form.network}
              onChange={(e) => updateForm(type, "network", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">Select Network</option>
              {availableNetworks.map((network, index) => (
                <option
                  key={index}
                  value={network.name}
                  disabled={network.status === "coming-soon"}
                >
                  {network.name}{" "}
                  {network.status === "coming-soon" ? "(Coming Soon)" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Contract Address Display */}
          {form.network && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contract Address
              </label>
              {(() => {
                const selectedNetwork = availableNetworks.find(
                  (n) => n.name === form.network
                );
                if (selectedNetwork && selectedNetwork.contractAddress) {
                  const explorerUrl = selectedNetwork.explorerUrl
                    ? `${selectedNetwork.explorerUrl}/address/${selectedNetwork.contractAddress}`
                    : "#";

                  return (
                    <div className="flex items-center space-x-2">
                      <code className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-mono text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 flex-1">
                        {selectedNetwork.contractAddress}
                      </code>
                      {selectedNetwork.explorerUrl && (
                        <a
                          href={explorerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                        >
                          View on Explorer
                        </a>
                      )}
                    </div>
                  );
                }
                return (
                  <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600">
                    Contract address not available
                  </div>
                );
              })()}
            </div>
          )}

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amount (Max: 500 NexUSD)
            </label>
            <input
              type="number"
              value={form.amount}
              onChange={(e) => {
                const value = e.target.value;
                // Allow empty string or valid numbers
                if (value === "" || (!isNaN(Number(value)) && Number(value) >= 0)) {
                  updateForm(type, "amount", value);
                }
              }}
              onBlur={(e) => {
                // When user leaves the field, cap the value at 500
                const value = e.target.value;
                if (value && Number(value) > 500) {
                  updateForm(type, "amount", "500");
                }
              }}
              onKeyDown={(e) => {
                // Prevent 'e', 'E', '+', '-' keys for number input
                if (["e", "E", "+", "-"].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              placeholder="Enter amount"
              min="0"
              max="500"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            {form.amount && Number(form.amount) > 500 && (
              <p className="text-red-500 text-sm mt-1">
                Maximum allowed amount is 500 tokens
              </p>
            )}
            {form.amount && Number(form.amount) <= 0 && form.amount !== "" && (
              <p className="text-red-500 text-sm mt-1">
                Amount must be greater than 0
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={() => handleSubmit(type)}
            disabled={
              isLoading ||
              !form.network ||
              !form.address ||
              !form.amount ||
              Number(form.amount || "0") <= 0 ||
              Number(form.amount || "0") > 500 ||
              availableNetworks.find((n) => n.name === form.network)?.status ===
                "coming-soon"
            }
            className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
          >
            {isLoading
              ? "Processing..."
              : availableNetworks.find((n) => n.name === form.network)
                  ?.status === "coming-soon"
              ? "Coming Soon"
              : "Request Tokens"}
          </button>

          {/* Response Display */}
          {response && (
            <div
              className={`p-4 rounded-lg ${
                response.success
                  ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                  : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
              }`}
            >
              {response.success ? (
                <div>
                  <p className="text-green-800 dark:text-green-200 font-medium">
                    ✅ Tokens minted successfully!
                  </p>
                  {response.transactionHash && (
                    <div className="mt-2">
                      {(() => {
                        // Use network info from API response if available, otherwise fall back to local network config
                        const explorerUrl =
                          response.network?.explorerUrl ||
                          availableNetworks.find((n) => n.name === form.network)
                            ?.explorerUrl ||
                          "https://amoy.polygonscan.com"; // Default fallback for Polygon Amoy

                        const txUrl = `${explorerUrl}/tx/${response.transactionHash}`;

                        return (
                          <div>
                            <a
                              href={txUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-2 text-green-600 dark:text-green-300 text-sm hover:text-green-800 dark:hover:text-green-100 transition-colors duration-200 font-medium"
                            >
                              <span>View Transaction on Explorer</span>
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                            </a>
                            <p className="text-green-600 dark:text-green-300 text-xs mt-1 font-mono break-all">
                              TX: {response.transactionHash}
                            </p>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-red-800 dark:text-red-200 font-medium">
                  ❌ {response.error}
                </p>
              )}
            </div>
          )}

          {/* No Live Networks Available Message */}
          {availableNetworks.filter((n) => n.status === "live").length ===
            0 && (
            <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
              <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                ⚠️ No live networks are currently available for {type}-backed
                tokens.
              </p>
              <p className="text-yellow-600 dark:text-yellow-300 text-sm mt-1">
                Coming soon networks are listed above but not yet functional.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <main className="pt-16">
        {/* Breadcrumbs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        <section className="py-16 sm:py-20 md:py-24">
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute top-40 right-20 w-48 h-48 bg-purple-500 rounded-full blur-xl animate-pulse delay-1000"></div>
            <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-indigo-500 rounded-full blur-xl animate-pulse delay-2000"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Header */}
            <div className="text-center mb-12 sm:mb-16">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 px-4">
                NexUSD Testnet Faucet
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-3 md:mb-6 px-4">
                Get testnet NexUSD tokens for development and testing. Request
                up to{" "}
                <span className="text-gray-900 dark:text-white font-semibold">
                  500 tokens
                </span>{" "}
                per request for both fiat-backed and crypto-backed
                implementations.
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

            {/* Faucet Forms */}
            <div className="max-w-2xl mx-auto">
              <div className="transition-all duration-500 ease-in-out">
                {activeTab === "fiat" && <FaucetForm type="fiat" />}
                {activeTab === "crypto" && <FaucetForm type="crypto" />}
              </div>
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
                <li>
                  • Ensure you have enough gas tokens for the target network
                </li>
                <li>• Transaction may take a few minutes to complete</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
