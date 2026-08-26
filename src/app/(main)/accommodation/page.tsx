"use client";

import BookChapter from "@/components/BookChapter";
import BookPage from "@/components/BookPage";

const AREA_SEARCH_LINKS = [
  {
    name: "Airbnb Map (10-Mile Radius)",
    icon: "🏡",
    description:
      "Find cosy cottages, converted barns, and self-catering stays near Llangorse & Brecon.",
    url: "https://www.airbnb.co.uk/s/LD3-7PX/homes",
    cta: "Search Airbnb →",
  },
  {
    name: "Booking.com (10-Mile Radius)",
    icon: "🏨",
    description:
      "Explore hotels, country inns, and bed & breakfasts close to Tall Johns House.",
    url: "https://www.booking.com/searchresults.html?ss=Tall+Johns+House%2C+Brecon%2C+Wales%2C+United+Kingdom",
    cta: "Search Booking.com →",
  },
];

const RECOMMENDED_PLACES = [
  {
    name: "The Old Mill B&B",
    description:
      "Charming bed & breakfast just 5 minutes from the venue. Cosy rooms with countryside views.",
    distance: "5 min drive",
    priceRange: "££",
    bookingUrl: "https://www.booking.com/searchresults.html?ss=The+Old+Mill+Brecon",
  },
  {
    name: "Woodland Lodge Hotel",
    description:
      "Modern hotel with excellent facilities and spacious family rooms.",
    distance: "10 min drive",
    priceRange: "£££",
    bookingUrl: "https://www.booking.com/searchresults.html?ss=Woodland+Lodge+Brecon",
  },
  {
    name: "The Green Dragon Inn",
    description:
      "Traditional Welsh country pub with comfortable guest rooms and delicious food.",
    distance: "8 min drive",
    priceRange: "££",
    bookingUrl: "https://www.booking.com/searchresults.html?ss=Green+Dragon+Inn+Llangorse",
  },
  {
    name: "Riverside Cottages",
    description:
      "Self-catering cottages perfect for groups. Book a whole cottage for the weekend!",
    distance: "12 min drive",
    priceRange: "££",
    bookingUrl: "https://www.airbnb.co.uk/s/Brecon--United-Kingdom/homes",
  },
  {
    name: "The Coach House",
    description:
      "Boutique countryside accommodation with garden views and luxury rooms.",
    distance: "15 min drive",
    priceRange: "£££",
    bookingUrl: "https://www.booking.com/searchresults.html?ss=The+Coach+House+Brecon",
  },
];

export default function AccommodationPage() {
  return (
    <BookChapter title="Accommodation">
      {/* Page 1 — Area Maps (Airbnb & Booking.com) */}
      <BookPage>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 rounded-full border border-gold/30 mb-2">
          <span className="font-heading text-xs tracking-wider uppercase text-gold-dark">
            Where to Stay
          </span>
        </div>

        <h2 className="font-display text-2xl sm:text-3xl text-ivy-dark mb-2">
          Find Your Stay
        </h2>

        <p className="font-body text-xs sm:text-sm text-bark-light max-w-xs mx-auto mb-4">
          We recommend booking early as the Brecon Beacons area is a popular destination! Here are area search maps centered within 10 miles of Tall Johns House.
        </p>

        <div className="space-y-3 max-w-xs mx-auto text-left">
          {AREA_SEARCH_LINKS.map((link) => (
            <div key={link.name} className="card-nouveau p-3.5 border-gold/30">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{link.icon}</span>
                <h3 className="font-heading text-sm text-ivy-dark font-bold">
                  {link.name}
                </h3>
              </div>
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

      {/* Page 2 — Recommended local places */}
      <BookPage>
        <h2 className="font-heading text-2xl text-ivy-dark mb-2">
          Recommended Local Places
        </h2>
        <p className="font-body text-xs text-bark-light/80 max-w-xs mx-auto mb-4">
          A selection of nearby B&Bs, hotels, and inns close to the venue.
        </p>

        <div className="space-y-3 max-w-xs mx-auto text-left">
          {RECOMMENDED_PLACES.map((place) => (
            <div key={place.name} className="card-nouveau p-3.5">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-heading text-sm text-ivy-dark font-semibold">
                  {place.name}
                </h3>
                <span className="font-body text-xs text-gold-dark font-bold">
                  {place.priceRange}
                </span>
              </div>
              <p className="font-body text-xs text-bark-light mb-2">
                {place.description}
              </p>
              <div className="flex items-center justify-between pt-1 border-t border-gold/10">
                <span className="font-body text-xs text-leaf flex items-center gap-1">
                  📍 {place.distance}
                </span>
                <a
                  href={place.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-heading text-xs text-gold-dark hover:text-gold transition-colors underline underline-offset-4 decoration-gold/30"
                >
                  Search availability →
                </a>
              </div>
            </div>
          ))}
        </div>
      </BookPage>
    </BookChapter>
  );
}
