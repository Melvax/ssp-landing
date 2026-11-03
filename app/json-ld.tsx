import type { UpcomingEvent } from "@/lib/events"

const SITE_URL = "https://supersample.paris"
const ORGANIZATION_ID = `${SITE_URL}/#organization`

const paris = {
  "@type": "PostalAddress",
  addressLocality: "Paris",
  addressRegion: "Île-de-France",
  addressCountry: "FR",
}

// Données structurées lues par Google : le collectif, le site et chaque événement à venir.
function toEventJsonLd(event: UpcomingEvent) {
  return {
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: event.startsAt,
    image: [event.image],
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.location ?? "Paris",
      address: paris,
    },
    organizer: { "@id": ORGANIZATION_ID },
    ...(event.price !== null && {
      offers: {
        "@type": "Offer",
        price: event.price,
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        url: event.signupUrl ?? SITE_URL,
      },
    }),
  }
}

export default function JsonLd({ events }: { events: UpcomingEvent[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        name: "SuperSample Paris",
        url: SITE_URL,
        logo: `${SITE_URL}/apple-icon.png`,
        email: "contact.supersample@gmail.com",
        sameAs: ["https://www.instagram.com/supersample.paris/"],
        description:
          "Collectif de beatmakers à Paris qui organise des workshops beatmaking gratuits chaque dimanche, des Open Live Beats, des jams et des soirées pour mettre en lumière les beatmakers.",
        address: paris,
        areaServed: "Paris",
        knowsAbout: ["Beatmaking", "Production musicale", "MAO", "Sound design"],
      },
      {
        "@type": "WebSite",
        name: "SuperSample Paris",
        url: SITE_URL,
        inLanguage: "fr-FR",
        publisher: { "@id": ORGANIZATION_ID },
      },
      ...events.map(toEventJsonLd),
    ],
  }

  // Échappe « < » pour qu'un texte d'événement ne puisse pas fermer la balise script.
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
    />
  )
}
