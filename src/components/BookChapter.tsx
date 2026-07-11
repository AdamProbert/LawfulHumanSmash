"use client";

import {
  Children,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { CHAPTERS } from "@/lib/chapters";

/**
 * Turns its <BookPage> children into a horizontally-flipping "chapter".
 * Flip with the scroll wheel, a touch swipe, the on-screen arrows or the
 * keyboard. Flipping past the last/first page turns to the neighbouring
 * chapter — like reading through a book.
 */
export default function BookChapter({ children }: { children: ReactNode }) {
  const pages = Children.toArray(children);
  const count = pages.length;

  const [[page, direction], setPage] = useState<[number, number]>([0, 0]);
  const router = useRouter();
  const pathname = usePathname();
  const cooldown = useRef(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const chapterIndex = CHAPTERS.findIndex((c) => c.href === pathname);

  const go = useCallback(
    (delta: number) => {
      if (cooldown.current) return;
      const next = page + delta;

      if (next >= 0 && next < count) {
        cooldown.current = true;
        setPage([next, delta]);
        window.setTimeout(() => (cooldown.current = false), 480);
        return;
      }

      // Past the end / start of this chapter → turn to the neighbour.
      const neighbour =
        delta > 0 ? CHAPTERS[chapterIndex + 1] : CHAPTERS[chapterIndex - 1];
      if (neighbour) {
        cooldown.current = true;
        router.push(neighbour.href);
      }
    },
    [page, count, chapterIndex, router]
  );

  // Scroll wheel / trackpad
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const magnitude = Math.max(Math.abs(e.deltaY), Math.abs(e.deltaX));
      if (magnitude < 12) return;
      e.preventDefault();
      go(e.deltaY + e.deltaX > 0 ? 1 : -1);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [go]);

  // Keyboard arrows
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") go(1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const variants = {
    enter: (d: number) => ({ x: d >= 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d >= 0 ? "-100%" : "100%", opacity: 0 }),
  };

  const atFirst = page === 0 && chapterIndex <= 0;
  const atLast = page === count - 1 && chapterIndex >= CHAPTERS.length - 1;

  return (
    <div
      className="book-chapter"
      onTouchStart={(e) =>
        (touchStart.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        })
      }
      onTouchEnd={(e) => {
        if (!touchStart.current) return;
        const dx = e.changedTouches[0].clientX - touchStart.current.x;
        const dy = e.changedTouches[0].clientY - touchStart.current.y;
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
          go(dx < 0 ? 1 : -1);
        }
        touchStart.current = null;
      }}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          className="book-page-wrap"
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 320, damping: 34 },
            opacity: { duration: 0.25 },
          }}
        >
          {pages[page]}
        </motion.div>
      </AnimatePresence>

      {/* Page-turn arrows */}
      <button
        type="button"
        className="book-arrow book-arrow-left"
        onClick={() => go(-1)}
        aria-label="Previous page"
        disabled={atFirst}
      >
        ‹
      </button>
      <button
        type="button"
        className="book-arrow book-arrow-right"
        onClick={() => go(1)}
        aria-label="Next page"
        disabled={atLast}
      >
        ›
      </button>

      {/* Page indicator (only for multi-page chapters) */}
      {count > 1 && (
        <div className="book-dots" aria-hidden>
          {pages.map((_, i) => (
            <span
              key={i}
              className={`book-dot ${i === page ? "active" : ""}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
