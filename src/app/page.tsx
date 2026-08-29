"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

/* ── Main Splash Page ──────────────────────────────────── */
export default function SplashPage() {
  const [isExiting, setIsExiting] = useState(false);
  const reduceMotion = useReducedMotion();
  const router = useRouter();

  const handleEnter = () => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => router.push("/tldr"), 800);
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className="splash-invite-bg flex min-h-svh flex-col items-center justify-center gap-[2vh] px-4 py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* The invite itself is the only thing to press. Overlaying a button
              on the artwork meant aligning a viewport-scaled control against an
              image-scaled slot, which no set of percentages survives across
              every aspect ratio. */}
          <motion.button
            type="button"
            onClick={handleEnter}
            aria-label="Enter the wedding website"
            className="splash-invite-card"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          >
            <Image
              src="/wedding-invite.png"
              alt="Adam & Maddison are getting married! 10-07-2027, Tall John's House"
              fill
              priority
              className="object-contain"
              sizes="(max-width: 768px) 92vw, 50vw"
            />
          </motion.button>

          <motion.p
            aria-hidden
            className="splash-tap-cue"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 1.2 }}
          >
            <motion.span
              className="splash-tap-cue-mark"
              animate={reduceMotion ? undefined : { opacity: [0.45, 1, 0.45] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            >
              ❧
            </motion.span>
            <span>Tap the invitation to enter</span>
          </motion.p>
        </motion.div>
      )}

      {/* Exit overlay */}
      {isExiting && (
        <motion.div
          className="fixed inset-0 z-50 bg-[var(--ivory)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        />
      )}
    </AnimatePresence>
  );
}
