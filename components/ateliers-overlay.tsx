"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface AteliersOverlayProps {
  isOpen: boolean
  onClose: () => void
}

const workshops = [
  {
    title: "Beatmaking 101",
    description:
      "Initiation aux bases de la production musicale. Apprenez à créer vos premiers beats avec Ableton Live.",
    image: "/music-production-studio-with-drum-machine.jpg",
    date: "Tous les dimanches",
    level: "Débutant",
  },
  {
    title: "Sound Design Avancé",
    description: "Explorez les techniques de synthèse et créez des sons uniques pour vos productions.",
    image: "/synthesizer-with-colorful-lights.jpg",
    date: "2x par mois",
    level: "Intermédiaire",
  },
  {
    title: "Sampling Créatif",
    description: "Maîtrisez l'art du sampling. Du vinyle au DAW, découvrez les secrets des plus grands producteurs.",
    image: "/vinyl-records-and-sampler-mpc.jpg",
    date: "Chaque samedi",
    level: "Tous niveaux",
  },
]

export default function AteliersOverlay({ isOpen, onClose }: AteliersOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
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
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Header */}
            <div className="text-center mb-10 pt-8">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-white/60 text-sm uppercase tracking-widest mb-3"
              >
                Nos Ateliers
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-white text-4xl md:text-5xl font-light instrument"
              >
                Apprends, Crée, Partage
              </motion.h2>
            </div>

            {/* Workshop cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 pb-8">
              {workshops.map((workshop, index) => (
                <motion.div
                  key={workshop.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                  className="group relative bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={workshop.image || "/placeholder.svg"}
                      alt={workshop.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute bottom-3 left-3 text-xs text-white/80 bg-white/10 backdrop-blur-sm px-2 py-1 rounded-full">
                      {workshop.level}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <p className="text-white/50 text-xs uppercase tracking-wider mb-2">{workshop.date}</p>
                    <h3 className="text-white text-xl font-medium mb-2">{workshop.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed mb-4">{workshop.description}</p>
                    <button className="w-full py-2.5 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors">
                      S'inscrire
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center pb-8"
            >
              <p className="text-white/50 text-sm mb-4">
                Tu veux proposer un atelier ? On est toujours ouverts aux nouvelles idées.
              </p>
              <button className="px-6 py-2.5 rounded-full border border-white/30 text-white text-sm hover:bg-white/10 transition-colors">
                Devenir intervenant
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
