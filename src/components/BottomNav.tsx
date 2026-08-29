"use client";

import { usePathname, useRouter } from "next/navigation";
import { CHAPTERS } from "@/lib/chapters";
import { setNavDirection } from "@/lib/navDirection";

/**
 * Foot of the book: the previous and next chapter by name, with a dot for
 * every chapter in between.
 *
 * The dots carry the two things the old scrolling strip of labels could not:
 * how many chapters there are, and which one you are on, while the flanking
 * names make turning a page something you can see and tap, not just a gesture
 * you have to guess at.
 */
export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const index = CHAPTERS.findIndex((c) => c.href === pathname);
  const prev = index > 0 ? CHAPTERS[index - 1] : null;
  const next = index >= 0 && index < CHAPTERS.length - 1 ? CHAPTERS[index + 1] : null;

  /** Every route change here is deliberate, so it always carries a direction. */
  const go = (href: string, delta: number) => {
    setNavDirection(delta);
    router.push(href);
  };

  return (
    <nav className="bottom-nav" aria-label="Chapters">
      <div className="bottom-nav-inner">
        {/* Both edges are always rendered so the dots stay centred at the ends */}
        <button
          type="button"
          className="bottom-nav-step bottom-nav-step--prev"
          onClick={() => prev && go(prev.href, -1)}
          disabled={!prev}
          aria-label={prev ? `Previous chapter: ${prev.label}` : undefined}
        >
          {prev && (
            <>
              <span aria-hidden>‹</span>
              <span className="bottom-nav-step-label">{prev.label}</span>
            </>
          )}
        </button>

        <ol className="bottom-nav-dots">
          {CHAPTERS.map((c, i) => (
            <li key={c.href}>
              <button
                type="button"
                className={`bottom-nav-dot ${i === index ? "active" : ""}`}
                onClick={() => i !== index && go(c.href, i > index ? 1 : -1)}
                aria-label={c.label}
                aria-current={i === index ? "page" : undefined}
                title={c.label}
              />
            </li>
          ))}
        </ol>

        <button
          type="button"
          className="bottom-nav-step bottom-nav-step--next"
          onClick={() => next && go(next.href, 1)}
          disabled={!next}
          aria-label={next ? `Next chapter: ${next.label}` : undefined}
        >
          {next && (
            <>
              <span className="bottom-nav-step-label">{next.label}</span>
              <span aria-hidden>›</span>
            </>
          )}
        </button>
      </div>
    </nav>
  );
}
