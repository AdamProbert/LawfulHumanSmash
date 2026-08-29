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
  embedMapUrl:
    "https://maps.google.com/maps?q=Tall+Johns+House,+Brecon+LD3+7PX&t=&z=8&ie=UTF8&iwloc=&output=embed",
};

const AREA_SEARCH_LINKS = [
  {
    name: "Airbnb Map (10-Mile Radius)",
    description:
      "Find cosy cottages, converted barns, and self-catering stays near Llangorse & Brecon.",
    url: "https://www.airbnb.co.uk/s/LD3-7PX/homes",
    cta: "Search Airbnb →",
  },
  {
    name: "Booking.com (10-Mile Radius)",
    description:
      "Explore hotels, country inns, and bed & breakfasts close to Tall Johns House.",
    url: "https://www.booking.com/searchresults.html?ss=Tall+Johns+House%2C+Brecon%2C+Wales%2C+United+Kingdom",
    cta: "Search Booking.com →",
  },
];

export default function VenuePage() {
  return (
    <BookChapter title="The Venue">
      {/* Page 1: Venue overview & aerial photo */}
      <BookPage>
        <h2 className="font-body text-2xl sm:text-3xl text-ivy-dark mb-3">
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
          {FEATURED_VENUE.location}
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

      {/* Page 2: Interactive Map */}
      <BookPage>
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

      </BookPage>

      {/* Page 3: Where to stay */}
      <BookPage>
        <h2 className="font-body text-2xl sm:text-3xl text-ivy-dark mb-2">
          Find Your Stay
        </h2>

        {/* On-site rooms: limited, so it goes first and points at us, not a booking site */}
        <div className="card-nouveau p-4 max-w-xs mx-auto text-left border-2 border-gold/50 bg-gold/5 mb-4">
          <h3 className="font-heading text-sm uppercase tracking-wider text-gold-dark font-bold mb-2 pb-2 border-b border-gold/20">
            Staying On-Site
          </h3>
          <p className="font-body text-xs text-bark-light leading-relaxed mb-2">
            There are a limited number of rooms at Tall Johns House itself, so no
            need to travel home at the end of the night.
          </p>
          <p className="font-body text-xs text-bark-light leading-relaxed">
            Spaces are very limited. Get in touch with{" "}
            <strong className="text-ivy-dark">Adam &amp; Mady</strong> to check
            what&apos;s still available, and we&apos;ll let you know.
          </p>
        </div>

        <p className="font-body text-xs sm:text-sm text-bark-light max-w-xs mx-auto mb-4">
          Otherwise, we recommend booking early as the Brecon Beacons area is a popular destination! Here are area search maps centered within 10 miles of Tall Johns House.
        </p>

        <div className="space-y-3 max-w-xs mx-auto text-left">
          {AREA_SEARCH_LINKS.map((link) => (
            <div key={link.name} className="card-nouveau p-3.5 border-gold/30">
              <h3 className="font-heading text-sm text-ivy-dark font-bold mb-1">
                {link.name}
              </h3>
              <p className="font-body text-xs text-bark-light mb-3">
                {link.description}
              </p>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-nouveau inline-flex w-full justify-center text-xs py-1.5"
              >
                {link.cta}
              </a>
            </div>
          ))}
        </div>
      </BookPage>

      {/* Page 4: Directions & Driving Bulletin */}
      <BookPage>
        <h2 className="font-heading text-2xl text-ivy-dark mb-3">
          Driving &amp; Directions
        </h2>

        {/* Bulletin Notice Card */}
        <div className="card-nouveau p-4 max-w-xs mx-auto text-left border-2 border-terracotta/40 bg-terracotta/5">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-terracotta/20">
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
            <strong className="block text-ivy-dark mb-1 font-heading">Recommended Route:</strong>
            Stick to the main <strong>A40 or A438</strong> towards Llangorse / Llanfihangel Tal-y-llyn rather than shortcutting down unclassified lanes.
          </div>
        </div>

        {/* Additional Travel Details */}
        <div className="mt-4 space-y-2 max-w-xs mx-auto text-left">
          <div className="card-nouveau p-3 text-xs">
            <span className="font-heading font-semibold text-ivy-dark block mb-0.5">
              On-Site Parking
            </span>
            <p className="text-bark-light">
              Ample free parking is available directly on-site in the venue courtyard.
            </p>
          </div>

          <div className="card-nouveau p-3 text-xs">
            <span className="font-heading font-semibold text-ivy-dark block mb-0.5">
              Train &amp; Taxi
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
