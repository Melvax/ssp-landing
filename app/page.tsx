import Header from "@/components/header"
import HeroContent from "@/components/hero-content"
import MembersSection from "@/components/members-section"
import ShaderBackground from "@/components/shader-background"
import CapParticle from "@/components/cap-particle"

export default function ShaderShowcase() {
  return (
    <ShaderBackground>
      <div className="relative h-screen">
        <Header />
        <CapParticle />
        <HeroContent />
      </div>
      <MembersSection />
    </ShaderBackground>
  )
}
