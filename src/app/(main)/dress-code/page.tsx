"use client";

import { motion } from "framer-motion";
import ArtNouveauFrame from "@/components/ArtNouveauFrame";

/* Wedding palette — leafy green & terracotta led, with warm tertiaries */
const COLOUR_SWATCHES = [
  { name: "Leaf Green",     color: "#3E5E34", textColor: "white" },
  { name: "Deep Forest",    color: "#263A1E", textColor: "white" },
  { name: "Olive",          color: "#5F7E3F", textColor: "white" },
  { name: "Sage",           color: "#7E9C57", textColor: "#283121" },
  { name: "Terracotta",     color: "#C4552B", textColor: "white" },
  { name: "Burnt Rust",     color: "#9C3D1C", textColor: "white" },
  { name: "Ochre",          color: "#C08A2E", textColor: "#283121" },
  { name: "Mustard",        color: "#DDA22B", textColor: "#283121" },
  { name: "Amber",          color: "#B87333", textColor: "white" },
  { name: "Chestnut",       color: "#6B4A2B", textColor: "white" },
  { name: "Cocoa",          color: "#4E3520", textColor: "white" },
  { name: "Burgundy",       color: "#7A2E3A", textColor: "white" },
  { name: "Garnet",         color: "#9B2335", textColor: "white" },
];

const INSPIRATION_TIPS = [
  {
    emoji: "🌿",
    title: "Green Leads the Way",
    text: "Our primary colour is a dark, leafy green — think forest, olive & sage. Lead with it and you can't go wrong.",
  },
  {
    emoji: "🏺",
    title: "A Terracotta Warmth",
    text: "Pair the greens with a saturated terracotta — that earthy rust is the heart of our palette.",
  },
  {
    emoji: "🎨",
    title: "Warm It Up",
    text: "Layer in the supporting tones — chestnut browns, mustard yellows and deep burgundy all sit beautifully together.",
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
            Colourful
          </motion.p>
          <p className="font-heading text-lg text-bark-light max-w-xl mx-auto">
            We want a sea of colour! Think leafy greens & warm terracotta, with browns, mustards & burgundy to finish.
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
