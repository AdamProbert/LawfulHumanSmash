"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import BookChapter from "@/components/BookChapter";
import BookPage from "@/components/BookPage";

/** Doors open. Everything on this page hangs off it. */
const WEDDING_DAY = new Date(2027, 6, 10); // 10 July 2027, local time

type Slot = {
  /** Minutes past midnight, driving the "now" marker on the day itself. */
  at: number;
  time: string;
  title: string;
  /** Acts get billed large; interstitials sit quietly between them. */
  kind: "act" | "interstitial";
  /** Where the row sits in the day→night wash. */
  tone: "day" | "dusk" | "night";
  billing?: string;
  description: string;
};

const SET_LIST: Slot[] = [
  {
    at: 12 * 60 + 30,
    time: "12:30",
    title: "Doors",
    kind: "interstitial",
    tone: "day",
    description: "Roll up, say hello, grab a drink and find a spot.",
  },
  {
    at: 13 * 60 + 30,
    time: "1:30",
    title: "The Ceremony",
    kind: "act",
    tone: "day",
    billing: "The main event",
    description: "Seats please.",
  },
  {
    at: 14 * 60,
    time: "2:00",
    title: "Chill time",
    kind: "interstitial",
    tone: "day",
    description: "Drinks, games and pictures out on the grounds.",
  },
  {
    at: 15 * 60 + 30,
    time: "3:30",
    title: "Lunch & speeches",
    kind: "interstitial",
    tone: "day",
    description: "Food, toasts, and a few words from the usual suspects.",
  },
  {
    at: 18 * 60,
    time: "6:00",
    title: "Oceanview",
    kind: "act",
    tone: "dusk",
    billing: "Set one",
    description: "Settle back in, the first band takes over.",
  },
  {
    at: 19 * 60 + 30,
    time: "7:30",
    title: "First dance",
    kind: "interstitial",
    tone: "dusk",
    description: "Ours. Then the floor is all yours.",
  },
  {
    at: 19 * 60 + 40,
    time: "7:40",
    title: "Oceanview",
    kind: "act",
    tone: "dusk",
    billing: "Set two",
    description: "And it gets loud.",
  },
  {
    at: 20 * 60 + 30,
    time: "8:30",
    title: "Pizzas",
    kind: "interstitial",
    tone: "night",
    description: "Late-night slices to keep you going.",
  },
  {
    at: 21 * 60,
    time: "9:00",
    title: "Democracy Manifest",
    kind: "act",
    tone: "night",
    billing: "Headline",
    description: "Two sets across two hours. Bring your rocking shoes!",
  },
  {
    at: 23 * 60,
    time: "11:00",
    title: "Home time",
    kind: "interstitial",
    tone: "night",
    description: "Last orders and off you go.",
  },
];

/** Whole days from today until the wedding; 0 on the day, negative after. */
function daysUntilWedding(now: Date) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((WEDDING_DAY.getTime() - today.getTime()) / 86_400_000);
}

/** Index of the slot currently under way; only meaningful on the day. */
function currentSlot(now: Date) {
  if (daysUntilWedding(now) !== 0) return -1;
  const mins = now.getHours() * 60 + now.getMinutes();
  let idx = -1;
  SET_LIST.forEach((slot, i) => {
    if (mins >= slot.at) idx = i;
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

  // Resolved after mount so the server and client don't disagree on "now".
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const daysToGo = now ? daysUntilWedding(now) : null;
  const nowIndex = now ? currentSlot(now) : -1;

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
            {SET_LIST.map((slot, idx) => (
              <motion.li
                key={slot.time}
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
