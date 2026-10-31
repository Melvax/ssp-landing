import EventsCarousel from "@/components/events-carousel"
import Header from "@/components/header"
import HeroContent from "@/components/hero-content"
import ShaderBackground from "@/components/shader-background"
import { getUpcomingEvents } from "@/lib/events"

export const revalidate = 60

export default async function ShaderShowcase() {
  const events = await getUpcomingEvents()

  return (
    <ShaderBackground>
      <div className="relative min-h-screen flex flex-col">
        <Header />
        <div className="flex flex-1 flex-col justify-end w-full max-w-7xl mx-auto lg:grid lg:grid-cols-2 lg:items-end">
          <HeroContent />
          <EventsCarousel events={events} />
        </div>
      </div>
    </ShaderBackground>
  )
}
