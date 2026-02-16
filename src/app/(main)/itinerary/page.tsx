"use client";

import { motion } from "framer-motion";
import Leonard from "@/components/Leonard";
import ArtNouveauFrame from "@/components/ArtNouveauFrame";

export default function ItineraryPage() {
  return (
    <section className="section-nouveau min-h-[70vh] flex items-center">
      <div className="section-inner w-full">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-4xl sm:text-5xl text-gold-gradient mb-8">
            Itinerary
          </h1>

          <ArtNouveauFrame className="max-w-md mx-auto">
            <div className="text-center space-y-6 py-4">
              <motion.div
                className="text-6xl"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              >
                🔮
              </motion.div>

              <h2 className="font-heading text-3xl text-ivy-dark">
                Coming Soon
              </h2>

              <p className="font-body text-lg text-bark-light">
                We&apos;re still putting the finishing touches on the day&apos;s
                schedule. Check back closer to the date!
              </p>

              <div className="divider-nouveau !my-4">
                <span>✦</span>
              </div>

              <p className="font-body text-bark-light/70">
                What we can tell you: there will be food, drinks, dancing, and
                a <em>lot</em> of love.
              </p>

              <Leonard
                size={120}
                showSpeech
                speechText="Patience, human. 🐾"
                animate
                className="mx-auto mt-4"
              />
            </div>
          </ArtNouveauFrame>
        </motion.div>
      </div>
    </section>
  );
}
