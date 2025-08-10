import Link from "next/link";
import {
  footerSections,
  socialLinks,
  footerStats,
  legalLinks,
} from "../utils/const";
import SocialIcon from "./SocialIcon";

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-black text-white py-12 sm:py-16 md:py-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 md:gap-12">
          {/* Enhanced Brand */}
          <div className="md:col-span-1 sm:col-span-2 md:col-span-1">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-700 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg sm:text-xl">
                  N
                </span>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-white">
                NexUSD
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
              Next-generation USD-pegged stablecoin ecosystem. Bridging
              traditional finance and decentralized ecosystems with unmatched
              innovation.
            </p>

            <div className="space-y-2 sm:space-y-4 mb-6 sm:mb-8">
              {footerStats.map((stat, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-500 rounded-full animate-pulse"></div>
                  <span className="text-xs sm:text-sm text-gray-400">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex space-x-3 sm:space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  className="group p-2 sm:p-3 bg-gray-800 hover:bg-gray-700 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-110"
                >
                  <SocialIcon
                    icon={social.icon}
                    className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-white transition-colors"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h3 className="font-bold text-base sm:text-lg mb-4 sm:mb-6 text-white">
                {section.title}
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group text-sm sm:text-base"
                    >
                      <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </span>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Enhanced Bottom */}
        <div className="mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-gray-400 text-center md:text-left order-2 md:order-1">
            <span className="text-xs sm:text-sm">
              © 2025 NexUSD. All rights reserved.
            </span>
            <span className="mx-2 text-gray-600 hidden sm:inline">•</span>
            <span className="text-xs sm:text-sm block sm:inline mt-1 sm:mt-0">
              Built with ❤️ for the future of finance
            </span>
          </div>
          <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-6 justify-center order-1 md:order-2">
            {legalLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
