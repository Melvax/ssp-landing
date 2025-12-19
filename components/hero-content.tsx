"use client"

import PulsingCircle from "./pulsing-circle"

export default function HeroContent() {
  return (
    <main className="absolute bottom-8 left-8 z-20 max-w-lg">
      <div className="text-left">
        <div
          className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 backdrop-blur-sm mb-4 relative"
          style={{
            filter: "url(#glass-effect)",
          }}
        >
          <div className="absolute top-0 left-1 right-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full" />
          <span className="text-white/90 text-xs font-light relative z-10">Chaque Dimanche de 15h à 18h</span>
        </div>

        <h1 className="text-5xl md:text-6xl md:leading-16 tracking-tight font-light text-white mb-4">
          La <span className="font-medium italic instrument">Maison</span> des
          <br />
          <span className="font-light tracking-tight text-white">Beatmakers à Paris</span>
        </h1>

        <p className="text-xs font-light text-white/70 mb-4 leading-relaxed">
          Rejoins SuperSample Paris — un collectif de producteurs, beatmakers et sound designers. Ateliers
          hebdomadaires, sessions live, échanges de samples et événements communautaires pour faire évoluer ton art.
        </p>

        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={() => {
              document.getElementById("community")?.scrollIntoView({ behavior: "smooth" })
            }}
            className="px-8 py-3 rounded-full bg-transparent border border-white/30 text-white font-normal text-xs transition-all duration-200 hover:bg-white/10 hover:border-white/50 cursor-pointer"
          >
            La Communauté
          </button>
          <button className="relative pl-14 pr-8 py-3 rounded-full bg-white text-black font-normal text-xs transition-all duration-200 hover:bg-white/90 cursor-pointer overflow-hidden group">
            <div className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10">
              <PulsingCircle className="w-full h-full" />
            </div>
            <span className="relative z-10">Rejoindre le Collectif</span>
          </button>
        </div>
      </div>
    </main>
  )
}
