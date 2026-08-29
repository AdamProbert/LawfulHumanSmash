"use client";

import { Children, ReactNode, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { CHAPTERS } from "@/lib/chapters";

/**
 * Stacks its <BookPage> children in a single vertically-scrolling column.
 * A horizontal trackpad swipe, touch swipe, the on-screen arrows or the
 * left/right keyboard arrows move to the neighbouring chapter — vertical
 * scrolling is left untouched for reading the current chapter's content.
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
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const chapterIndex = CHAPTERS.findIndex((c) => c.href === pathname);

  const goChapter = useCallback(
    (delta: number) => {
      if (cooldown.current) return;
      const neighbour =
        delta > 0 ? CHAPTERS[chapterIndex + 1] : CHAPTERS[chapterIndex - 1];
      if (!neighbour) return;
      cooldown.current = true;
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

  return (
    <motion.div
      className={`book-chapter ${title ? "book-chapter--titled" : ""} ${
        footnote ? "book-chapter--footnoted" : ""
      }`}
      initial={{ opacity: 0, scaleY: 0, originY: 0 }}
      animate={{ opacity: 1, scaleY: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
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
        if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) {
          goChapter(dx < 0 ? 1 : -1);
        }
        touchStart.current = null;
      }}
    >
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
  );
}

