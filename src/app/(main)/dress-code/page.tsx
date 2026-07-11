"use client";

import BookChapter from "@/components/BookChapter";
import BookPage from "@/components/BookPage";

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
    <BookChapter>
      {/* Page 1 — palette */}
      <BookPage>
        <h1 className="font-display text-3xl sm:text-4xl text-gold-gradient mb-1">
          Dress Code
        </h1>
        <p className="font-heading text-2xl text-ivy-dark mb-2">Colourful</p>
        <p className="font-body text-sm text-bark-light max-w-xs mx-auto mb-6">
          A sea of colour! Leafy greens &amp; warm terracotta, with browns,
          mustards &amp; burgundy to finish.
        </p>

        <div className="flex flex-wrap justify-center gap-3 max-w-xs mx-auto">
          {COLOUR_SWATCHES.map((swatch) => (
            <div key={swatch.name} className="group relative">
              <div
                className="swatch w-12 h-12 sm:w-14 sm:h-14"
                style={{ backgroundColor: swatch.color }}
                title={swatch.name}
              />
              <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <span className="font-body text-xs text-bark whitespace-nowrap bg-white/90 px-2 py-1 rounded shadow-sm">
                  {swatch.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </BookPage>

      {/* Page 2 — styling tips */}
      <BookPage>
        <h2 className="font-heading text-2xl text-ivy-dark mb-5">
          Styling Tips
        </h2>
        <div className="grid gap-3 max-w-xs mx-auto text-left">
          {INSPIRATION_TIPS.map((tip) => (
            <div key={tip.title} className="card-nouveau p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{tip.emoji}</span>
                <h3 className="font-heading text-base text-ivy-dark">
                  {tip.title}
                </h3>
              </div>
              <p className="font-body text-sm text-bark-light">{tip.text}</p>
            </div>
          ))}
        </div>
      </BookPage>

      {/* Page 3 — inspiration gallery */}
      <BookPage>
        <h2 className="font-heading text-2xl text-ivy-dark heading-ornament mb-6">
          Inspiration Gallery
        </h2>
        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="aspect-[3/4] rounded-lg border border-gold/20 bg-gradient-to-br from-ivory to-parchment flex items-center justify-center"
            >
              <p className="font-body text-xs text-bark-light/40 italic text-center px-1">
                Photo {n}
              </p>
            </div>
          ))}
        </div>
      </BookPage>
    </BookChapter>
  );
}
