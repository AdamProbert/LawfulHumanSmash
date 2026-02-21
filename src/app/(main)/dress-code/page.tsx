"use client";

import { motion } from "framer-motion";
import ArtNouveauFrame from "@/components/ArtNouveauFrame";

/* Woodland-inspired bright summer colour swatches */
const COLOUR_SWATCHES = [
  { name: "Fern",           color: "#4A7C2E", textColor: "white" },
  { name: "Moss",           color: "#6B8F3C", textColor: "white" },
  { name: "Sunflower",      color: "#F2C94C", textColor: "#2C1810" },
  { name: "Marigold",       color: "#E8941E", textColor: "white" },
  { name: "Bluebell",       color: "#5B8FD4", textColor: "white" },
  { name: "Wild Rose",      color: "#E74C6F", textColor: "white" },
  { name: "Poppy",          color: "#E74C3C", textColor: "white" },
  { name: "Bramble",        color: "#722F37", textColor: "white" },
  { name: "Cornflower",     color: "#6495ED", textColor: "white" },
  { name: "Buttercup",      color: "#FFD700", textColor: "#2C1810" },
  { name: "Meadow Pink",    color: "#FF8A9E", textColor: "#2C1810" },
  { name: "Tangerine",      color: "#FF6F3C", textColor: "white" },
  { name: "Sage",           color: "#87A96B", textColor: "white" },
  { name: "Coral",          color: "#FF7F50", textColor: "white" },
];

const INSPIRATION_TIPS = [
  {
    emoji: "🌿",
    title: "Woodland Dual Tones",
    text: "Pair a rich green with a contrasting bright colour — think fern & sunflower, or moss & wild rose.",
  },
  {
    emoji: "☀️",
    title: "Bright Summer Vibes",
    text: "Don't be shy! This is a celebration — the bolder and more colourful, the better.",
  },
  {
    emoji: "🎨",
    title: "Mix & Match",
    text: "Pick two or three colours that make you happy. There's no wrong answer (except beige).",
  },
  {
    emoji: "👗",
    title: "Comfort is Key",
    text: "It's a field wedding in July. Think breathable fabrics, comfortable shoes, and something you can dance in!",
  },
];

export default function DressCodePage() {
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
            Dress Code
          </h1>
          <motion.p
            className="font-heading text-3xl text-ivy-dark mb-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            Colourful 🌈
          </motion.p>
          <p className="font-heading text-lg text-bark-light max-w-xl mx-auto">
            We want a sea of colour! Think bright summer woodland tones.
          </p>
        </motion.div>

        {/* Colour Palette */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <ArtNouveauFrame className="max-w-2xl mx-auto">
            <h2 className="font-heading text-xl text-ivy-dark text-center mb-6">
              Colour Inspiration
            </h2>
            <p className="font-body text-bark-light text-center mb-8">
              Here are some colours we love — mix, match, and make it your own
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              {COLOUR_SWATCHES.map((swatch, i) => (
                <motion.div
                  key={swatch.name}
                  className="group relative"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.4 + i * 0.04,
                    type: "spring",
                    stiffness: 200,
                  }}
                >
                  <div
                    className="swatch w-16 h-16 sm:w-20 sm:h-20"
                    style={{ backgroundColor: swatch.color }}
                    title={swatch.name}
                  />
                  {/* Tooltip */}
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <span className="font-body text-xs text-bark whitespace-nowrap bg-white/90 px-2 py-1 rounded shadow-sm">
                      {swatch.name}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </ArtNouveauFrame>
        </motion.div>

        {/* Divider */}
        <div className="divider-nouveau">
          <span>👗</span>
        </div>

        {/* Tips */}
        <div className="grid gap-6 sm:grid-cols-2 max-w-2xl mx-auto">
          {INSPIRATION_TIPS.map((tip, i) => (
            <motion.div
              key={tip.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
            >
              <div className="card-nouveau p-6 h-full">
                <div className="text-3xl mb-3">{tip.emoji}</div>
                <h3 className="font-heading text-lg text-ivy-dark mb-2">
                  {tip.title}
                </h3>
                <p className="font-body text-bark-light">{tip.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Placeholder inspiration gallery */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <h2 className="font-heading text-xl text-ivy-dark text-center heading-ornament mb-8">
            Inspiration Gallery
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="aspect-[3/4] rounded-lg border border-gold/20 bg-gradient-to-br from-ivory to-parchment flex items-center justify-center"
              >
                <p className="font-body text-sm text-bark-light/40 italic text-center px-4">
                  Inspiration photo {n}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
