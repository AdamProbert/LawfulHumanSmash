"use client";

import { useState, useEffect, useCallback } from "react";
import BookChapter from "@/components/BookChapter";
import BookPage from "@/components/BookPage";
import DrinkWheel from "@/components/DrinkWheel";

const FOOD_TRUCKS = [
  {
    name: "Meet and Greek",
    emoji: "🥙",
    description:
      "Authentic Greek street food — think juicy gyros, crispy halloumi wraps, and loaded mezze plates.",
    tags: ["Greek", "Street Food", "Veggie Options"],
  },
  {
    name: "The Bearded Taco",
    emoji: "🌮",
    description:
      "Bold, flavourful tacos with creative fillings. From slow-cooked brisket to jackfruit — there's something for everyone.",
    tags: ["Mexican", "Tacos", "Vegan Options"],
  },
  {
    name: "Emanuel's Pizza",
    emoji: "🍕",
    description:
      "Wood-fired pizza straight from a converted van. Proper Neapolitan-style with that perfect charred crust.",
    tags: ["Italian", "Pizza", "Wood-fired"],
  },
];

interface DrinkData {
  id: string;
  name: string;
  emoji: string;
  color: string;
  _count: { votes: number };
}

export default function FoodDrinksPage() {
  const [drinks, setDrinks] = useState<DrinkData[]>([]);
  const [loadingDrinks, setLoadingDrinks] = useState(true);

  const fetchDrinks = useCallback(async () => {
    try {
      const res = await fetch("/api/drinks");
      const data = await res.json();
      setDrinks(data.drinks || []);
    } catch (err) {
      console.error("Failed to load drinks:", err);
    } finally {
      setLoadingDrinks(false);
    }
  }, []);

  useEffect(() => {
    fetchDrinks();
    // Poll every 30s for live updates
    const interval = setInterval(fetchDrinks, 30000);
    return () => clearInterval(interval);
  }, [fetchDrinks]);

  return (
    <BookChapter title="Food & Drinks">
      {/* Page 1 — food trucks */}
      <BookPage>
        <div className="space-y-3 max-w-xs mx-auto text-left">
          {FOOD_TRUCKS.map((truck) => (
            <div key={truck.name} className="card-nouveau p-4">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-3xl">{truck.emoji}</span>
                <h3 className="font-heading text-lg text-ivy-dark">
                  {truck.name}
                </h3>
              </div>
              <p className="font-body text-sm text-bark-light mb-2">
                {truck.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {truck.tags.map((tag) => (
                  <span key={tag} className="pill-nouveau !text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </BookPage>

      {/* Page 2 — drinks vote */}
      <BookPage>
        <h2 className="font-heading text-2xl text-ivy-dark mb-2">
          The Drinks Vote
        </h2>
        <p className="font-body text-sm text-bark-light max-w-xs mx-auto mb-4">
          Pick your top 3 drinks when you RSVP — we&apos;ll stock the bar by the
          results.
        </p>

        {loadingDrinks ? (
          <div className="py-10">
            <p className="font-body text-sm text-bark-light">
              Loading drink votes…
            </p>
          </div>
        ) : (
          <div className="flex justify-center">
            <DrinkWheel drinks={drinks} size={230} />
          </div>
        )}

        <p className="mt-5">
          <a
            href="/rsvp"
            className="font-heading text-sm text-gold-dark hover:text-gold transition-colors underline underline-offset-4 decoration-gold/30"
          >
            Cast your votes on the RSVP page →
          </a>
        </p>
      </BookPage>

      {/* Page 3 — dietary note */}
      <BookPage>
        <h3 className="font-heading text-2xl text-ivy-dark mb-3">
          Dietary Requirements
        </h3>
        <p className="font-body text-base text-bark-light max-w-xs mx-auto">
          Please let us know about any dietary requirements or allergies when
          you RSVP. Our food trucks can accommodate most needs — we want
          everyone to eat well!
        </p>
      </BookPage>
    </BookChapter>
  );
}
