import { Metadata } from "next";
import Navigation from "../components/Navigation";
import ComplianceSection from "../components/ComplianceSection";
import DevelopersSection from "../components/DevelopersSection";
import Footer from "../components/Footer";
import Breadcrumbs from "../components/Breadcrumbs";
import CTAsection from "../components/CTA";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Documentation - NexUSD | Trust & Security, Developers",
  description:
    "Comprehensive documentation for NexUSD stablecoin including security measures and developer resources.",
  keywords:
    "NexUSD, stablecoin, documentation, security, developers, compliance, blockchain",
};

export default function DocsPage() {
  return (
    <div className="min-h-screen">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Documentation", href: "/docs" },
        ]}
      />

      {/* Page Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Documentation
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Learn about NexUSD&aposs security measures and development
              resources.
            </p>

            {/* Quick Navigation */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <a
                href="https://github.com/ruhulamin1398/Next-generation-USD__NexUSD__Hybrid-USD-Pegged-Stablecoin-Ecosystem"
                target="_blank"
                className="inline-flex items-center px-6 py-3 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors duration-200 font-medium shadow-sm"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                GitHub
              </a>
              <a
                href="#code"
                className="inline-flex items-center px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 font-medium shadow-sm scroll-smooth"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
                Example
              </a>

              <Link
                href="/faq"
                className="inline-flex items-center px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 font-medium shadow-sm scroll-smooth"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                View FAQs
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="pt-8">
        <DevelopersSection />
      </div>
    </div>
  );
}
