"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

/* ── Ornamental SVG Corner ─────────────────────────────── */
function ArtNouveauCorner({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 115 C5 60, 15 30, 40 15 C50 10, 65 8, 80 10 C70 12, 55 18, 45 30 C30 50, 20 75, 18 115"
        stroke="#C9A84C"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M10 115 C12 70, 20 40, 50 20 C60 14, 75 12, 90 15 C78 16, 62 24, 52 38 C38 58, 28 82, 25 115"
        stroke="#C9A84C"
        strokeWidth="1"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M40 15 C42 12, 46 8, 50 6 C48 10, 44 14, 40 15Z"
        fill="#C9A84C"
        opacity="0.7"
      />
      <path
        d="M80 10 C84 8, 88 7, 92 8 C88 10, 84 11, 80 10Z"
        fill="#C9A84C"
        opacity="0.5"
      />
      <circle cx="50" cy="6" r="2" fill="#C9A84C" opacity="0.6" />
      <circle cx="92" cy="8" r="1.5" fill="#C9A84C" opacity="0.4" />
      <path
        d="M45 30 C43 28, 40 25, 38 28 C36 31, 40 33, 45 30Z"
        fill="#C9A84C"
        opacity="0.3"
      />
    </svg>
  );
}

/* ── Decorative Vine Divider ───────────────────────────── */
function VineDivider() {
  return (
    <svg
      width="280"
      height="30"
      viewBox="0 0 280 30"
      fill="none"
      className="mx-auto my-6"
    >
      <path
        d="M0 15 C40 15, 60 5, 100 5 C120 5, 125 15, 140 15 C155 15, 160 5, 180 5 C220 5, 240 15, 280 15"
        stroke="#C9A84C"
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M0 15 C40 15, 60 25, 100 25 C120 25, 125 15, 140 15 C155 15, 160 25, 180 25 C220 25, 240 15, 280 15"
        stroke="#C9A84C"
        strokeWidth="1"
        fill="none"
        opacity="0.5"
      />
      <circle cx="140" cy="15" r="3" fill="#C9A84C" />
      <circle cx="100" cy="5" r="1.5" fill="#C9A84C" opacity="0.6" />
      <circle cx="180" cy="5" r="1.5" fill="#C9A84C" opacity="0.6" />
    </svg>
  );
}

/* ── Main Splash Page ──────────────────────────────────── */
export default function SplashPage() {
  const [isExiting, setIsExiting] = useState(false);
  const router = useRouter();

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(() => router.push("/tldr"), 800);
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className="splash-bg flex items-center justify-center min-h-screen p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Invitation Frame */}
          <motion.div
            className="relative max-w-xl w-full mx-auto"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          >
            {/* Outer gold border */}
            <div className="relative border-2 border-gold p-1">
              <div className="border border-gold-light p-8 sm:p-12 md:p-16 text-center relative">
                {/* Corner ornaments */}
                <ArtNouveauCorner className="absolute top-2 left-2 opacity-70" />
                <ArtNouveauCorner className="absolute top-2 right-2 opacity-70 -scale-x-100" />
                <ArtNouveauCorner className="absolute bottom-2 left-2 opacity-70 -scale-y-100" />
                <ArtNouveauCorner className="absolute bottom-2 right-2 opacity-70 -scale-x-100 -scale-y-100" />

                {/* Content */}
                <motion.p
                  className="font-heading text-sm tracking-[0.3em] uppercase text-gold-dark mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                >
                  Together with their families
                </motion.p>

                <VineDivider />

                <motion.h1
                  className="font-display text-4xl sm:text-5xl md:text-6xl text-gold-gradient leading-tight mb-2"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0, duration: 1.0 }}
                >
                  Adam
                </motion.h1>

                <motion.p
                  className="font-display text-2xl text-gold my-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3, duration: 0.8 }}
                >
                  &amp;
                </motion.p>

                <motion.h1
                  className="font-display text-4xl sm:text-5xl md:text-6xl text-gold-gradient leading-tight mb-6"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5, duration: 1.0 }}
                >
                  Mady
                </motion.h1>

                <VineDivider />

                <motion.p
                  className="font-heading text-sm tracking-[0.25em] uppercase text-ivy-dark mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.8, duration: 0.8 }}
                >
                  Request the pleasure of your company
                </motion.p>

                <motion.p
                  className="font-heading text-sm tracking-[0.15em] text-bark-light mb-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.0, duration: 0.8 }}
                >
                  on the occasion of their marriage
                </motion.p>

                <motion.div
                  className="my-8"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.2, duration: 0.8 }}
                >
                  <p className="font-display text-2xl sm:text-3xl text-ivy-dark mb-1">
                    July 10th, 2027
                  </p>
                  <p className="font-heading text-lg text-gold-dark tracking-wide">
                    Tall Johns House
                  </p>
                </motion.div>

                <VineDivider />

                {/* Enter Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.6, duration: 0.8 }}
                  className="mt-8"
                >
                  <button
                    onClick={handleEnter}
                    className="btn-nouveau group"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      <span>Enter Here</span>
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.5,
                          ease: "easeInOut",
                        }}
                      >
                        →
                      </motion.span>
                    </span>
                  </button>
                </motion.div>

                {/* Small Leonard Teaser */}
                <motion.p
                  className="mt-6 text-sm text-gold opacity-60 font-body italic"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: 3.2, duration: 1.0 }}
                >
                  🐾 Leonard is waiting for you inside
                </motion.p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Exit overlay */}
      {isExiting && (
        <motion.div
          className="fixed inset-0 bg-ivory z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        />
      )}
    </AnimatePresence>
  );
}
