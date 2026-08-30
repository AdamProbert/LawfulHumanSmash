"use client";

import Image from "next/image";
import BookChapter from "@/components/BookChapter";
import BookPage from "@/components/BookPage";

const FEATURED_VENUE = {
  name: "Tall John's House",
  location: "Llangorse, Brecon, LD3 7PX",
  description:
    "She's a beaut! A stunning Georgian manor house nestled in the heart of the Brecon Beacons countryside.",
  url: "https://www.tallJohn'shouse.com/",
  embedMapUrl:
    "https://maps.google.com/maps?q=Tall+John's+House,+Brecon+LD3+7PX&t=&z=8&ie=UTF8&iwloc=&output=embed",
};

const AREA_SEARCH_LINKS = [
  {
    name: "Airbnb Map",
    description:
      "Find cosy cottages, converted barns, and self-catering stays near Llangorse & Brecon.",
    url: "https://www.airbnb.co.uk/s/LD3-7PX/homes?query=LD3%207PX&place_id=ChIJHVdTB2wsbkgRJhoBHt6SF8U&ne_lat=52.05254528228725&ne_lng=-3.1578222265217164&sw_lat=51.79518926342488&sw_lng=-3.351033378084054&search_type=user_map_move&refinement_paths%5B%5D=%2Fhomes&flexible_trip_lengths%5B%5D=one_week&monthly_start_date=2026-09-01&monthly_length=3&monthly_end_date=2026-12-01&search_mode=regular_search&price_filter_input_type=2&channel=EXPLORE&zoom=11.602146117798032&zoom_level=11.602146117798032&search_by_map=true&price_filter_num_nights=1&date_picker_type=calendar&checkin=2027-07-10&checkout=2027-07-11&adults=2&source=structured_search_input_header",
    cta: "Search Airbnb",
  },
  {
    name: "Booking.com",
    description:
      "Explore hotels, country inns, and bed & breakfasts close to Tall John's House.",
    url: "https://www.booking.com/searchresults.en-gb.html?aid=304142&ss=Llangynidr%2C+Powys%2C+United+Kingdom&efdco=1&lang=en-gb&src=index&dest_id=-2601629&dest_type=city&ac_position=0&ac_click_type=b&ac_langcode=en&ac_suggestion_list_length=4&search_selected=true&checkin=2027-07-10&checkout=2027-07-11&group_adults=2&no_rooms=1&group_children=0&nflt=oos%3D1%3Bprice%3DGBP-min-200-1",
    cta: "Search Booking.com",
  },
];

// Example drive avoiding Llangynidr Bridge, via the A470 / A40
const EXAMPLE_ROUTE_URL =
  "https://maps.app.goo.gl/mqrtzhpHbgMFJ1xu7";

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
            alt="Aerial view of Tall John's House and grounds"
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
            title="Tall John's House Google Map"
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
            There are a limited number of rooms available at Tall John&apos;s House itself.
          </p>
          <p className="font-body text-xs text-bark-light leading-relaxed">
            Get in touch with{" "}
            <strong className="text-ivy-dark">Adam &amp; Mady</strong> to check
            what&apos;s still available, and we&apos;ll let you know.
          </p>
        </div>

        <p className="font-body text-xs sm:text-sm text-bark-light max-w-xs mx-auto mb-4">
          Otherwise, we recommend booking early as the Brecon Beacons are a popular destination! Here are some useful links for finding accomodation within a few miles of the venue:
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
              Tight Road Notice: Llangynidr Bridge
            </h3>
          </div>

          <p className="font-body text-xs text-bark-light leading-relaxed mb-3">
            Sat-navs sometimes route drivers over <strong>Llangynidr Bridge</strong>, a very narrow, old, old single-track stone bridge with tight walls.
          </p>

          <p className="font-body text-xs text-bark-light leading-relaxed mb-3">
            Conventional cars are fine, but <strong>vans, trucks, and wider vehicles</strong> should avoid this route entirely.
          </p>

          <div className="bg-sage-light/60 p-2.5 rounded border border-gold/30 text-xs text-ivy-dark">
            <strong className="block text-ivy-dark mb-1 font-heading">Recommended Route:</strong>
            Stick to the main <strong>A40 or A470</strong> and you will be absolutely fine.

            <a
              href={EXAMPLE_ROUTE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-nouveau inline-flex w-full justify-center text-xs py-1.5 mt-2.5"
            >
              Example Route (from Cardiff)
            </a>
          </div>
        </div>

        {/* Additional Travel Details */}
        <div className="mt-4 space-y-2 max-w-xs mx-auto text-left">
          <div className="card-nouveau p-3 text-xs">
            <span className="font-heading font-semibold text-ivy-dark block mb-0.5">
              On-Site Parking
            </span>
            <p className="text-bark-light">
              Ample free parking is available on-site.
            </p>
          </div>
        </div>
      </BookPage>
    </BookChapter>
  );
}
