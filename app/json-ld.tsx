export default function JsonLd() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "SuperSample Paris",
        url: "https://supersample.paris",
        sameAs: ["https://instagram.com/supersampleparis"],
        description: "Collectif de beatmaking et production musicale à Paris.",
        address: {
            "@type": "PostalAddress",
            addressLocality: "Paris",
            addressCountry: "FR",
        },
        event: {
            "@type": "EventSeries",
            name: "Ateliers Hebdomadaires SuperSample",
            description: "Rencontres hebdomadaires pour producteurs et beatmakers.",
            location: {
                "@type": "Place",
                name: "Paris",
                address: {
                    "@type": "PostalAddress",
                    addressLocality: "Paris",
                    addressCountry: "FR",
                },
            },
        },
    }

    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}
