export default function VisionSection() {
  return (
    <section
      id="vision"
      className="py-20 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900  backdrop-blur-sm transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Vision Statement */}
        <div className="max-w-5xl mx-auto">
          <div className=" rounded-2xl p-12     ">
            <div className="flex items-center justify-center mb-8">
              <div className="w-12 h-12  flex items-center justify-center mr-6 ">
                <span className="text-white text-2xl">🚀</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white text-center">
                Our Vision
              </h2>
            </div>

            <p className="text-gray-300 leading-relaxed text-xl md:text-2xl text-center mb-12 max-w-4xl mx-auto">
              This project aims to bridge the gap between traditional finance
              and decentralized ecosystems, offering a stable, transparent, and
              interoperable digital currency infrastructure that empowers users
              globally.
              <span className="block mt-4 text-white font-medium text-2xl">
                Together, we're building the future of money.
              </span>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <div className="text-3xl font-bold text-white mb-3">
                    Stability
                  </div>
                  <div className="text-gray-300 leading-relaxed">
                    Reliable digital currency backed by dual collateral system
                  </div>
                </div>
              </div>

              <div className="text-center group">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <div className="text-3xl font-bold text-white mb-3">
                    Transparency
                  </div>
                  <div className="text-gray-300 leading-relaxed">
                    Open source, auditable, and fully regulated ecosystem
                  </div>
                </div>
              </div>

              <div className="text-center group">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <div className="text-3xl font-bold text-white mb-3">
                    Innovation
                  </div>
                  <div className="text-gray-300 leading-relaxed">
                    Cutting-edge technology for the future of finance
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-12 text-center">
              <button className="bg-white hover:bg-gray-100 text-gray-900 font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 shadow-lg">
                Join Our Mission
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
