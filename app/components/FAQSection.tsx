"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question:
      "What is NexUSD and how does it maintain its peg to the US Dollar?",
    answer:
      "NexUSD is a next-generation USD-pegged stablecoin that maintains its $1.00 value through a dual collateral system combining traditional reserves and decentralized mechanisms. Our smart contracts automatically adjust supply and demand while maintaining full transparency and regulatory compliance.",
  },
  {
    question: "How secure are my funds with NexUSD?",
    answer:
      "NexUSD employs multiple layers of security including smart contract audits by leading firms, multi-signature wallet protection, real-time monitoring systems, and insurance coverage. All reserves are held in regulated financial institutions and are subject to regular third-party audits.",
  },
  {
    question: "Which blockchains support NexUSD?",
    answer:
      "NexUSD is available on multiple blockchain networks including Ethereum, Polygon, Binance Smart Chain, Arbitrum, and Optimism. Our cross-chain bridge technology ensures seamless transfers between networks with minimal fees and maximum security.",
  },
  {
    question: "How can I mint or redeem NexUSD tokens?",
    answer:
      "You can mint NexUSD by depositing supported collateral (USDC, DAI, or fiat) through our platform. Redemption is available 24/7 with a 1:1 ratio. The process is automated through smart contracts and typically completes within minutes.",
  },
  {
    question: "What are the fees associated with NexUSD transactions?",
    answer:
      "Minting and redemption fees are kept minimal at 0.1%. Cross-chain transfers have variable fees based on network congestion. There are no holding fees, and all fee structures are transparent and published on our platform.",
  },
  {
    question: "Is NexUSD regulated and compliant?",
    answer:
      "Yes, NexUSD operates under strict regulatory compliance frameworks. We maintain licenses in key jurisdictions, conduct regular audits, implement KYC/AML procedures, and work closely with regulatory bodies to ensure full legal compliance.",
  },
  {
    question: "How can developers integrate NexUSD into their applications?",
    answer:
      "We provide comprehensive SDKs, REST APIs, and smart contract interfaces for easy integration. Our developer portal includes detailed documentation, code samples, testnet access, and dedicated technical support to help you build with NexUSD.",
  },
  {
    question: "What happens during market volatility?",
    answer:
      "NexUSD is designed to maintain stability during market turbulence through our dual collateral system and algorithmic stabilization mechanisms. Emergency protocols and circuit breakers ensure the peg is maintained even during extreme market conditions.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="py-20 bg-white backdrop-blur-sm transition-colors duration-300"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-800 max-w-3xl mx-auto leading-relaxed">
            Get answers to common questions about NexUSD, our technology,
            security measures, and how to get started.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  <svg
                    className={`w-5 h-5 text-gray-500 dark:text-gray-400 transform transition-transform duration-200 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-5">
                  <div className="w-full h-px bg-gray-200 dark:bg-gray-700 mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mt-16 text-center">
          <div className="bg-gray-900 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Our support team is available 24/7 to help you with any questions
              about NexUSD. Get in touch and we'll respond within hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900">
                Contact Support
              </button>
              <button className="px-8 py-3 bg-transparent text-white font-semibold rounded-lg border-2 border-gray-600 hover:border-gray-400 hover:bg-gray-800 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-900">
                Join Community
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
