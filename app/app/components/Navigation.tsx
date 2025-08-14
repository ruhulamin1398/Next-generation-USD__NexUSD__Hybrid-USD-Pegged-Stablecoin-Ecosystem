"use client";
import { useState } from "react";
import Link from "next/link";
import { useTheme } from "./ThemeProvider";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-gray-900  backdrop-blur-sm  shadow-sm border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gray-900 dark:bg-gray-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="text-2xl font-bold text-white dark:text-white">
                NexUSD
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link
                href="/"
                className="text-gray-300 dark:text-gray-300 hover:text-white dark:hover:text-white transition-colors duration-200 font-medium"
              >
                Home
              </Link>
              <Link
                href="/#how-it-works"
                className="text-gray-300 dark:text-gray-300 hover:text-white dark:hover:text-white transition-colors duration-200 font-medium"
              >
                How It Works
              </Link>
              <Link
                href="/#multichain"
                className="text-gray-300 dark:text-gray-300 hover:text-white dark:hover:text-white transition-colors duration-200 font-medium"
                title="NexUSD Goes Multi-Chain - Access NexUSD across multiple blockchain testnet networks with both crypto-backed and fiat-backed implementations"
              >
                Multi-Chain
              </Link>
              <Link
                href="/docs"
                className="text-gray-300 dark:text-gray-300 hover:text-white dark:hover:text-white transition-colors duration-200 font-medium"
              >
                Documentation
              </Link>
              <Link
                href="/faq"
                className="text-gray-300 dark:text-gray-300 hover:text-white dark:hover:text-white transition-colors duration-200 font-medium"
              >
                FAQs
              </Link>
              <Link
                href="/faucet"
                className="text-gray-300 dark:text-gray-300 hover:text-white dark:hover:text-white transition-colors duration-200 font-medium"
              >
                Faucet
              </Link>
            </div>
          </div>

          {/* Theme Toggle & CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {/* <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <svg
                  className="w-5 h-5 text-gray-600 dark:text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-gray-600 dark:text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              )}
            </button> */}

            <button className="bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-6 py-2.5 rounded-xl hover:shadow-xl font-semibold text-sm transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 border border-gray-600">
              Launch App
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <svg
                  className="w-5 h-5 text-gray-600 dark:text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-gray-600 dark:text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              )}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 dark:text-gray-300 hover:text-bold dark:hover:text-white focus:outline-none p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800/95 backdrop-blur-md border-t border-gray-700/50 rounded-b-xl">
              <a
                href="#features"
                className="block text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-700/50 transition-colors duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="block text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-700/50 transition-colors duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </a>
              <a
                href="#multichain"
                className="block text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-700/50 transition-colors duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Multi-Chain
              </a>
              <Link
                href="/docs"
                className="block text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-700/50 transition-colors duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Documentation
              </Link>
              <Link
                href="/faq"
                className="block text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-700/50 transition-colors duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQs
              </Link>
              <Link
                href="/faucet"
                className="block text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-700/50 transition-colors duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Faucet
              </Link>
              <a
                href="#vision"
                className="block text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-700/50 transition-colors duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Vision
              </a>
              <a
                href="#about"
                className="block text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-700/50 transition-colors duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </a>
              <button className="w-full mt-4 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-6 py-3 rounded-xl hover:shadow-xl font-semibold text-sm transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2">
                Launch App
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
