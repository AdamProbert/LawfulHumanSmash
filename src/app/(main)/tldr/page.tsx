"use client";

import Link from "next/link";
import Leonard from "@/components/Leonard";
import BookChapter from "@/components/BookChapter";
import BookPage from "@/components/BookPage";

export default function TLDRPage() {
  return (
    <BookChapter>
      {/* Page 1 — the essentials */}
      <BookPage>
        <h1 className="font-display text-3xl sm:text-4xl text-gold-gradient mb-1">
          Important Details
        </h1>
        <p className="font-heading text-sm text-bark-light mb-6">
          Everything you need to know
        </p>

        <div className="space-y-3">
          <div>
            <p className="font-heading text-xs tracking-[0.2em] uppercase text-gold-dark mb-1">
              When
            </p>
            <p className="font-heading text-xl text-accent-burgundy">
              July 10th, 2027
            </p>
          </div>

          <div className="divider-nouveau !my-2">
            <span>✦</span>
          </div>

          <div>
            <p className="font-heading text-xs tracking-[0.2em] uppercase text-gold-dark mb-1">
              Where
            </p>
            <p className="font-heading text-xl text-accent-burgundy">
              Tall Johns House
            </p>
            <a
              href="https://www.talljohnshouse.com/"
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
            <p className="font-heading text-xs tracking-[0.2em] uppercase text-gold-dark mb-1">
              Dress Code
            </p>
            <p className="font-heading text-xl text-accent-burgundy">COLOURFUL</p>
          </div>

          <div className="divider-nouveau !my-2">
            <span>✦</span>
          </div>

          <div>
            <p className="font-heading text-xs tracking-[0.2em] uppercase text-gold-dark mb-1">
              RSVP By
            </p>
            <p className="font-heading text-xl text-accent-burgundy">
              January 1st, 2027
            </p>
          </div>
        </div>
      </BookPage>

      {/* Page 2 — Leonard's nudge */}
      <BookPage>
        <p className="font-display text-2xl text-gold-gradient mb-4">
          Don&apos;t be shy…
        </p>
        <Link href="/rsvp" className="group cursor-pointer inline-block">
          <Leonard
            size={150}
            showSpeech
            speechText="Don't forget to RSVP! 🐾"
            animate
          />
        </Link>
        <div className="mt-6">
          <Link href="/rsvp" className="btn-nouveau">
            RSVP Now
          </Link>
        </div>
      </BookPage>
    </BookChapter>
  );
}
