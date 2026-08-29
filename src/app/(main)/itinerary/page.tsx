"use client";

import BookChapter from "@/components/BookChapter";
import BookPage from "@/components/BookPage";

/** Rough running order — start times only, because the day will do its own thing. */
const SCHEDULE = [
  {
    time: "12:30",
    title: "Guests arrive",
    description: "Roll up, say hello, grab a drink and find a spot.",
  },
  {
    time: "1:30",
    title: "Ceremony",
    description: "The main event. Seats please!",
  },
  {
    time: "2:00",
    title: "Chill time",
    description: "Drinks, games and pictures out on the grounds.",
  },
  {
    time: "3:30",
    title: "Lunch & speeches",
    description: "Food, toasts, and a few words from the usual suspects.",
  },
  {
    time: "6:00",
    title: "More chill time & first band",
    description: "Settle back in — the first band takes over.",
  },
  {
    time: "7:30",
    title: "First dance",
    description: "Ours. Then the floor is all yours.",
  },
  {
    time: "7:40",
    title: "Party band",
    description: "Set two, and it gets loud.",
  },
  {
    time: "8:30",
    title: "Pizzas",
    description: "Late-night slices to keep you going.",
  },
  {
    time: "9:00",
    title: "Rock band",
    description: "Two hours of it. Bring your dancing shoes.",
  },
  {
    time: "11:00",
    title: "Home time",
    description: "Last orders and off you go.",
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

        <h2 className="font-body text-2xl sm:text-3xl text-ivy-dark mb-2">
          How the day looks
        </h2>

        <p className="font-body text-xs text-bark-light/80 max-w-xs mx-auto mb-4">
          Roughly, anyway — all subject to change as the day runs away with us.
        </p>

        {/* Timeline */}
        <div className="space-y-3 max-w-xs mx-auto text-left relative">
          {SCHEDULE.map((event, idx) => (
            <div key={event.time} className="card-nouveau p-3.5 relative">
              <span className="font-body text-xs font-bold px-2 py-0.5 rounded bg-gold/15 text-gold-dark border border-gold/30 inline-block mb-1">
                {event.time}
              </span>
              <h3 className="font-body text-sm text-ivy-dark font-bold mb-1">
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
