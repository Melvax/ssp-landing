"use client"

import { useEffect, useRef } from "react"

interface MouseState {
  x: number
  y: number
  radius: number
  isActive: boolean
}

class Particle {
  baseX: number
  baseY: number
  x: number
  y: number
  color: string
  size: number
  easing: number

  constructor(x: number, y: number, color: string) {
    this.baseX = x
    this.baseY = y
    this.x = x
    this.y = y
    this.color = color
    this.size = 2
    this.easing = 0.15
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color
    ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size)
  }

  update(mouse: MouseState) {
    const dx = this.x - mouse.x
    const dy = this.y - mouse.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    let targetX: number
    let targetY: number

    if (mouse.isActive && distance < mouse.radius) {
      const angle = Math.atan2(dy, dx)
      targetX = mouse.x + Math.cos(angle) * mouse.radius
      targetY = mouse.y + Math.sin(angle) * mouse.radius
    } else {
      targetX = this.baseX
      targetY = this.baseY
    }

    this.x += (targetX - this.x) * this.easing
    this.y += (targetY - this.y) * this.easing
  }
}

function drawCap(ctx: CanvasRenderingContext2D, canvasW: number, canvasH: number) {
  const cx = canvasW * 0.65
  const cy = canvasH * 0.44
  const W = Math.min(canvasW * 0.32, 300)
  const H = W * 0.72

  ctx.clearRect(0, 0, canvasW, canvasH)

  // Crown — radial violet gradient with bright highlight
  const crownGrad = ctx.createRadialGradient(
    cx - W * 0.15, cy - H * 0.35, W * 0.01,
    cx, cy - H * 0.1, W * 0.8
  )
  crownGrad.addColorStop(0, "#f5f3ff")
  crownGrad.addColorStop(0.18, "#ddd6fe")
  crownGrad.addColorStop(0.45, "#8b5cf6")
  crownGrad.addColorStop(0.75, "#5b21b6")
  crownGrad.addColorStop(1, "#2e1065")

  ctx.beginPath()
  ctx.moveTo(cx - W / 2, cy)
  ctx.bezierCurveTo(cx - W * 0.55, cy - H * 0.28, cx - W * 0.4, cy - H * 0.9, cx, cy - H * 0.93)
  ctx.bezierCurveTo(cx + W * 0.4, cy - H * 0.9, cx + W * 0.55, cy - H * 0.28, cx + W / 2, cy)
  ctx.closePath()
  ctx.fillStyle = crownGrad
  ctx.fill()

  // Panel seams (6-panel)
  ctx.strokeStyle = "rgba(196, 181, 253, 0.4)"
  ctx.lineWidth = 1.2

  const seams = [-W * 0.22, -W * 0.04, W * 0.04, W * 0.22]
  seams.forEach((offset, i) => {
    const isOuter = i === 0 || i === 3
    const topX = cx + offset * (isOuter ? 0.95 : 0.18)
    const topY = cy - H * (isOuter ? 0.87 : 0.93)
    const botX = cx + offset * (isOuter ? 1 : 0.35)
    const botY = cy
    ctx.beginPath()
    ctx.moveTo(topX, topY)
    ctx.bezierCurveTo(
      cx + offset * (isOuter ? 0.95 : 0.5), cy - H * 0.55,
      cx + offset * (isOuter ? 1 : 0.7), cy - H * 0.15,
      botX, botY
    )
    ctx.stroke()
  })

  // Sweatband strip
  const bandH = H * 0.1
  ctx.fillStyle = "#6d28d9"
  ctx.fillRect(cx - W / 2, cy, W, bandH)
  // Band top highlight line
  ctx.fillStyle = "rgba(221, 214, 254, 0.55)"
  ctx.fillRect(cx - W / 2, cy, W, 1.5)

  // Brim
  const brimY = cy + bandH
  const brimH = H * 0.24
  ctx.beginPath()
  ctx.moveTo(cx - W * 0.48, brimY)
  ctx.lineTo(cx + W * 0.48, brimY)
  ctx.bezierCurveTo(
    cx + W * 0.48, brimY + brimH * 0.4,
    cx + W * 0.38, brimY + brimH,
    cx, brimY + brimH
  )
  ctx.bezierCurveTo(
    cx - W * 0.38, brimY + brimH,
    cx - W * 0.48, brimY + brimH * 0.4,
    cx - W * 0.48, brimY
  )
  ctx.fillStyle = "#4c1d95"
  ctx.fill()

  // Brim curved edge highlight
  ctx.beginPath()
  ctx.moveTo(cx - W * 0.48, brimY + 2)
  ctx.bezierCurveTo(
    cx - W * 0.48, brimY + brimH * 0.4,
    cx - W * 0.38, brimY + brimH,
    cx, brimY + brimH
  )
  ctx.bezierCurveTo(
    cx + W * 0.38, brimY + brimH,
    cx + W * 0.48, brimY + brimH * 0.4,
    cx + W * 0.48, brimY + 2
  )
  ctx.strokeStyle = "rgba(139, 92, 246, 0.65)"
  ctx.lineWidth = 1.8
  ctx.stroke()

  // Top button
  ctx.beginPath()
  ctx.arc(cx, cy - H * 0.93, W * 0.04, 0, Math.PI * 2)
  ctx.fillStyle = "#ede9fe"
  ctx.fill()
  ctx.beginPath()
  ctx.arc(cx, cy - H * 0.93, W * 0.024, 0, Math.PI * 2)
  ctx.fillStyle = "#ddd6fe"
  ctx.fill()

  // SSP embroidered text
  const fs = Math.max(W * 0.18, 16)
  ctx.font = `bold ${fs}px monospace`
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  // Shadow pass
  ctx.fillStyle = "rgba(76, 29, 149, 0.7)"
  ctx.fillText("SSP", cx + 1.2, cy - H * 0.3 + 1.2)
  // Main pass
  ctx.fillStyle = "rgba(245, 243, 255, 0.88)"
  ctx.fillText("SSP", cx, cy - H * 0.3)
}

export default function CapParticle() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let particles: Particle[] = []
    let animId: number

    const mouse: MouseState = {
      x: -9999,
      y: -9999,
      radius: 60,
      isActive: false,
    }

    function init() {
      canvas!.width = canvas!.offsetWidth
      canvas!.height = canvas!.offsetHeight

      const off = document.createElement("canvas")
      off.width = canvas!.width
      off.height = canvas!.height
      const offCtx = off.getContext("2d")
      if (!offCtx) return

      drawCap(offCtx, canvas!.width, canvas!.height)

      const { data } = offCtx.getImageData(0, 0, canvas!.width, canvas!.height)
      particles = []
      const gap = 5

      for (let y = 0; y < canvas!.height; y += gap) {
        for (let x = 0; x < canvas!.width; x += gap) {
          const idx = (y * canvas!.width + x) * 4
          if (data[idx + 3] > 60) {
            particles.push(
              new Particle(x, y, `rgb(${data[idx]},${data[idx + 1]},${data[idx + 2]})`)
            )
          }
        }
      }
    }

    function animate() {
      ctx!.globalCompositeOperation = "source-over"
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
      ctx!.globalCompositeOperation = "lighter"

      for (const p of particles) {
        p.update(mouse)
        p.draw(ctx!)
      }

      animId = requestAnimationFrame(animate)
    }

    init()
    animate()

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas!.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
      mouse.isActive = true
    }

    const onMouseLeave = () => {
      mouse.isActive = false
    }

    const onResize = () => {
      cancelAnimationFrame(animId)
      init()
      animate()
    }

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseleave", onMouseLeave)
    window.addEventListener("resize", onResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseleave", onMouseLeave)
      window.removeEventListener("resize", onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 15, pointerEvents: "none" }}
    />
  )
}
