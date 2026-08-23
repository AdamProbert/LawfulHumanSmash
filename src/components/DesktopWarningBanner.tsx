"use client";

import { useState } from "react";

/** Nudges desktop visitors towards mobile, where the book UI is designed to live. */
export default function DesktopWarningBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="desktop-warning hidden lg:flex">
      <p>
        This site is built for mobile — grab your phone for the full
        experience 📱
      </p>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}
