"use client";

import { motion } from "framer-motion";
import ArtNouveauFrame from "@/components/ArtNouveauFrame";

const FEATURED_VENUE = {
  name: "Tall Johns House",
  description:
    "Our wedding venue! A stunning manor house nestled in the countryside. This is where the magic happens.",
  url: "https://www.talljohnshouse.com/",
  tags: ["Venue", "On-site accommodation"],
};

const RECOMMENDED_PLACES = [
  {
    name: "The Old Mill B&B",
    description:
      "Charming bed & breakfast just 5 minutes from the venue. Cosy rooms with countryside views.",
    distance: "5 min drive",
    priceRange: "££",
    bookingUrl: "#",
  },
  {
    name: "Woodland Lodge Hotel",
    description:
      "Modern hotel with excellent facilities. Great for families.",
    distance: "10 min drive",
    priceRange: "£££",
    bookingUrl: "#",
  },
  {
    name: "The Green Dragon Inn",
    description:
      "Traditional country pub with rooms above. Good food and even better company.",
    distance: "8 min drive",
    priceRange: "££",
    bookingUrl: "#",
  },
  {
    name: "Riverside Cottages",
    description:
      "Self-catering cottages perfect for groups. Book a whole cottage and make a weekend of it!",
    distance: "12 min drive",
    priceRange: "££",
    bookingUrl: "#",
  },
  {
    name: "The Coach House",
    description:
      "Boutique accommodation with a spa. Treat yourself — you deserve it.",
    distance: "15 min drive",
    priceRange: "£££",
    bookingUrl: "#",
  },
];

export default function AccommodationPage() {
  return (
    <section className="section-nouveau">
      <div className="section-inner">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-4xl sm:text-5xl text-gold-gradient mb-4">
            Accommodation
          </h1>
          <p className="font-heading text-lg text-bark-light max-w-xl mx-auto">
            Where to rest your head before and after the celebrations
          </p>
        </motion.div>

        {/* Featured: Tall Johns House */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ArtNouveauFrame>
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1 bg-gold/10 rounded-full border border-gold/30 mb-2">
                <span>⭐</span>
                <span className="font-heading text-xs tracking-wider uppercase text-gold-dark">
                  The Venue
                </span>
              </div>

              <h2 className="font-display text-3xl sm:text-4xl text-ivy-dark">
                {FEATURED_VENUE.name}
              </h2>

              {/* Placeholder for venue image */}
              <div className="w-full h-48 sm:h-64 rounded-lg bg-gradient-to-br from-ivy/10 to-leaf/10 flex items-center justify-center border border-gold/20">
                <div className="text-center">
                  <p className="text-5xl mb-2">🏡</p>
                  <p className="font-body text-sm text-bark-light italic">
                    Venue photo placeholder
                  </p>
                </div>
              </div>

              <p className="font-body text-lg text-bark-light max-w-lg mx-auto">
                {FEATURED_VENUE.description}
              </p>

              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {FEATURED_VENUE.tags.map((tag) => (
                  <span key={tag} className="pill-nouveau !text-xs">
                    {tag}
                  </span>
                ))}
              </div>

              <a
                href={FEATURED_VENUE.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-nouveau inline-flex mt-4"
              >
                Visit Venue Website →
              </a>
            </div>
          </ArtNouveauFrame>
        </motion.div>

        {/* Divider */}
        <div className="divider-nouveau">
          <span>🏡</span>
        </div>

        {/* Recommended Places */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="font-heading text-2xl text-ivy-dark text-center mb-2">
            Recommended Places to Stay
          </h2>
          <p className="font-body text-bark-light text-center mb-8">
            We&apos;ve scouted the area so you don&apos;t have to
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {RECOMMENDED_PLACES.map((place, i) => (
              <motion.div
                key={place.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                <div className="card-nouveau p-6 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-heading text-lg text-ivy-dark">
                      {place.name}
                    </h3>
                    <span className="font-body text-sm text-gold-dark">
                      {place.priceRange}
                    </span>
                  </div>

                  <p className="font-body text-bark-light flex-1 mb-4">
                    {place.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="font-body text-sm text-leaf flex items-center gap-1">
                      📍 {place.distance}
                    </span>
                    <a
                      href={place.bookingUrl}
                      className="font-heading text-sm text-gold-dark hover:text-gold transition-colors underline underline-offset-4 decoration-gold/30"
                    >
                      Book now →
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Map placeholder */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="card-nouveau p-6">
            <h3 className="font-heading text-lg text-ivy-dark text-center mb-4">
              📍 Area Map
            </h3>
            <div className="w-full h-64 sm:h-80 rounded-lg bg-gradient-to-br from-leaf/5 to-ivy/5 flex items-center justify-center border border-gold/20">
              <div className="text-center">
                <p className="text-4xl mb-2">🗺️</p>
                <p className="font-body text-bark-light">
                  Google Maps embed placeholder
                </p>
                <p className="font-body text-sm text-bark-light/60 mt-1">
                  Replace with an embedded Google Map of the area
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
