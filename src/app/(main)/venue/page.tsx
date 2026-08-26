"use client";

import Image from "next/image";
import BookChapter from "@/components/BookChapter";
import BookPage from "@/components/BookPage";

const FEATURED_VENUE = {
  name: "Tall Johns House",
  location: "Llangorse, Brecon, LD3 7PX",
  description:
    "Our wedding venue! A stunning Georgian manor house nestled in the heart of the Brecon Beacons countryside. This is where the ceremony, celebrations, and magic happen.",
  url: "https://www.talljohnshouse.com/",
  googleMapsUrl: "https://maps.google.com/?q=Tall+Johns+House,+Brecon+LD3+7PX",
  embedMapUrl:
    "https://maps.google.com/maps?q=Tall+Johns+House,+Brecon+LD3+7PX&t=&z=8&ie=UTF8&iwloc=&output=embed",
};

export default function VenuePage() {
  return (
    <BookChapter title="The Venue">
      {/* Page 1 — Venue overview & aerial photo */}
      <BookPage>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 rounded-full border border-gold/30 mb-2">
          <span className="font-heading text-xs tracking-wider uppercase text-gold-dark">
            Tall Johns House
          </span>
        </div>

        <h2 className="font-display text-2xl sm:text-3xl text-ivy-dark mb-3">
          {FEATURED_VENUE.name}
        </h2>

        <div className="relative w-full max-w-xs mx-auto h-44 rounded-lg overflow-hidden border border-gold/30 shadow-md">
          <Image
            src="/dji_fly_20230607_162016_74_1686151222973_photo_optimized.webp"
            alt="Aerial view of Tall Johns House and grounds"
            fill
            className="object-cover"
            sizes="20rem"
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ boxShadow: "inset 0 0 60px 20px rgba(0, 0, 0, 0.35)" }}
          />
        </div>

        <p className="font-body text-xs text-leaf mt-2 font-medium">
          📍 {FEATURED_VENUE.location}
        </p>

        <p className="font-body text-sm text-bark-light max-w-xs mx-auto mt-2">
          {FEATURED_VENUE.description}
        </p>

        <a
          href={FEATURED_VENUE.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-nouveau inline-flex mt-3 text-xs"
        >
          Visit Venue Website →
        </a>
      </BookPage>

      {/* Page 2 — Interactive Map */}
      <BookPage>
        <h2 className="font-heading text-2xl text-ivy-dark mb-2">
          📍 Interactive Map
        </h2>
        <p className="font-body text-xs text-bark-light/80 max-w-xs mx-auto mb-3">
          Located in Powys, Wales within Bannau Brycheiniog (Brecon Beacons National Park).
        </p>

        <div className="w-full max-w-xs mx-auto h-56 rounded-lg overflow-hidden border border-gold/30 shadow-inner bg-sage/20 relative mb-3">
          <iframe
            title="Tall Johns House Google Map"
            src={FEATURED_VENUE.embedMapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <a
          href={FEATURED_VENUE.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-nouveau inline-flex text-xs"
        >
          Open in Google Maps 🗺️
        </a>
      </BookPage>

      {/* Page 3 — Directions & Driving Bulletin */}
      <BookPage>
        <h2 className="font-heading text-2xl text-ivy-dark mb-3">
          📌 Driving & Directions
        </h2>

        {/* Bulletin Notice Card */}
        <div className="card-nouveau p-4 max-w-xs mx-auto text-left border-2 border-terracotta/40 bg-terracotta/5">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-terracotta/20">
            <span className="text-xl">⚠️</span>
            <h3 className="font-heading text-sm uppercase tracking-wider text-terracotta font-bold">
              Tight Road Notice for Large Cars
            </h3>
          </div>

          <p className="font-body text-xs text-bark-light leading-relaxed mb-3">
            If you are driving a <strong>large vehicle, SUV, or wide car</strong>, please take extra care on your approach!
          </p>

          <p className="font-body text-xs text-bark-light leading-relaxed mb-3">
            Sat-navs occasionally direct cars down narrow single-track backlanes with high hedges and tight stone walls.
          </p>

          <div className="bg-sage-light/60 p-2.5 rounded border border-gold/30 text-xs text-ivy-dark">
            <strong className="block text-ivy-dark mb-1 font-heading">💡 Recommended Route:</strong>
            Stick to the main <strong>A40 or A438</strong> towards Llangorse / Llanfihangel Tal-y-llyn rather than shortcutting down unclassified lanes.
          </div>
        </div>

        {/* Additional Travel Details */}
        <div className="mt-4 space-y-2 max-w-xs mx-auto text-left">
          <div className="card-nouveau p-3 text-xs">
            <span className="font-heading font-semibold text-ivy-dark block mb-0.5">
              🅿️ On-Site Parking
            </span>
            <p className="text-bark-light">
              Ample free parking is available directly on-site in the venue courtyard.
            </p>
          </div>

          <div className="card-nouveau p-3 text-xs">
            <span className="font-heading font-semibold text-ivy-dark block mb-0.5">
              🚆 Train & Taxi
            </span>
            <p className="text-bark-light">
              Nearest station: <strong>Abergavenny</strong> (~25-30 min taxi ride). We recommend booking taxis in advance!
            </p>
          </div>
        </div>
      </BookPage>
    </BookChapter>
  );
}
