"use client";

import { ReactNode } from "react";

interface ArtNouveauFrameProps {
  children: ReactNode;
  className?: string;
  variant?: "full" | "top" | "simple";
}

/**
 * Art Nouveau ornamental frame with flowing vine corners.
 */
export default function ArtNouveauFrame({
  children,
  className = "",
  variant = "full",
}: ArtNouveauFrameProps) {
  if (variant === "simple") {
    return (
      <div className={`frame-nouveau ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Corner ornaments */}
      {(variant === "full" || variant === "top") && (
        <>
          <Corner className="absolute -top-3 -left-3" />
          <Corner className="absolute -top-3 -right-3 -scale-x-100" />
        </>
      )}
      {variant === "full" && (
        <>
          <Corner className="absolute -bottom-3 -left-3 -scale-y-100" />
          <Corner className="absolute -bottom-3 -right-3 -scale-x-100 -scale-y-100" />
        </>
      )}

      {/* Border lines */}
      <div className="border border-gold/40 rounded-sm p-px">
        <div className="border border-gold/20 rounded-sm p-6 sm:p-8 md:p-10">
          {children}
        </div>
      </div>
    </div>
  );
}

function Corner({ className }: { className?: string }) {
  return (
    <svg
      className={`${className} z-10`}
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
    >
      <path
        d="M4 44 C4 24, 12 12, 24 6 C30 4, 36 4, 44 6"
        stroke="#C9A84C"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M8 44 C10 28, 16 16, 28 10 C34 8, 40 8, 44 10"
        stroke="#C9A84C"
        strokeWidth="0.8"
        fill="none"
        opacity="0.5"
      />
      <circle cx="24" cy="6" r="2" fill="#C9A84C" opacity="0.7" />
      <circle cx="44" cy="6" r="1.5" fill="#C9A84C" opacity="0.5" />
      <path
        d="M24 6 C22 4, 20 3, 22 2 C24 1, 26 3, 24 6Z"
        fill="#C9A84C"
        opacity="0.4"
      />
    </svg>
  );
}
