"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface AboutOverlayProps {
  isOpen: boolean
  onClose: () => void
}

const sundayWorkshop = {
  title: "Workshops gratuits",
  description: "Chaque dimanche de 15h à 18h, on se retrouve pour produire, écouter nos sons et échanger.",
  image: "/workshops-gratuits.webp",
}

const topics = [
  {
    title: "Mettre en lumière le beatmaking à Paris",
    description:
      "SuperSample Paris organise une multitude d'événements autour du beatmaking : ateliers, sessions live, jams, beat battles et soirées d'écoute. Notre mission : mettre en lumière les beatmakers et faire rayonner le beatmaking à Paris.",
  },
  {
    title: "Une scène qui se rencontre",
    description:
      "Chaque rendez-vous est l'occasion de faire écouter ses productions, de recevoir des retours, d'échanger des samples et de lancer des collaborations, du premier beat aux projets confirmés.",
  },
]

export default function AboutOverlay({ isOpen, onClose }: AboutOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="about-title"
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-5xl mx-4 max-h-[85vh] overflow-y-auto"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Fermer"
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-10 pt-8 px-4">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-white/60 text-sm uppercase tracking-widest mb-3"
              >
                À propos de nous
              </motion.p>
              <motion.h2
                id="about-title"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-white text-4xl md:text-5xl font-light instrument mb-4"
              >
                Le collectif SuperSample Paris
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-white/70 text-sm md:text-base font-light leading-relaxed"
              >
                SuperSample Paris rassemble des producteurs, beatmakers et sound designers de tous niveaux. On se
                retrouve pour créer ensemble, partager nos sons et faire évoluer notre art.
              </motion.p>
            </div>

            {/* Atelier du dimanche, puis le reste de nos activités en texte */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 px-4 pb-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="relative bg-white/5 rounded-2xl overflow-hidden border border-white/10"
              >
                <div className="relative h-40 overflow-hidden">
                  <img src={sundayWorkshop.image} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-5">
                  <h3 className="text-white text-lg font-medium mb-2">{sundayWorkshop.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{sundayWorkshop.description}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="md:col-span-2 flex flex-col justify-center gap-6"
              >
                {topics.map((topic) => (
                  <div key={topic.title}>
                    <h3 className="text-white text-2xl md:text-3xl font-light instrument mb-2">{topic.title}</h3>
                    <p className="text-white/70 text-sm md:text-base font-light leading-relaxed">{topic.description}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Bottom CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-3 pb-8 px-4"
            >
              <a
                href="https://www.helloasso.com/associations/super-sample-paris/adhesions/formulaire-d-adhesion-ssp"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors"
              >
                Rejoindre le Collectif
              </a>
              <a
                href="mailto:contact.supersample@gmail.com"
                className="px-6 py-2.5 rounded-full border border-white/30 text-white text-sm hover:bg-white/10 transition-colors"
              >
                Nous contacter
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
