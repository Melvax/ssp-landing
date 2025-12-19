import type React from "react"
import type { Metadata } from "next"
import { Figtree } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { Instrument_Serif } from "next/font/google"
import "./globals.css"
import JsonLd from "./json-ld"

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-figtree",
  display: "swap",
})

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://supersample.paris"),
  title: "SuperSample Paris | Collectif Beatmaking & Production",
  description:
    "Rejoins SuperSample Paris — ateliers hebdomadaires, sessions live et événements communautaires pour producteurs et beatmakers à Paris.",
  keywords: [
    "beatmaking paris",
    "production musicale",
    "mao paris",
    "ableton user group",
    "ateliers musique électronique",
    "supersample",
    "événement beatmaker",
    "sound design paris",
  ],
  openGraph: {
    title: "SuperSample Paris | Collectif Beatmaking",
    description: "La communauté des producteurs et beatmakers à Paris. Ateliers chaque dimanche.",
    url: "https://supersample.paris",
    siteName: "SuperSample Paris",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SuperSample Paris",
    description: "Collectif et ateliers beatmaking à Paris.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <head>
        <style>{`
html {
  font-family: ${figtree.style.fontFamily};
  --font-sans: ${figtree.variable};
  --font-mono: ${GeistMono.variable};
  --font-instrument-serif: ${instrumentSerif.variable};
}
        `}</style>
      </head>
      <body className={`${figtree.variable} ${instrumentSerif.variable}`}>
        <JsonLd />
        {children}
      </body>
    </html>
  )
}
