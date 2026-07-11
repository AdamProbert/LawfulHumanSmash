"use client";

import Leonard from "@/components/Leonard";
import BookChapter from "@/components/BookChapter";
import BookPage from "@/components/BookPage";

export default function ItineraryPage() {
  return (
    <BookChapter>
      <BookPage>
        <h1 className="font-display text-3xl sm:text-4xl text-gold-gradient mb-6">
          Itinerary
        </h1>

        <div className="text-6xl mb-4">🔮</div>

        <h2 className="font-heading text-2xl text-ivy-dark mb-3">Coming Soon</h2>

        <p className="font-body text-base text-bark-light max-w-xs mx-auto">
          We&apos;re still putting the finishing touches on the day&apos;s
          schedule. Check back closer to the date!
        </p>

        <div className="divider-nouveau !my-4">
          <span>✦</span>
        </div>

        <p className="font-body text-sm text-bark-light/70 max-w-xs mx-auto">
          What we can tell you: there will be food, drinks, dancing, and a{" "}
          <em>lot</em> of love.
        </p>

        <Leonard
          size={110}
          showSpeech
          speechText="Patience, human. 🐾"
          animate
          className="mx-auto mt-4"
        />
      </BookPage>
    </BookChapter>
  );
}

