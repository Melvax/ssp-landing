"use client"

import { PulsingBorder } from "@paper-design/shaders-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface PulsingCircleProps {
  className?: string
}

export default function PulsingCircle({ className }: PulsingCircleProps) {
  return (
    <div className={cn("relative z-30", className)}>
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Pulsing Border Circle */}
        <PulsingBorder
          colors={["#BEECFF", "#E77EDC", "#FF4C3E", "#00FF88", "#FFD700", "#FF6B35", "#8A2BE2"]}
          colorBack="#00000000"
          speed={1.5}
          roundness={1}
          thickness={0.1}
          softness={0.2}
          intensity={5}
          spotSize={0.1}
          pulse={0.1}
          smoke={0.5}
          smokeSize={4}
          scale={0.65}
          rotation={0}
          frame={9161408.251009725}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
          }}
        />

        {/* Rotating Text Around the Pulsing Border */}
        <motion.svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          animate={{ rotate: 360 }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          style={{ transform: "scale(1.6)" }}
        >
          <defs>
            <path id="circle" d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
          </defs>
          <text className="text-sm fill-white/80 instrument">
            <textPath href="#circle" startOffset="0%">
              SuperSample Paris • SuperSample Paris • SuperSample Paris •
            </textPath>
          </text>
        </motion.svg>
      </div>
    </div>
  )
}
