import EventsCarousel from "@/components/events-carousel"
import Header from "@/components/header"
import HeroContent from "@/components/hero-content"
import ShaderBackground from "@/components/shader-background"
import { getUpcomingEvents } from "@/lib/events"
import JsonLd from "./json-ld"

export const revalidate = 60

export default async function ShaderShowcase() {
  const events = await getUpcomingEvents()

  return (
    <ShaderBackground>
      <JsonLd events={events} />
      {/* Page sur un seul écran, sauf si la fenêtre est trop basse pour tout afficher (mobile à l'horizontale). */}
      <div className="relative min-h-dvh [@media(min-height:560px)]:h-dvh [@media(min-height:560px)]:overflow-hidden flex flex-col">
        <Header />
        <div className="flex flex-1 flex-col justify-end w-full max-w-7xl mx-auto">
          <HeroContent />
          <EventsCarousel events={events} />
        </div>
      </div>
    </ShaderBackground>
  )
}
