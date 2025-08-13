export default function VisionSection() {
  return (
    <section
      id="vision"
      className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 backdrop-blur-sm transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Vision Statement */}
        <div className="max-w-5xl mx-auto">
          <div className="rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12">
            <div className="flex flex-col sm:flex-row items-center justify-center mb-6 sm:mb-8">
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mr-0 sm:mr-6 mb-4 sm:mb-0">
                <span className="text-white text-xl sm:text-2xl">🚀</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center">
                Our Vision
              </h2>
            </div>

            <p className="text-gray-300 leading-relaxed text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-center mb-8 sm:mb-10 md:mb-12 max-w-4xl mx-auto px-4">
              This project aims to bridge the gap between traditional finance
              and decentralized ecosystems, offering a stable, transparent, and
              interoperable digital currency infrastructure that empowers users
              globally.
              <span className="block mt-3 sm:mt-4 text-white font-medium text-base sm:text-lg md:text-xl lg:text-2xl">
                Together, we&apos;re building the future of money.
              </span>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              <div className="text-center group">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3">
                    Stability
                  </div>
                  <div className="text-gray-300 leading-relaxed text-xs sm:text-sm md:text-base">
                    Reliable digital currency backed by Hybrid collateral system
                  </div>
                </div>
              </div>

              <div className="text-center group">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3">
                    Transparency
                  </div>
                  <div className="text-gray-300 leading-relaxed text-xs sm:text-sm md:text-base">
                    Open source, auditable, and fully regulated ecosystem
                  </div>
                </div>
              </div>

              <div className="text-center group">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3">
                    Innovation
                  </div>
                  <div className="text-gray-300 leading-relaxed text-xs sm:text-sm md:text-base">
                    Cutting-edge technology for the future of finance
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
