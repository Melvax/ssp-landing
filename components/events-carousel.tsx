"use client"

import { useEffect, useRef, useState, type MouseEvent } from "react"
import { useReducedMotion } from "framer-motion"
import { ArrowLeft, ArrowRight, Clock, MapPin } from "lucide-react"
import EventOverlay from "@/components/event-overlay"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import { formatPrice, getEventDateParts, type UpcomingEvent } from "@/lib/events"
import { cn } from "@/lib/utils"

export default function EventsCarousel({ events }: { events: UpcomingEvent[] }) {
  const [api, setApi] = useState<CarouselApi>()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [openEvent, setOpenEvent] = useState<UpcomingEvent | null>(null)
  const [overlayOrigin, setOverlayOrigin] = useState({ x: 0, y: 0 })
  const reduceMotion = useReducedMotion()
  const openedFrom = useRef<HTMLButtonElement | null>(null)

  const openOverlay = (event: UpcomingEvent, click: MouseEvent<HTMLButtonElement>) => {
    openedFrom.current = click.currentTarget
    const card = click.currentTarget.getBoundingClientRect()
    setOverlayOrigin({
      x: card.left + card.width / 2 - window.innerWidth / 2,
      y: card.top + card.height / 2 - window.innerHeight / 2,
    })
    setOpenEvent(event)
  }

  useEffect(() => {
    if (!api) return

    const onSelect = () => setSelectedIndex(api.selectedScrollSnap())
    onSelect()
    api.on("select", onSelect)

    return () => {
      api.off("select", onSelect)
    }
  }, [api])

  if (events.length === 0) return null

  return (
    <section
      id="evenements"
      aria-label="Prochains événements"
      className="relative z-20 order-first flex flex-1 items-center justify-center w-full px-6 md:px-8 py-4"
    >
      <div
        className="w-full lg:max-w-3xl"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={() => setIsPaused(false)}
      >
        <Carousel setApi={setApi} opts={{ loop: true }} aria-label="Prochains événements">
          <div className="flex items-center justify-between min-h-8 mb-3">
            <p className="text-white/80 text-xs font-light">Prochains événements</p>

            {events.length > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => api?.scrollPrev()}
                  aria-label="Événement précédent"
                  className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => api?.scrollNext()}
                  aria-label="Événement suivant"
                  className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-white/10 hover:border-white/20 bg-gradient-to-br from-neutral-700/50 via-neutral-900/60 to-black/70 backdrop-blur-md p-2 md:p-3 shadow-2xl transition-colors duration-200">
            <CarouselContent>
              {events.map((event) => {
                const date = getEventDateParts(event.startsAt)

                return (
                  <CarouselItem key={event.id}>
                    <article className="group relative">
                      <button
                        onClick={(click) => openOverlay(event, click)}
                        aria-label={`Voir le détail de ${event.title}`}
                        className="absolute inset-0 z-10 rounded-2xl cursor-pointer"
                      />
                      <div className="relative h-[clamp(8rem,calc(100dvh-31rem),22rem)] md:h-[clamp(8rem,calc(100dvh-30rem),26rem)] lg:h-[clamp(10rem,calc(100dvh-35rem),30rem)] rounded-2xl overflow-hidden bg-black/40">
                        <img
                          src={event.image}
                          alt=""
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>

                      <div className="flex items-center gap-3 px-1 pt-3 pb-1 md:px-2">
                        <div className="flex flex-col items-center justify-center shrink-0 w-12 h-12 rounded-lg bg-white text-black shadow-sm">
                          <span className="text-[10px] leading-none first-letter:uppercase">{date.weekday}</span>
                          <span className="text-lg font-medium leading-tight">{date.day}</span>
                          <span className="text-[10px] leading-none">{date.month}</span>
                        </div>
                        <div className="min-w-0">
                          <h2 className="text-white text-sm md:text-base font-medium tracking-tight line-clamp-1">
                            {event.title}
                          </h2>
                          <p className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5 text-white/70 text-xs">
                            {event.location && (
                              <span className="flex items-center gap-1 min-w-0">
                                <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden />
                                <span className="truncate">{event.location}</span>
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden />
                              {date.time}
                            </span>
                            {event.price !== null && (
                              <span>{event.price === 0 ? "Gratuit" : formatPrice(event.price)}</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </article>
                  </CarouselItem>
                )
              })}
            </CarouselContent>

            {events.length > 1 && (
              <div className="flex gap-2 px-2 md:px-4">
                {events.map((event, index) => (
                  <button
                    key={event.id}
                    onClick={() => api?.scrollTo(index)}
                    aria-label={`Voir ${event.title}`}
                    aria-current={index === selectedIndex}
                    className="flex-1 py-2 cursor-pointer"
                  >
                    <span className="relative block h-[3px] rounded-full bg-white/25 overflow-hidden">
                      <span
                        key={index === selectedIndex ? `active-${selectedIndex}` : index}
                        onAnimationEnd={() => api?.scrollNext()}
                        className={cn(
                          "absolute inset-0 origin-left rounded-full bg-white",
                          index === selectedIndex && !reduceMotion && "animate-event-progress",
                        )}
                        style={
                          index === selectedIndex && !reduceMotion
                            ? { animationPlayState: isPaused || openEvent ? "paused" : "running" }
                            : { transform: `scaleX(${index <= selectedIndex ? 1 : 0})` }
                        }
                      />
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </Carousel>
      </div>

      <EventOverlay
        event={openEvent}
        origin={overlayOrigin}
        onClose={() => setOpenEvent(null)}
        onCloseAutoFocus={() => openedFrom.current?.focus()}
      />
    </section>
  )
}
