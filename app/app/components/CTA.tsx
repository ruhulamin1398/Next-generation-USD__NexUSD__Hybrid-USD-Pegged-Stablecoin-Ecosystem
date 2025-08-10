"use client";
import { socialLinks } from "../utils/const";

export default function CTAsection() {
  // Get GitHub URL from social links
  const githubLink =
    socialLinks.find((link) => link.icon === "github")?.href || "#";

  return (
    <section
      id="cta"
      className="py-6 md:py-8 bg-white backdrop-blur-sm transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mt-12 sm:mt-14 md:mt-16 text-center">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 shadow-2xl">
            {/* Open Source Badge */}
            <div className="inline-flex items-center px-3 py-1 sm:px-4 sm:py-2 mb-4 sm:mb-6 bg-green-500/10 border border-green-500/20 rounded-full">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span className="text-green-400 text-xs sm:text-sm font-medium">
                Open Source Project
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
              Join the NexUSD Revolution
            </h3>
            <p className="text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed px-4">
              NexUSD is an open source project building the future of
              stablecoins. We&apos;re looking for passionate developers,
              blockchain enthusiasts, and financial innovators to collaborate
              and shape the next generation of decentralized finance.
            </p>

            {/* Contribution Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8 max-w-2xl mx-auto">
              <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4 border border-gray-700/50">
                <div className="text-lg sm:text-xl font-bold text-white">
                  15+
                </div>
                <div className="text-xs sm:text-sm text-gray-400">
                  Contributors
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4 border border-gray-700/50">
                <div className="text-lg sm:text-xl font-bold text-white">
                  MIT
                </div>
                <div className="text-xs sm:text-sm text-gray-400">License</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4 border border-gray-700/50">
                <div className="text-lg sm:text-xl font-bold text-white">
                  24/7
                </div>
                <div className="text-xs sm:text-sm text-gray-400">
                  Community
                </div>
              </div>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <a
                href={githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-3.5 bg-white text-gray-900 font-semibold rounded-lg text-sm sm:text-base hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 shadow-lg"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                Contribute on GitHub
              </a>
              <a
                href="/docs"
                className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-3.5 bg-transparent text-white font-semibold rounded-lg text-sm sm:text-base border-2 border-gray-600 hover:border-gray-400 hover:bg-gray-800/50 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                Read Documentation
              </a>
            </div>

            {/* Additional Info */}
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-700/50">
              <p className="text-xs sm:text-sm text-gray-400 max-w-2xl mx-auto">
                🚀{" "}
                <span className="font-medium text-gray-300">
                  New to open source?
                </span>{" "}
                No problem! We welcome developers of all skill levels. Check out
                our{" "}
                <a
                  href="/docs"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  contribution guidelines
                </a>{" "}
                and join our community to get started.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
