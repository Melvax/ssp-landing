import Header from "@/components/header"
import HeroContent from "@/components/hero-content"
import MembersSection from "@/components/members-section"
import ShaderBackground from "@/components/shader-background"

export default function ShaderShowcase() {
  return (
    <ShaderBackground>
      <div className="relative h-screen">
        <Header />
        <HeroContent />
      </div>
      <MembersSection />
    </ShaderBackground>
  )
}
