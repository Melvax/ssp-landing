"use client"

import Link from "next/link"

export default function HeroContent() {
  return (
    <main className="relative z-20 max-w-lg mx-6 md:mx-8 mb-8">
      <div className="text-left">
        <h1 className="text-[clamp(1.375rem,6.5vw,1.875rem)] leading-tight md:text-4xl tracking-tight font-light text-white mb-4">
          Le <span className="font-medium italic instrument">Rendez-vous</span> des
          <br />
          <span className="font-light tracking-tight text-white">Beatmakers</span>
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
            className="px-6 md:px-8 py-3 rounded-full bg-white text-black font-normal text-xs transition-all duration-200 hover:bg-white/90 cursor-pointer"
          >
            Rejoindre le Collectif
          </a>
        </div>
      </div>
    </main>
  )
}
