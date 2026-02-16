"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import ArtNouveauFrame from "@/components/ArtNouveauFrame";
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
    <section className="section-nouveau">
      <div className="section-inner">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-4xl sm:text-5xl text-gold-gradient mb-4">
            Food &amp; Drinks
          </h1>
          <p className="font-heading text-lg text-bark-light max-w-xl mx-auto">
            Three incredible food trucks and a bar stocked based on YOUR votes
          </p>
        </motion.div>

        {/* ── Food Trucks ──────────────────── */}
        <div className="mb-16">
          <h2 className="font-heading text-2xl text-ivy-dark text-center heading-ornament mb-10">
            The Food Trucks
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            {FOOD_TRUCKS.map((truck, i) => (
              <motion.div
                key={truck.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.15 }}
              >
                <div className="card-nouveau p-6 h-full flex flex-col text-center">
                  <div className="text-5xl mb-4">{truck.emoji}</div>
                  <h3 className="font-heading text-xl text-ivy-dark mb-3">
                    {truck.name}
                  </h3>
                  <p className="font-body text-bark-light flex-1 mb-4">
                    {truck.description}
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {truck.tags.map((tag) => (
                      <span key={tag} className="pill-nouveau !text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="divider-nouveau">
          <span>🍸</span>
        </div>

        {/* ── Drinks Wheel ──────────────────── */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="font-heading text-2xl text-ivy-dark text-center heading-ornament mb-4">
            The Drinks Vote
          </h2>
          <p className="font-body text-bark-light text-center max-w-lg mx-auto mb-10">
            Pick your top 3 drinks when you RSVP. We&apos;ll use the results
            to stock the bar — democracy in action! 🗳️
          </p>

          <ArtNouveauFrame variant="simple" className="max-w-xl mx-auto">
            <div className="py-4">
              {loadingDrinks ? (
                <div className="text-center py-12">
                  <motion.div
                    className="text-4xl"
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      ease: "linear",
                    }}
                  >
                    🍸
                  </motion.div>
                  <p className="font-body text-bark-light mt-4">
                    Loading drink votes...
                  </p>
                </div>
              ) : (
                <DrinkWheel drinks={drinks} size={280} />
              )}
            </div>
          </ArtNouveauFrame>

          <p className="text-center mt-6">
            <a
              href="/rsvp"
              className="font-heading text-sm text-gold-dark hover:text-gold transition-colors underline underline-offset-4 decoration-gold/30"
            >
              Cast your votes on the RSVP page →
            </a>
          </p>
        </motion.div>

        {/* ── Dietary Note ──────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="card-nouveau p-6 text-center max-w-lg mx-auto">
            <h3 className="font-heading text-lg text-ivy-dark mb-2">
              🌱 Dietary Requirements
            </h3>
            <p className="font-body text-bark-light">
              Please let us know about any dietary requirements or allergies
              when you RSVP. Our food trucks can accommodate most dietary
              needs — we want everyone to eat well!
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
