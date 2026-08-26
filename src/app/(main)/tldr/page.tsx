"use client";

import BookChapter from "@/components/BookChapter";
import BookPage from "@/components/BookPage";

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
          </div>

          <div className="divider-nouveau !my-2">
            <span>✦</span>
          </div>

          <div>
            <p className="font-body text-xs tracking-[0.2em] uppercase text-gold-dark mb-1">
              Where
            </p>
            <p className="font-body text-xl text-accent-burgundy">
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
            <p className="font-body text-xs tracking-[0.2em] uppercase text-gold-dark mb-1">
              Dress Code
            </p>
            <p className="font-body text-xl text-accent-burgundy">COLOURFUL</p>
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
