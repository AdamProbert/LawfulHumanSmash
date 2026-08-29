"use client";

import {
  Children,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { CHAPTERS } from "@/lib/chapters";
import {
  clearNavDirection,
  getNavDirection,
  setNavDirection,
} from "@/lib/navDirection";

/** How far a finger must travel before the release turns the page. */
const COMMIT_DISTANCE = 68;
/** A quick flick turns the page from much less distance. */
const FLICK_DISTANCE = 24;
/** px per ms; roughly a deliberate flick rather than a slow drag. */
const FLICK_VELOCITY = 0.45;
/** Movement before the gesture decides it is a page turn or a scroll. */
const AXIS_LOCK = 7;

/**
 * Stacks its <BookPage> children in a single vertically-scrolling column.
 * A horizontal trackpad swipe, touch swipe, the on-screen arrows or the
 * left/right keyboard arrows move to the neighbouring chapter; vertical
 * scrolling is left untouched for reading the current chapter's content.
 *
 * A touch drag is followed live: the chapter travels with the finger, dims as
 * it goes and names the chapter it is heading for, so the gesture is visibly
 * understood before it is finished. Releasing short of the commit distance
 * springs it back.
 */
export default function BookChapter({
  title,
  footnote,
  children,
}: {
  title?: React.ReactNode;
  /** Small note pinned to the foot of the chapter, above the chapter strip. */
  footnote?: React.ReactNode;
  children: ReactNode;
}) {
  const pages = Children.toArray(children);
  const router = useRouter();
  const pathname = usePathname();
  const cooldown = useRef(false);
  const touchStart = useRef<{ x: number; y: number; t: number } | null>(null);
  /** null until the first few pixels say which way this gesture is going. */
  const axis = useRef<"x" | "y" | null>(null);

  const chapterIndex = CHAPTERS.findIndex((c) => c.href === pathname);
  const nextChapter = CHAPTERS[chapterIndex + 1];
  const prevChapter = CHAPTERS[chapterIndex - 1];

  // Read once, during the first render, so the entry animation below knows
  // which way this chapter was turned to. Deliberately not state: it must not
  // change after mount, or the page would re-animate mid-read.
  const [enterFrom] = useState(getNavDirection);
  const reduceMotion = useReducedMotion();

  // How far the chapter is currently dragged. Everything the gesture shows -
  // the travel, the dimming, the neighbour's name - is derived from this one
  // value, so it all tracks the finger on the same frame.
  const x = useMotionValue(0);
  const dragOpacity = useTransform(x, [-170, 0, 170], [0.5, 1, 0.5]);
  // The neighbour's name fades up as the drag approaches the commit distance,
  // reaching full strength just as a release would turn the page.
  const nextPeek = useTransform(x, [-COMMIT_DISTANCE, -18], [1, 0]);
  const prevPeek = useTransform(x, [18, COMMIT_DISTANCE], [0, 1]);

  // A browser back/forward leaves whatever the last tap set behind. Clearing it
  // on the way past means the chapter it lands on gets the neutral reveal
  // rather than a slide pointing the wrong way.
  useEffect(() => {
    const onPop = () => clearNavDirection();
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Nothing here uses <Link>, so the neighbours are not prefetched for us.
  // Warming them on mount means the turn lands on an already-built page
  // rather than pausing mid-gesture to fetch one.
  useEffect(() => {
    if (nextChapter) router.prefetch(nextChapter.href);
    if (prevChapter) router.prefetch(prevChapter.href);
  }, [router, nextChapter, prevChapter]);

  const goChapter = useCallback(
    (delta: number) => {
      if (cooldown.current) return;
      const neighbour =
        delta > 0 ? CHAPTERS[chapterIndex + 1] : CHAPTERS[chapterIndex - 1];
      if (!neighbour) return;
      cooldown.current = true;
      setNavDirection(delta > 0 ? 1 : -1);
      router.push(neighbour.href);
      window.setTimeout(() => (cooldown.current = false), 480);
    },
    [chapterIndex, router]
  );

  // Horizontal trackpad swipe turns the chapter; vertical wheel just scrolls.
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) < 24 || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      goChapter(e.deltaX > 0 ? 1 : -1);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [goChapter]);

  // Left/right keyboard arrows turn the chapter; up/down scroll normally.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goChapter(1);
      if (e.key === "ArrowLeft") goChapter(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goChapter]);

  const settle = useCallback(
    () =>
      animate(x, 0, { type: "spring", stiffness: 460, damping: 38, mass: 0.7 }),
    [x]
  );

  const onTouchStart = (e: React.TouchEvent) => {
    if (!reduceMotion) x.stop();
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      t: e.timeStamp,
    };
    axis.current = null;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const start = touchStart.current;
    if (!start || reduceMotion) return;
    const dx = e.touches[0].clientX - start.x;
    const dy = e.touches[0].clientY - start.y;

    if (!axis.current) {
      if (Math.abs(dx) < AXIS_LOCK && Math.abs(dy) < AXIS_LOCK) return;
      // Once a gesture is reading as a scroll it stays one for its lifetime,
      // so a wobbly vertical drag never nudges the chapter sideways.
      axis.current = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    }
    if (axis.current === "y") return;

    // The last chapter in either direction still moves, but heavily damped:
    // enough to answer the finger, clearly not enough to be going anywhere.
    const hasNeighbour = dx < 0 ? !!nextChapter : !!prevChapter;
    x.set(hasNeighbour ? dx : dx / 4);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const dx = e.changedTouches[0].clientX - start.x;
    const dy = e.changedTouches[0].clientY - start.y;
    // With motion off there is no live drag to have locked an axis, so the
    // old end-of-gesture comparison is still what decides.
    const horizontal = reduceMotion
      ? Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > COMMIT_DISTANCE
      : axis.current === "x";
    axis.current = null;
    if (!horizontal) return;

    const velocity = Math.abs(dx) / Math.max(e.timeStamp - start.t, 1);
    const turning =
      Math.abs(dx) > COMMIT_DISTANCE ||
      (Math.abs(dx) > FLICK_DISTANCE && velocity > FLICK_VELOCITY);
    const delta = dx < 0 ? 1 : -1;
    const neighbour = delta > 0 ? nextChapter : prevChapter;

    if (turning && neighbour) {
      // Carry the page the rest of the way out under the finger's momentum;
      // the incoming chapter slides in from the same side to meet it.
      if (!reduceMotion) {
        animate(x, delta > 0 ? -220 : 220, { duration: 0.18, ease: "easeIn" });
      }
      goChapter(delta);
      return;
    }
    if (!reduceMotion) settle();
  };

  return (
    <motion.div
      className={`book-chapter ${title ? "book-chapter--titled" : ""} ${
        footnote ? "book-chapter--footnoted" : ""
      }`}
      /* Turned to from a neighbour: slide in from the side it came from, so
         the gesture and the movement agree. Landed on cold: the original
         opening-the-book reveal. */
      initial={
        reduceMotion
          ? { opacity: 0 }
          : enterFrom === 0
          ? { opacity: 0, scaleY: 0, originY: 0 }
          : { opacity: 0, x: enterFrom > 0 ? 46 : -46 }
      }
      animate={{ opacity: 1, scaleY: 1, x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={() => {
        touchStart.current = null;
        axis.current = null;
        if (!reduceMotion) settle();
      }}
    >
      {/* Named neighbours, revealed by the drag itself rather than by a timer */}
      {nextChapter && (
        <motion.div
          aria-hidden
          className="chapter-peek chapter-peek--next"
          style={{ opacity: nextPeek }}
        >
          {nextChapter.label}
        </motion.div>
      )}
      {prevChapter && (
        <motion.div
          aria-hidden
          className="chapter-peek chapter-peek--prev"
          style={{ opacity: prevPeek }}
        >
          {prevChapter.label}
        </motion.div>
      )}

      {/* Only this layer follows the finger, so the peeks above stay put */}
      <motion.div className="book-swipe-layer" style={{ x, opacity: dragOpacity }}>
        {title && (
          <div className="book-title">
            <h1 className="font-display text-3xl sm:text-4xl text-gold-gradient">
              {title}
            </h1>
          </div>
        )}

        <div className="book-scroll">
          {pages.map((p, i) => (
            <div key={i}>{p}</div>
          ))}
        </div>

        {footnote && <div className="book-footnote">{footnote}</div>}
      </motion.div>
    </motion.div>
  );
}
