"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const SEEN_KEY = "lhs.swipeHintSeen";

/**
 * One-time nudge teaching the page-turn gesture.
 *
 * Only touch visitors see it — a mouse and keyboard have the chapter strip and
 * the arrow keys, so the word "swipe" would just be wrong there. It marks
 * itself seen as soon as it appears rather than when it fades, so a visitor who
 * navigates away mid-hint is not shown it again.
 */
export default function SwipeHint() {
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();
  const startPath = useRef(pathname);

  // The moment they turn a page — by swipe, arrow or dot — the hint has done
  // its job, and carrying it over onto the next chapter would just read as a
  // sticky bit of furniture. This layout outlives the route change, so the
  // component is still here to notice.
  useEffect(() => {
    if (pathname !== startPath.current) setVisible(false);
  }, [pathname]);

  useEffect(() => {
    // Any of these can throw or come back empty (private windows, cleared site
    // data); in every one of those cases the safe answer is to stay quiet.
    let seen = true;
    try {
      seen = window.localStorage.getItem(SEEN_KEY) === "1";
    } catch {
      return;
    }

    const touch = window.matchMedia?.("(pointer: coarse)").matches;
    if (seen || !touch) return;

    try {
      window.localStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* Showing it once per visit beats never showing it at all. */
    }

    setVisible(true);
    const t = window.setTimeout(() => setVisible(false), 4500);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="swipe-hint"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <motion.span
            aria-hidden
            className="swipe-hint-chevrons"
            /* Drifts the way a forward swipe goes, demonstrating the gesture */
            animate={reduceMotion ? undefined : { x: [0, -7, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            ‹ ›
          </motion.span>
          <span>Swipe to turn the page</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
