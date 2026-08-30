"use client";

import BookChapter from "@/components/BookChapter";
import BookPage from "@/components/BookPage";

// Cycled across the letters of "COLOURFUL" so the dress code shows rather
// than tells. Nine entries: one per letter.
const DRESS_CODE_COLOURS = [
  "text-accent-red",
  "text-accent-orange",
  "text-accent-yellow",
  "text-leaf",
  "text-ivy",
  "text-accent-burgundy",
  "text-terracotta",
  "text-gold",
  "text-ivy-light",
];

export default function TLDRPage() {
  return (
    <BookChapter title="Important Details">
      <BookPage>
        <p className="font-body text-sm text-bark-light mb-5">
          Everything you need to know
        </p>

        <div className="space-y-3">
          <div>
            <p className="font-body text-xs tracking-[0.2em] uppercase text-gold-dark mb-1">
              When
            </p>
            <p className="font-body text-xl text-accent-burgundy">
              July 10th, 2027
            </p>
            <p className="font-body text-sm text-bark-light mt-1">
              Doors open 12:30
            </p>
          </div>

          <div className="divider-nouveau !my-2">
            <span>✦</span>
          </div>

          <div>
            <p className="font-body text-xs tracking-[0.2em] uppercase text-gold-dark mb-1">
              Where
            </p>
            <p className="font-body text-xl text-accent-burgundy">
              Tall John's House
            </p>
            <a
              href="https://www.tallJohn'shouse.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-1 font-body text-sm text-gold-dark hover:text-gold transition-colors underline underline-offset-4 decoration-gold/30"
            >
              Visit the venue →
            </a>
          </div>

          <div className="divider-nouveau !my-2">
            <span>✦</span>
          </div>

          <div>
            <p className="font-body text-xs tracking-[0.2em] uppercase text-gold-dark mb-1">
              Dress Code
            </p>
            {/* One letter per colour: the dress code demonstrating itself. */}
            <p
              className="font-body text-xl tracking-[0.08em]"
              aria-label="Colourful"
            >
              {"COLOURFUL".split("").map((letter, i) => (
                <span key={i} className={DRESS_CODE_COLOURS[i]} aria-hidden>
                  {letter}
                </span>
              ))}
            </p>
            <p className="font-body text-sm text-bark-light mt-2 leading-relaxed">
              No need to be suited and booted, wear whatever makes you feel
              brilliant. Bright, bold, clashing, patterned: all welcome. Have some fun with it!
            </p>
          </div>

          <div className="divider-nouveau !my-2">
            <span>✦</span>
          </div>

          <div>
            <p className="font-body text-xs tracking-[0.2em] uppercase text-gold-dark mb-1">
              RSVP By
            </p>
            <p className="font-body text-xl text-accent-burgundy">
              January 1st, 2027
            </p>
          </div>
        </div>
      </BookPage>
    </BookChapter>
  );
}
