import React from "react";
import { Network } from "../interfaces/network";
import { FaucetFormData, FaucetResponse } from "../hooks/useFaucet";

interface FaucetFormProps {
  type: "fiat" | "crypto";
  form: FaucetFormData;
  availableNetworks: Network[];
  response?: FaucetResponse;
  isLoading: boolean;
  onUpdateForm: (field: keyof FaucetFormData, value: string) => void;
  onSubmit: () => void;
}

export const FaucetFormComponent: React.FC<FaucetFormProps> = ({
  type,
  form,
  availableNetworks,
  response,
  isLoading,
  onUpdateForm,
  onSubmit,
}) => {
  const isFormValid = () => {
    return (
      form.address &&
      form.network &&
      form.amount &&
      Number(form.amount || "0") > 0 &&
      Number(form.amount || "0") <= 500 &&
      availableNetworks.find((n) => n.name === form.network)?.status !==
        "coming-soon"
    );
  };

  const selectedNetwork = availableNetworks.find(
    (n) => n.name === form.network
  );

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
            onChange={(e) => onUpdateForm("address", e.target.value)}
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
            onChange={(e) => onUpdateForm("network", e.target.value)}
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
        {form.network && selectedNetwork && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contract Address
            </label>
            {selectedNetwork.contractAddress ? (
              <div className="flex items-center space-x-2">
                <code className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-mono text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 flex-1">
                  {selectedNetwork.contractAddress}
                </code>
                {selectedNetwork.explorerUrl && (
                  <a
                    href={`${selectedNetwork.explorerUrl}/address/${selectedNetwork.contractAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    View on Explorer
                  </a>
                )}
              </div>
            ) : (
              <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600">
                Contract address not available
              </div>
            )}
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
              if (
                value === "" ||
                (!isNaN(Number(value)) && Number(value) >= 0)
              ) {
                onUpdateForm("amount", value);
              }
            }}
            onBlur={(e) => {
              const value = e.target.value;
              if (value && Number(value) > 500) {
                onUpdateForm("amount", "500");
              }
            }}
            onKeyDown={(e) => {
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
          onClick={onSubmit}
          disabled={!isFormValid() || isLoading}
          className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
        >
          {isLoading
            ? "Processing..."
            : selectedNetwork?.status === "coming-soon"
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
                      const explorerUrl =
                        response.network?.explorerUrl ||
                        selectedNetwork?.explorerUrl ||
                        "https://amoy.polygonscan.com";

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
        {availableNetworks.filter((n) => n.status === "live").length === 0 && (
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
