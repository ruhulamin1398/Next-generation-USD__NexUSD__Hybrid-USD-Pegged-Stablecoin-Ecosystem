"use client";

import { useState } from "react";

export default function CTAsection() {
  return (
    <section
      id="cta"
      className="py-6 md:py-8 bg-white backdrop-blur-sm transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mt-12 sm:mt-14 md:mt-16 text-center">
          <div className="bg-gray-900 dark:bg-gray-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-300 mb-4 sm:mb-6 max-w-2xl mx-auto text-xs sm:text-sm md:text-base px-4">
              Our support team is available 24/7 to help you with any questions
              about NexUSD. Get in touch and wee will respond within hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button className="px-6 sm:px-8 py-2 sm:py-3 bg-white text-gray-900 font-semibold rounded-md sm:rounded-lg text-sm sm:text-base hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900">
                Contact Support
              </button>
              <button className="px-6 sm:px-8 py-2 sm:py-3 bg-transparent text-white font-semibold rounded-md sm:rounded-lg text-sm sm:text-base border-2 border-gray-600 hover:border-gray-400 hover:bg-gray-800 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-900">
                Join Community
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
