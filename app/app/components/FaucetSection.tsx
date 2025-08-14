import React, { useState } from "react";
import { networks } from "../utils/const/networks";
import { useFaucet } from "../hooks/useFaucet";
import { FaucetFormComponent } from "./FaucetForm";

export const FaucetSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState("fiat");
  const { fiatForm, cryptoForm, responses, isLoading, updateForm, submitForm } =
    useFaucet();

  const cryptoBackedNetworks = networks.filter(
    (network) => network.type === "crypto"
  );
  const fiatBackedNetworks = networks.filter(
    (network) => network.type === "fiat"
  );

  const getAvailableNetworks = (type: "fiat" | "crypto") => {
    return type === "fiat" ? fiatBackedNetworks : cryptoBackedNetworks;
  };

  const getCurrentForm = (type: "fiat" | "crypto") => {
    return type === "fiat" ? fiatForm : cryptoForm;
  };

  const handleUpdateForm =
    (type: "fiat" | "crypto") => (field: string, value: string) => {
      updateForm(type, field as any, value);
    };

  const handleSubmit = (type: "fiat" | "crypto") => () => {
    submitForm(type);
  };

  return (
    <section className="py-16 sm:py-20 md:py-24 relative">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-purple-500 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-indigo-500 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 px-4">
            Request for free NexUSD
          </h1>
          {/* <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-3 md:mb-6 px-4">
            Get testnet NexUSD tokens for development and testing. Request up to{" "}
            <span className="text-gray-900 dark:text-white font-semibold">
              500 tokens
            </span>{" "}
            per request for both fiat-backed and crypto-backed implementations.
          </p> */}
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
            {activeTab === "fiat" && (
              <FaucetFormComponent
                type="fiat"
                form={getCurrentForm("fiat")}
                availableNetworks={getAvailableNetworks("fiat")}
                response={responses.fiat}
                isLoading={isLoading}
                onUpdateForm={handleUpdateForm("fiat")}
                onSubmit={handleSubmit("fiat")}
              />
            )}
            {activeTab === "crypto" && (
              <FaucetFormComponent
                type="crypto"
                form={getCurrentForm("crypto")}
                availableNetworks={getAvailableNetworks("crypto")}
                response={responses.crypto}
                isLoading={isLoading}
                onUpdateForm={handleUpdateForm("crypto")}
                onSubmit={handleSubmit("crypto")}
              />
            )}
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
            <li>• Ensure you have enough gas tokens for the target network</li>
            <li>• Transaction may take a few minutes to complete</li>
          </ul>
        </div>
      </div>
    </section>
  );
};
