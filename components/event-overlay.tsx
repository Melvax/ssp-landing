"use client"

import * as Dialog from "@radix-ui/react-dialog"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { X } from "lucide-react"
import EventPrice from "@/components/event-price"
import { formatEventDate, type UpcomingEvent } from "@/lib/events"

interface EventOverlayProps {
  event: UpcomingEvent | null
  // Décalage entre le centre de la carte cliquée et le centre de l'écran
  origin: { x: number; y: number }
  onClose: () => void
  onCloseAutoFocus: () => void
}

export default function EventOverlay({ event, origin, onClose, onCloseAutoFocus }: EventOverlayProps) {
  const reduceMotion = useReducedMotion()
  const hidden = reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.6, ...origin }

  return (
    <AnimatePresence>
      {event && (
        <Dialog.Root key={event.title} open onOpenChange={(open) => !open && onClose()}>
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild forceMount onCloseAutoFocus={onCloseAutoFocus}>
              <motion.div
                initial={hidden}
                animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                exit={hidden}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="fixed inset-0 z-50 m-auto w-[calc(100%-2rem)] max-w-3xl h-fit max-h-[90dvh] overflow-y-auto rounded-2xl border border-white/10 bg-neutral-950 focus:outline-none"
              >
                <Dialog.Close
                  aria-label="Fermer"
                  className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-white" />
                </Dialog.Close>

                <div className="relative h-56 md:h-80">
                  <img src={event.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 to-transparent to-50%" />
                </div>

                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                  className="p-6 md:p-8"
                >
                  <p className="text-white/70 text-sm mb-2 first-letter:uppercase">
                    {formatEventDate(event.startsAt)}
                  </p>
                  <Dialog.Title className="text-white text-4xl md:text-5xl font-light tracking-tight mb-4 instrument">
                    {event.title}
                  </Dialog.Title>
                  <div className="mb-4 empty:hidden">
                    <EventPrice event={event} />
                  </div>
                  <Dialog.Description className="text-white/80 text-sm md:text-base font-light leading-relaxed whitespace-pre-line">
                    {event.description}
                  </Dialog.Description>

                  {event.signupUrl && (
                    <a
                      href={event.signupUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-6 px-8 py-3 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors"
                    >
                      S'inscrire
                    </a>
                  )}
                </motion.div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </AnimatePresence>
  )
}
