"use client";

import BookChapter from "@/components/BookChapter";
import BookPage from "@/components/BookPage";

const SCHEDULE = [
  {
    time: "13:30",
    icon: "🍸",
    title: "Arrival & Welcome Drinks",
    description: "Welcome to Tall Johns House! Grab a drink, mingle in the courtyard, and find your seat.",
  },
  {
    time: "14:00",
    icon: "💍",
    title: "The Ceremony",
    description: "Please take your seats as we exchange our vows and tie the knot.",
  },
  {
    time: "14:45",
    icon: "🥂",
    title: "Drinks, Canapés & Photos",
    description: "Confetti, lawn games, celebratory drinks, and photos on the grounds.",
  },
  {
    time: "17:00",
    icon: "🍽️",
    title: "Wedding Breakfast & Speeches",
    description: "A delicious feast followed by speeches, toasts, and laughter.",
  },
  {
    time: "19:30",
    icon: "🍰",
    title: "Evening Guests & Cake Cutting",
    description: "Evening guests arrive! Cutting of the cake followed by our first dance.",
  },
  {
    time: "20:00",
    icon: "🎷",
    title: "Party & Late-Night Bites",
    description: "Live band, dancing, and late-night street food served from the trucks.",
  },
  {
    time: "00:00",
    icon: "🌙",
    title: "Carriages",
    description: "Last orders and time to head home after an unforgettable celebration!",
  },
];

export default function ItineraryPage() {
  return (
    <BookChapter title="Itinerary">
      <BookPage>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 rounded-full border border-gold/30 mb-2">
          <span className="font-heading text-xs tracking-wider uppercase text-gold-dark">
            The Order of the Day
          </span>
        </div>

        <h2 className="font-display text-2xl sm:text-3xl text-ivy-dark mb-2">
          Wedding Schedule
        </h2>

        <p className="font-body text-xs text-bark-light/80 max-w-xs mx-auto mb-4">
          Here is what to expect on the day. Timings may shift slightly as the day flows!
        </p>

        {/* Timeline */}
        <div className="space-y-3 max-w-xs mx-auto text-left relative">
          {SCHEDULE.map((event, idx) => (
            <div key={event.time} className="card-nouveau p-3.5 relative">
              <div className="flex items-center justify-between mb-1">
                <span className="font-heading text-xs font-bold px-2 py-0.5 rounded bg-gold/15 text-gold-dark border border-gold/30">
                  {event.time}
                </span>
                <span className="text-lg">{event.icon}</span>
              </div>
              <h3 className="font-heading text-sm text-ivy-dark font-bold mb-1">
                {event.title}
              </h3>
              <p className="font-body text-xs text-bark-light leading-relaxed">
                {event.description}
              </p>
              {idx < SCHEDULE.length - 1 && (
                <div className="text-center text-xs text-gold/40 mt-1.5 font-serif">
                  ✦
                </div>
              )}
            </div>
          ))}
        </div>
      </BookPage>
    </BookChapter>
  );
}

