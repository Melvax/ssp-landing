"use client"

import { useEffect, useRef, useState, type MouseEvent } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import EventOverlay from "@/components/event-overlay"
import EventPrice from "@/components/event-price"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import { formatEventDate, type UpcomingEvent } from "@/lib/events"
import { cn } from "@/lib/utils"

const AUTOPLAY_DELAY = 6000

export default function EventsCarousel({ events }: { events: UpcomingEvent[] }) {
  const [api, setApi] = useState<CarouselApi>()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [openEvent, setOpenEvent] = useState<UpcomingEvent | null>(null)
  const [overlayOrigin, setOverlayOrigin] = useState({ x: 0, y: 0 })
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

  useEffect(() => {
    if (!api || isPaused || openEvent || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const interval = setInterval(() => api.scrollNext(), AUTOPLAY_DELAY)
    return () => clearInterval(interval)
  }, [api, isPaused, openEvent, selectedIndex])

  if (events.length === 0) return null

  return (
    <section
      id="evenements"
      aria-label="Prochains événements"
      className="relative z-20 order-first lg:order-none flex flex-1 lg:flex-none items-center w-full px-6 md:px-8 py-4 lg:pt-0 lg:pb-8 lg:pl-0"
    >
      <div
        className="w-full"
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
                {events.map((event, index) => (
                  <button
                    key={event.id}
                    onClick={() => api?.scrollTo(index)}
                    aria-label={`Voir ${event.title}`}
                    aria-current={index === selectedIndex}
                    className="flex items-center justify-center w-6 h-6 cursor-pointer"
                  >
                    <span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full transition-colors duration-200",
                        index === selectedIndex ? "bg-white" : "bg-white/30",
                      )}
                    />
                  </button>
                ))}
                <button
                  onClick={() => api?.scrollPrev()}
                  aria-label="Événement précédent"
                  className="ml-2 p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer"
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

          <CarouselContent>
            {events.map((event) => (
              <CarouselItem key={event.id}>
                <article className="group relative grid md:grid-cols-2 lg:flex lg:flex-col h-56 md:h-64 lg:h-96 rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 bg-black/40 backdrop-blur-md transition-colors duration-200">
                  <button
                    onClick={(click) => openOverlay(event, click)}
                    aria-label={`Voir le détail de ${event.title}`}
                    className="absolute inset-0 z-10 rounded-2xl cursor-pointer"
                  />
                  <div className="absolute inset-0 md:relative lg:flex-1 lg:min-h-0 overflow-hidden">
                    <img
                      src={event.image}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/10 md:hidden" />
                  </div>

                  <div className="relative flex flex-col justify-end md:justify-center p-5 md:p-8 lg:p-6">
                    <p className="text-white/80 text-xs mb-2 first-letter:uppercase">
                      {formatEventDate(event.startsAt)}
                    </p>
                    <h2 className="text-white text-2xl md:text-4xl lg:text-3xl font-light tracking-tight mb-2 line-clamp-1 instrument">
                      {event.title}
                    </h2>
                    <div className="mb-2 empty:hidden">
                      <EventPrice event={event} />
                    </div>
                    <p className="text-white/70 text-xs md:text-sm font-light leading-relaxed line-clamp-2">
                      {event.description}
                    </p>
                  </div>
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>
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
