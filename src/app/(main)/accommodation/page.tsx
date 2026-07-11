"use client";

import Image from "next/image";
import BookChapter from "@/components/BookChapter";
import BookPage from "@/components/BookPage";

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
    <BookChapter>
      {/* Page 1 — the venue */}
      <BookPage>
        <h1 className="font-display text-3xl sm:text-4xl text-gold-gradient mb-1">
          Accommodation
        </h1>
        <p className="font-heading text-sm text-bark-light max-w-xs mx-auto mb-4">
          Where to rest your head before and after the celebrations
        </p>

        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 rounded-full border border-gold/30 mb-2">
          <span>⭐</span>
          <span className="font-heading text-xs tracking-wider uppercase text-gold-dark">
            The Venue
          </span>
        </div>

        <h2 className="font-display text-2xl sm:text-3xl text-ivy-dark mb-3">
          {FEATURED_VENUE.name}
        </h2>

        <div className="relative w-full max-w-xs mx-auto h-40 rounded-lg overflow-hidden border border-gold/20">
          <Image
            src="/dji_fly_20230607_162016_74_1686151222973_photo_optimized.webp"
            alt="Aerial view of Tall Johns House and its grounds"
            fill
            className="object-cover"
            sizes="20rem"
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ boxShadow: "inset 0 0 60px 20px rgba(0, 0, 0, 0.35)" }}
          />
        </div>

        <p className="font-body text-sm text-bark-light max-w-xs mx-auto mt-3">
          {FEATURED_VENUE.description}
        </p>

        <a
          href={FEATURED_VENUE.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-nouveau inline-flex mt-4"
        >
          Visit Venue Website →
        </a>
      </BookPage>

      {/* Pages 2–3 — recommended places, three per page */}
      {[0, 3].map((start) => (
        <BookPage key={start}>
          <h2 className="font-heading text-2xl text-ivy-dark mb-1">
            Where to Stay
          </h2>
          <p className="font-body text-sm text-bark-light mb-4">
            We&apos;ve scouted the area so you don&apos;t have to
          </p>

          <div className="space-y-3 max-w-xs mx-auto text-left">
            {RECOMMENDED_PLACES.slice(start, start + 3).map((place) => (
              <div key={place.name} className="card-nouveau p-4">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-heading text-base text-ivy-dark">
                    {place.name}
                  </h3>
                  <span className="font-body text-sm text-gold-dark">
                    {place.priceRange}
                  </span>
                </div>
                <p className="font-body text-sm text-bark-light mb-2">
                  {place.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-body text-xs text-leaf flex items-center gap-1">
                    📍 {place.distance}
                  </span>
                  <a
                    href={place.bookingUrl}
                    className="font-heading text-xs text-gold-dark hover:text-gold transition-colors underline underline-offset-4 decoration-gold/30"
                  >
                    Book now →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </BookPage>
      ))}

      {/* Page 4 — area map */}
      <BookPage>
        <h3 className="font-heading text-2xl text-ivy-dark mb-4">📍 Area Map</h3>
        <div className="w-full max-w-xs mx-auto h-64 rounded-lg bg-gradient-to-br from-leaf/5 to-ivy/5 flex items-center justify-center border border-gold/20">
          <div className="text-center">
            <p className="text-4xl mb-2">🗺️</p>
            <p className="font-body text-sm text-bark-light">
              Google Maps embed placeholder
            </p>
          </div>
        </div>
      </BookPage>
    </BookChapter>
  );
}
