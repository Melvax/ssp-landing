import type React from "react"
import type { Metadata } from "next"
import { Figtree } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { Instrument_Serif } from "next/font/google"
import "./globals.css"

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

const title = "SuperSample Paris – Collectif de beatmakers à Paris"
const description =
  "Collectif de beatmakers à Paris : workshops beatmaking gratuits chaque dimanche, Open Live Beats, jams et soirées pour mettre en lumière les beatmakers parisiens."

export const metadata: Metadata = {
  metadataBase: new URL("https://supersample.paris"),
  title,
  description,
  keywords: [
    "beatmaker paris",
    "beatmaking paris",
    "atelier beatmaking paris",
    "workshop beatmaking gratuit",
    "collectif beatmakers",
    "production musicale paris",
    "mao paris",
    "open live beats",
    "supersample paris",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "SuperSample Paris",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
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
        {children}
      </body>
    </html>
  )
}
