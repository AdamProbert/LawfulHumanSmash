"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Leonard from "@/components/Leonard";
import ArtNouveauFrame from "@/components/ArtNouveauFrame";

export default function TLDRPage() {
  return (
    <section className="section-nouveau min-h-[80vh] flex items-center">
      <div className="section-inner w-full">
        {/* Page heading */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-display text-4xl sm:text-5xl text-gold-gradient mb-4">
            TL;DR
          </h1>
          <p className="font-heading text-lg text-bark-light">
            Everything you need to know in 30 seconds
          </p>
        </motion.div>

        {/* Need-to-knows card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <ArtNouveauFrame className="max-w-2xl mx-auto">
            <div className="text-center space-y-6">
              <div>
                <p className="font-heading text-sm tracking-[0.2em] uppercase text-gold-dark mb-2">
                  When
                </p>
                <p className="font-display text-2xl sm:text-3xl text-ivy-dark">
                  July 10th, 2027
                </p>
              </div>

              <div className="divider-nouveau !my-6">
                <span>✦</span>
              </div>

              <div>
                <p className="font-heading text-sm tracking-[0.2em] uppercase text-gold-dark mb-2">
                  Where
                </p>
                <p className="font-display text-2xl sm:text-3xl text-ivy-dark">
                  Tall Johns House
                </p>
                <a
                  href="https://www.talljohnshouse.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 font-body text-gold-dark hover:text-gold transition-colors underline underline-offset-4 decoration-gold/30"
                >
                  Visit the venue →
                </a>
              </div>

              <div className="divider-nouveau !my-6">
                <span>✦</span>
              </div>

              <div>
                <p className="font-heading text-sm tracking-[0.2em] uppercase text-gold-dark mb-2">
                  Dress Code
                </p>
                <p className="font-heading text-xl text-ivy-dark">
                  Colourful 🌈
                </p>
                <p className="font-body text-bark-light mt-1">
                  Think bright summer woodland tones
                </p>
              </div>

              <div className="divider-nouveau !my-6">
                <span>✦</span>
              </div>

              <div>
                <p className="font-heading text-sm tracking-[0.2em] uppercase text-gold-dark mb-2">
                  RSVP By
                </p>
                <p className="font-heading text-xl text-accent-burgundy font-semibold">
                  January 1st, 2027
                </p>
              </div>
            </div>
          </ArtNouveauFrame>
        </motion.div>

        {/* Leonard RSVP nudge */}
        <motion.div
          className="flex flex-col items-center mt-16 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {/* Arrow pointing to Leonard */}
          <motion.div
            className="text-gold text-4xl"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            ↓
          </motion.div>

          <Link href="/rsvp" className="group cursor-pointer">
            <Leonard
              size={180}
              showSpeech
              speechText="Don't forget to RSVP! 🐾"
              animate
            />
          </Link>

          <Link href="/rsvp" className="btn-nouveau mt-4">
            RSVP Now
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
