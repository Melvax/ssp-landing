"use client"

import Link from "next/link"
import PulsingCircle from "./pulsing-circle"

export default function HeroContent() {
  return (
    <main className="relative z-20 max-w-lg mx-6 md:mx-8 mb-8">
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

        <h1 className="text-[clamp(1.5rem,7.5vw,2.25rem)] leading-tight md:text-5xl md:leading-14 tracking-tight font-light text-white mb-4">
          Le <span className="font-medium italic instrument">Rendez-vous</span> des
          <br />
          <span className="font-light tracking-tight text-white">Beatmakers à Paris</span>
        </h1>

        <p className="text-xs font-light text-white/70 mb-4 leading-relaxed [@media(max-height:620px)]:hidden">
          Rejoins SuperSample Paris — un collectif de producteurs, beatmakers et sound designers. Ateliers
          hebdomadaires, sessions live, échanges de samples et événements communautaires pour faire évoluer ton art.
        </p>

        <div className="flex items-center gap-3 md:gap-4 flex-wrap">
          <Link
            href="/connexion"
            className="px-6 md:px-8 py-3 rounded-full bg-transparent border border-white/30 text-white font-normal text-xs transition-all duration-200 hover:bg-white/10 hover:border-white/50 cursor-pointer"
          >
            Connexion
          </Link>
          <a
            href="https://www.helloasso.com/associations/super-sample-paris/adhesions/formulaire-d-adhesion-ssp"
            target="_blank"
            rel="noopener noreferrer"
            className="relative pl-14 pr-8 py-3 rounded-full bg-white text-black font-normal text-xs transition-all duration-200 hover:bg-white/90 cursor-pointer overflow-hidden group"
          >
            <div className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10">
              <PulsingCircle className="w-full h-full" />
            </div>
            <span className="relative z-10">Rejoindre le Collectif</span>
          </a>
        </div>
      </div>
    </main>
  )
}
