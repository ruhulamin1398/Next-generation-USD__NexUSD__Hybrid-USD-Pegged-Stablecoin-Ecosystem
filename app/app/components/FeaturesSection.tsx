import { features } from '../utils/const'

// Bento layout: 2 cols on lg for featured cards, 1 for the rest
const bentoCols = [2, 1, 1, 1, 1, 2, 2, 2]

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative py-20 sm:py-28 bg-gray-950 overflow-hidden">
      {/* Dot grid background */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }}
      />
      {/* Top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[260px] bg-violet-600/[0.15] blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header — left-aligned, editorial style */}
        <div className="max-w-2xl mb-16 sm:mb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-10 bg-violet-500" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-violet-400">
              Core Features
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-[1.1] tracking-tight mb-5">
            Everything built in.
            <br />
            <span className="text-gray-500">Nothing bolted on.</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
            Every layer of NexUSD is engineered for compliance, transparency,
            and composability — from collateral to cross-chain execution.
          </p>
        </div>

        {/* Bento grid — gap-px creates hairline grid lines */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.06] rounded-2xl overflow-hidden ring-1 ring-white/[0.06]">
          {features.map((feature, index) => {
            const isFeatured = bentoCols[index] === 2
            return (
              <div
                key={index}
                className={`group relative flex flex-col bg-gray-950 p-7 sm:p-8 hover:bg-[#0f0f13] transition-colors duration-300 ${
                  isFeatured ? 'lg:col-span-2' : 'lg:col-span-1'
                }`}>
                {/* Step counter */}
                <span className="font-mono text-[11px] text-gray-600 tracking-widest mb-8 block">
                  {String(index + 1).padStart(2, '0')}
                </span>

                {/* Icon — no box, just large emoji with hover bounce */}
                <div className="text-3xl mb-5 w-fit group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>

                {/* Title */}
                <h3 className="text-white font-semibold text-base sm:text-lg leading-snug mb-3">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-500 text-sm leading-relaxed flex-1">
                  {feature.description}
                </p>

                {/* Hover gradient line */}
                <div className="mt-7 h-px bg-gradient-to-r from-violet-500/70 via-blue-500/40 to-transparent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
