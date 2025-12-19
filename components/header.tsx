"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import AteliersOverlay from "./ateliers-overlay"
import { cn } from "@/lib/utils"

export default function Header() {
  const [isAteliersOpen, setIsAteliersOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navLinks = [
    { label: "Ateliers", action: () => setIsAteliersOpen(true) },
    { label: "Événements", href: "#" },
    { label: "Communauté", href: "#" },
  ]

  return (
    <>
      <header className="relative z-50 flex items-center justify-between p-6 md:p-8">
        {/* Logo / Title */}
        <div className="flex items-center relative z-50">
          <span className="text-white text-lg md:text-xl font-medium tracking-tight">
            Super<span className="font-light">Sample</span>
            <span className="text-white/60 font-light ml-1 text-sm md:text-base">Paris</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          {navLinks.map((link) => (
            link.action ? (
              <button
                key={link.label}
                onClick={link.action}
                className="text-white/80 hover:text-white text-xs font-light px-4 py-2 rounded-full hover:bg-white/10 transition-all duration-200"
              >
                {link.label}
              </button>
            ) : (
              <Link
                key={link.label}
                href={link.href || "#"}
                className="text-white/80 hover:text-white text-xs font-light px-4 py-2 rounded-full hover:bg-white/10 transition-all duration-200"
              >
                {link.label}
              </Link>
            )
          ))}
        </nav>

        {/* Mobile Burger Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="relative z-50 block md:hidden w-10 h-10 flex flex-col justify-center items-center gap-1.5 focus:outline-none"
        >
          <motion.span
            animate={isMobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            className="w-6 h-px bg-white block"
          />
          <motion.span
            animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
            className="w-6 h-px bg-white block"
          />
          <motion.span
            animate={isMobileMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            className="w-6 h-px bg-white block"
          />
        </button>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center space-y-8 md:hidden"
            >
              {navLinks.map((link) => (
                link.action ? (
                  <button
                    key={link.label}
                    onClick={() => {
                      link.action?.()
                      setIsMobileMenuOpen(false)
                    }}
                    className="text-white text-2xl font-light tracking-tight"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href || "#"}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-white text-2xl font-light tracking-tight"
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AteliersOverlay isOpen={isAteliersOpen} onClose={() => setIsAteliersOpen(false)} />
    </>
  )
}
