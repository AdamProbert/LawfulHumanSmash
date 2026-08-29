"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import BookChapter from "@/components/BookChapter";
import BookPage from "@/components/BookPage";
import { DEFAULT_SET_LIST, type ItinerarySlot } from "@/lib/itinerary";

/** Stand-in until /api/itinerary answers, and the fallback if it never does. */
const FALLBACK_SLOTS: ItinerarySlot[] = DEFAULT_SET_LIST.map((slot, i) => ({
  ...slot,
  id: `default-${i}`,
}));

/** Doors open. Everything on this page hangs off it. */
const WEDDING_DAY = new Date(2027, 6, 10); // 10 July 2027, local time

/** Whole days from today until the wedding; 0 on the day, negative after. */
function daysUntilWedding(now: Date) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((WEDDING_DAY.getTime() - today.getTime()) / 86_400_000);
}

/** Index of the slot currently under way; only meaningful on the day. */
function currentSlot(now: Date, slots: ItinerarySlot[]) {
  if (daysUntilWedding(now) !== 0) return -1;
  const mins = now.getHours() * 60 + now.getMinutes();
  let idx = -1;
  slots.forEach((slot, i) => {
    if (mins >= slot.atMinutes) idx = i;
  });
  return idx;
}

/** How far above the first row the wash starts, in px. */
const WASH_LEAD = 20;

/**
 * The day→night wash. It has to render on `.book` rather than inside the page,
 * because `.book-stage` clips its children and the wash needs to run the full
 * width of the page, under the vine border. A scroll listener keeps it aligned
 * with the set list. Remove this component to drop the day/night effect.
 */
function DayNightWash({ anchorRef }: { anchorRef: React.RefObject<HTMLElement> }) {
  const [book, setBook] = useState<HTMLElement | null>(null);
  const washRef = useRef<HTMLDivElement>(null);

  useEffect(() => setBook(document.querySelector<HTMLElement>(".book")), []);

  useEffect(() => {
    if (!book) return;
    const scroller = document.querySelector<HTMLElement>(".book-scroll");
    const stage = document.querySelector<HTMLElement>(".book-stage");

    const sync = () => {
      const list = anchorRef.current;
      const wash = washRef.current;
      if (!list || !wash || !scroller || !stage) return;
      // Offsets, not getBoundingClientRect: the chapter plays a scaleY entrance
      // animation, and a measurement taken mid-animation reads a squashed box
      // and leaves the wash stuck as a thin band across the page.
      const top = stage.offsetTop + list.offsetTop - scroller.scrollTop - WASH_LEAD;
      wash.style.top = `${top}px`;
      // Run to the foot of the page so the night never fades back out.
      wash.style.height = `${Math.max(book.offsetHeight - top, 0)}px`;
      wash.style.setProperty("--wash-fade", `${list.offsetHeight + WASH_LEAD}px`);
    };

    sync();
    scroller?.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    // The rows fade in on scroll, so the list's height settles after mount.
    const observer = new ResizeObserver(sync);
    if (anchorRef.current) observer.observe(anchorRef.current);

    return () => {
      scroller?.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
      observer.disconnect();
    };
  }, [book, anchorRef]);

  if (!book) return null;
  return createPortal(
    <div ref={washRef} className="setlist-wash" aria-hidden />,
    book
  );
}

export default function ItineraryPage() {
  const listRef = useRef<HTMLDivElement>(null);

  // Editable from /secretgarden, so the running order is fetched rather than
  // compiled in. The built-in list shows until the fetch lands, and stays put
  // if it fails, so the page is never blank.
  const [slots, setSlots] = useState<ItinerarySlot[]>(FALLBACK_SLOTS);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/itinerary");
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && Array.isArray(data.slots) && data.slots.length) {
          setSlots(data.slots);
        }
      } catch {
        // Keep the fallback running order.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Resolved after mount so the server and client don't disagree on "now".
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const daysToGo = now ? daysUntilWedding(now) : null;
  const nowIndex = now ? currentSlot(now, slots) : -1;

  return (
    <BookChapter title="Itinerary">
      <BookPage>
        <DayNightWash anchorRef={listRef} />

        {daysToGo !== null && daysToGo > 0 && (
          <div className="setlist-countdown font-body mb-3">
            <strong>{daysToGo}</strong>
            <span>{daysToGo === 1 ? "day to go" : "days to go"}</span>
          </div>
        )}

        <div ref={listRef} className="setlist max-w-sm mx-auto text-left">
          <ol className="setlist-rows font-body">
            {slots.map((slot, idx) => (
              <motion.li
                key={slot.id}
                className="setlist-row"
                data-kind={slot.kind}
                data-tone={slot.tone}
                data-now={idx === nowIndex ? "true" : undefined}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -12% 0px" }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                <div className="setlist-time">{slot.time}</div>
                <div>
                  <h3
                    className={
                      slot.kind === "act" ? "setlist-act" : "setlist-slot"
                    }
                  >
                    {slot.title}
                    {idx === nowIndex && (
                      <span className="setlist-nowtag">Now</span>
                    )}
                  </h3>
                  <p className="setlist-note">{slot.description}</p>
                  {slot.billing && (
                    <span className="setlist-billing">{slot.billing}</span>
                  )}
                </div>
              </motion.li>
            ))}
          </ol>
        </div>

        <p className="setlist-footnote font-body max-w-xs mx-auto mt-10">
          Roughly, anyway. All subject to change as the day runs away with us.
        </p>
      </BookPage>
    </BookChapter>
  );
}
