"use client";

import { useEffect, useRef, useState } from "react";

const DIGITS = 4;
/** How fast the unsettled digits churn. */
const SPIN_TICK_MS = 70;
/** Gap between one digit landing and the next. */
const REVEAL_STEP_MS = 190;
/**
 * Spin for at least this long before landing. A fast server would otherwise
 * resolve the code in ~40ms and the reel would just flicker once, which reads
 * as a glitch rather than as the code being drawn.
 */
const MIN_SPIN_MS = 520;

const randomDigit = () => String(Math.floor(Math.random() * 10));

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * The party code as a slot-machine reel.
 *
 * Digits churn while the server is drawing a code (`code` is null), then land
 * one at a time from the left. Once settled it is an ordinary text box: the
 * code can be typed over to match an invitation that was printed first.
 *
 * The settled value is owned by the parent, because it is submitted with the
 * rest of the party rather than saved on its own.
 */
export default function CodeReel({
  code,
  value,
  onChange,
  disabled,
}: {
  /** The drawn code, or null while the server is still drawing one. */
  code: string | null;
  /** Current contents of the box once the reel has landed. */
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const [reel, setReel] = useState<string[]>(() =>
    Array.from({ length: DIGITS }, randomDigit)
  );
  const [revealed, setRevealed] = useState(0);
  /** When the current spin began, so MIN_SPIN_MS can be honoured. */
  const spinStartedAt = useRef<number>(Date.now());

  // A new spin: reset and start the clock.
  useEffect(() => {
    if (code === null) {
      setRevealed(0);
      spinStartedAt.current = Date.now();
    }
  }, [code]);

  // Churn every digit that has not landed yet.
  useEffect(() => {
    if (revealed >= DIGITS) return;

    const id = window.setInterval(() => {
      setReel((prev) =>
        prev.map((digit, i) => (i < revealed ? digit : randomDigit()))
      );
    }, SPIN_TICK_MS);

    return () => window.clearInterval(id);
  }, [revealed]);

  // Land the digits once the code arrives.
  useEffect(() => {
    if (code === null || revealed >= DIGITS) return;

    if (prefersReducedMotion()) {
      setReel(code.split(""));
      setRevealed(DIGITS);
      return;
    }

    // Hold the reel spinning until it has run long enough to be seen.
    const elapsed = Date.now() - spinStartedAt.current;
    const delay =
      revealed === 0 ? Math.max(MIN_SPIN_MS - elapsed, 0) : REVEAL_STEP_MS;

    const id = window.setTimeout(() => {
      setReel((prev) =>
        prev.map((digit, i) => (i <= revealed ? code[i] : digit))
      );
      setRevealed((n) => n + 1);
    }, delay);

    return () => window.clearTimeout(id);
  }, [code, revealed]);

  const settled = code !== null && revealed >= DIGITS;

  if (settled) {
    return (
      <input
        className="admin-input admin-code-input"
        maxLength={4}
        value={value}
        disabled={disabled}
        aria-label="Party code"
        inputMode="numeric"
        onFocus={(e) => e.target.select()}
        onChange={(e) =>
          onChange(e.target.value.replace(/\D/g, "").slice(0, 4))
        }
      />
    );
  }

  return (
    <div
      className="admin-code-reel"
      role="status"
      aria-label={code === null ? "Drawing a code" : `Code ${code}`}
    >
      {reel.map((digit, i) => (
        <span
          key={i}
          className="admin-code-digit"
          data-landed={i < revealed ? "true" : undefined}
          // The churn is decoration; the label above carries the meaning.
          aria-hidden
        >
          {digit}
        </span>
      ))}
    </div>
  );
}
