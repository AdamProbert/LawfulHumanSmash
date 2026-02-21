"use client";

import { ReactNode } from "react";

const STROKE = "#7A5B30";
const STROKE_LIGHT = "#96743A";

interface ArtNouveauFrameProps {
  children: ReactNode;
  className?: string;
  variant?: "full" | "top" | "simple";
}

/**
 * Art Nouveau ornamental frame with flowing botanical vines,
 * drooping bell flowers, and scrollwork — inspired by the wedding invite.
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
      {/* ── Top center fan/palmette ornament ── */}
      {(variant === "full" || variant === "top") && (
        <TopOrnament className="absolute -top-8 left-1/2 -translate-x-1/2 z-10" />
      )}

      {/* ── Corner vines ── */}
      {(variant === "full" || variant === "top") && (
        <>
          <CornerVine className="absolute -top-6 -left-6 z-10" />
          <CornerVine className="absolute -top-6 -right-6 z-10 -scale-x-100" />
        </>
      )}
      {variant === "full" && (
        <>
          <CornerVine className="absolute -bottom-6 -left-6 z-10 -scale-y-100" />
          <CornerVine className="absolute -bottom-6 -right-6 z-10 -scale-x-100 -scale-y-100" />
        </>
      )}

      {/* ── Bottom scrollwork ── */}
      {variant === "full" && (
        <BottomScroll className="absolute -bottom-5 left-1/2 -translate-x-1/2 z-10" />
      )}

      {/* Border lines */}
      <div className="border border-gold/40 rounded-sm p-px">
        <div className="border border-gold/20 rounded-sm p-8 sm:p-10 md:p-12">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Top center ornament — fan/palmette with scrollwork
 * Inspired by the shell motif at the top of the invite
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function TopOrnament({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="160"
      height="48"
      viewBox="0 0 160 48"
      fill="none"
    >
      {/* Central fan/shell */}
      <path
        d="M80 42 C80 28, 68 14, 56 8 C64 6, 72 2, 80 2 C88 2, 96 6, 104 8 C92 14, 80 28, 80 42Z"
        stroke={STROKE}
        strokeWidth="1.2"
        fill="none"
      />
      {/* Inner fan ribs */}
      <path d="M80 40 C78 28, 70 16, 62 10" stroke={STROKE_LIGHT} strokeWidth="0.7" fill="none" opacity="0.6" />
      <path d="M80 40 C82 28, 90 16, 98 10" stroke={STROKE_LIGHT} strokeWidth="0.7" fill="none" opacity="0.6" />
      <path d="M80 38 C76 26, 66 14, 58 10" stroke={STROKE_LIGHT} strokeWidth="0.5" fill="none" opacity="0.4" />
      <path d="M80 38 C84 26, 94 14, 102 10" stroke={STROKE_LIGHT} strokeWidth="0.5" fill="none" opacity="0.4" />
      {/* Center petal drop */}
      <path d="M80 2 C78 6, 78 10, 80 12 C82 10, 82 6, 80 2Z" fill={STROKE} opacity="0.5" />

      {/* Left scroll */}
      <path
        d="M56 8 C48 10, 36 14, 28 20 C22 24, 18 30, 20 36 C22 32, 26 26, 34 22 C40 18, 48 14, 56 12"
        stroke={STROKE}
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M20 36 C18 38, 16 42, 18 44 C20 42, 22 40, 20 36Z"
        fill={STROKE}
        opacity="0.5"
      />
      {/* Left scroll tendril */}
      <path d="M28 20 C24 18, 18 18, 14 22" stroke={STROKE_LIGHT} strokeWidth="0.6" fill="none" opacity="0.5" />

      {/* Right scroll (mirrored) */}
      <path
        d="M104 8 C112 10, 124 14, 132 20 C138 24, 142 30, 140 36 C138 32, 134 26, 126 22 C120 18, 112 14, 104 12"
        stroke={STROKE}
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M140 36 C142 38, 144 42, 142 44 C140 42, 138 40, 140 36Z"
        fill={STROKE}
        opacity="0.5"
      />
      {/* Right scroll tendril */}
      <path d="M132 20 C136 18, 142 18, 146 22" stroke={STROKE_LIGHT} strokeWidth="0.6" fill="none" opacity="0.5" />
    </svg>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Corner vine — flowing vine with drooping bell flowers
 * and large curving leaves, like the invite's wisteria corners
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function CornerVine({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="130"
      height="150"
      viewBox="0 0 130 150"
      fill="none"
    >
      {/* ── Main vine stem ── */}
      <path
        d="M8 148 C8 120, 10 90, 18 65 C24 45, 36 30, 55 20 C68 14, 85 10, 105 8 C115 7, 125 8, 128 10"
        stroke={STROKE}
        strokeWidth="1.4"
        fill="none"
      />
      {/* Secondary thinner vine */}
      <path
        d="M14 148 C16 125, 18 100, 25 78 C30 62, 40 46, 56 35 C68 28, 82 22, 100 18"
        stroke={STROKE_LIGHT}
        strokeWidth="0.8"
        fill="none"
        opacity="0.5"
      />

      {/* ── Large leaf 1 (top, curving right) ── */}
      <path
        d="M55 20 C60 12, 72 6, 82 4 C76 8, 68 14, 58 22"
        stroke={STROKE}
        strokeWidth="1.2"
        fill="none"
      />
      <path
        d="M55 20 C58 10, 68 4, 82 4 C72 6, 62 14, 55 20Z"
        fill={STROKE}
        opacity="0.08"
      />
      {/* Leaf vein */}
      <path d="M58 18 C62 12, 70 8, 76 6" stroke={STROKE_LIGHT} strokeWidth="0.5" fill="none" opacity="0.4" />

      {/* ── Large leaf 2 (mid-left, curving left) ── */}
      <path
        d="M22 60 C10 52, 4 40, 6 28 C8 36, 14 46, 24 56"
        stroke={STROKE}
        strokeWidth="1.2"
        fill="none"
      />
      <path
        d="M22 60 C12 50, 4 40, 6 28 C8 38, 16 50, 22 60Z"
        fill={STROKE}
        opacity="0.08"
      />
      {/* Leaf vein */}
      <path d="M20 56 C14 48, 8 40, 8 32" stroke={STROKE_LIGHT} strokeWidth="0.5" fill="none" opacity="0.4" />

      {/* ── Large leaf 3 (upper-mid) ── */}
      <path
        d="M38 38 C30 28, 28 16, 34 8 C36 16, 38 26, 42 34"
        stroke={STROKE}
        strokeWidth="1.1"
        fill="none"
      />
      <path
        d="M38 38 C30 28, 28 16, 34 8 C36 18, 40 30, 38 38Z"
        fill={STROKE}
        opacity="0.06"
      />

      {/* ── Large leaf 4 (mid, swooping right) ── */}
      <path
        d="M42 48 C52 38, 68 32, 84 30 C70 36, 56 42, 46 50"
        stroke={STROKE}
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M42 48 C54 38, 68 32, 84 30 C68 38, 52 46, 42 48Z"
        fill={STROKE}
        opacity="0.06"
      />

      {/* ── Drooping bell flower cluster 1 ── */}
      {/* Stem */}
      <path d="M50 24 C54 32, 52 42, 48 50" stroke={STROKE} strokeWidth="0.7" fill="none" />
      {/* Bell flower 1 */}
      <path
        d="M48 50 C44 52, 42 56, 44 60 C46 58, 50 56, 52 54 C50 52, 48 50, 48 50Z"
        stroke={STROKE}
        strokeWidth="0.8"
        fill="none"
      />
      {/* Bell flower 2 */}
      <path d="M52 42 C56 44, 58 48, 56 52 C54 50, 52 46, 50 44" stroke={STROKE} strokeWidth="0.7" fill="none" />
      {/* Small bud */}
      <path d="M46 46 C44 48, 42 52, 44 54" stroke={STROKE_LIGHT} strokeWidth="0.6" fill="none" opacity="0.6" />

      {/* ── Drooping bell flower cluster 2 ── */}
      {/* Stem */}
      <path d="M80 14 C84 24, 82 38, 76 48" stroke={STROKE} strokeWidth="0.7" fill="none" />
      {/* Bell flower */}
      <path
        d="M76 48 C72 50, 70 56, 72 60 C74 58, 78 54, 80 52 C78 50, 76 48, 76 48Z"
        stroke={STROKE}
        strokeWidth="0.8"
        fill="none"
      />
      {/* Bell flower 2 */}
      <path
        d="M80 40 C84 42, 86 46, 84 50 C82 48, 80 44, 78 42"
        stroke={STROKE}
        strokeWidth="0.7"
        fill="none"
      />
      {/* Small hanging bud */}
      <path d="M82 34 C86 36, 88 40, 86 44" stroke={STROKE_LIGHT} strokeWidth="0.5" fill="none" opacity="0.5" />
      <path d="M86 44 C84 46, 86 48, 88 46" stroke={STROKE_LIGHT} strokeWidth="0.5" fill="none" opacity="0.5" />

      {/* ── Drooping bell flower cluster 3 (lower) ── */}
      <path d="M26 72 C30 82, 28 94, 24 104" stroke={STROKE} strokeWidth="0.6" fill="none" />
      <path
        d="M24 104 C20 106, 18 110, 20 114 C22 112, 26 108, 28 106"
        stroke={STROKE}
        strokeWidth="0.7"
        fill="none"
      />
      <path d="M28 90 C32 92, 34 96, 32 100" stroke={STROKE_LIGHT} strokeWidth="0.5" fill="none" opacity="0.6" />
      <path d="M32 100 C30 102, 32 104, 34 102" stroke={STROKE_LIGHT} strokeWidth="0.5" fill="none" opacity="0.5" />

      {/* ── Small leaf 5 (lower vine) ── */}
      <path
        d="M18 90 C10 84, 6 74, 10 66 C12 72, 16 82, 20 88"
        stroke={STROKE}
        strokeWidth="0.9"
        fill="none"
      />
      <path
        d="M18 90 C10 84, 6 74, 10 66 C12 74, 18 84, 18 90Z"
        fill={STROKE}
        opacity="0.05"
      />

      {/* ── Curling tendrils ── */}
      <path
        d="M105 8 C112 4, 118 4, 122 8 C118 6, 114 8, 112 12"
        stroke={STROKE_LIGHT}
        strokeWidth="0.6"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M34 8 C30 4, 26 6, 28 10 C30 8, 32 6, 34 8"
        stroke={STROKE_LIGHT}
        strokeWidth="0.5"
        fill="none"
        opacity="0.4"
      />
      <path
        d="M6 28 C2 24, 2 20, 6 18 C4 22, 6 26, 6 28"
        stroke={STROKE_LIGHT}
        strokeWidth="0.5"
        fill="none"
        opacity="0.4"
      />
    </svg>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Bottom scrollwork — ornate curling scrolls
 * Inspired by the bottom flourishes of the invite
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function BottomScroll({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="200"
      height="40"
      viewBox="0 0 200 40"
      fill="none"
    >
      {/* Center knot */}
      <circle cx="100" cy="16" r="3" stroke={STROKE} strokeWidth="1" fill="none" />
      <circle cx="100" cy="16" r="1.2" fill={STROKE} opacity="0.4" />

      {/* Left scroll */}
      <path
        d="M97 16 C85 14, 70 10, 58 14 C48 18, 42 26, 36 32 C34 28, 38 20, 46 16 C54 12, 66 10, 78 12"
        stroke={STROKE}
        strokeWidth="1.1"
        fill="none"
      />
      {/* Left inner scroll curl */}
      <path
        d="M36 32 C32 36, 28 38, 24 36 C26 34, 30 34, 36 32"
        stroke={STROKE}
        strokeWidth="0.8"
        fill="none"
      />
      {/* Left outer tendril */}
      <path
        d="M46 16 C38 12, 28 12, 20 16 C14 20, 12 26, 14 32 C16 28, 18 22, 24 18 C30 14, 38 14, 46 16"
        stroke={STROKE_LIGHT}
        strokeWidth="0.6"
        fill="none"
        opacity="0.5"
      />
      {/* Left small leaf */}
      <path d="M58 14 C54 8, 48 6, 44 8 C48 10, 54 12, 58 14Z" fill={STROKE} opacity="0.1" />
      <path d="M58 14 C54 8, 48 6, 44 8" stroke={STROKE_LIGHT} strokeWidth="0.5" fill="none" opacity="0.4" />

      {/* Right scroll (mirrored) */}
      <path
        d="M103 16 C115 14, 130 10, 142 14 C152 18, 158 26, 164 32 C166 28, 162 20, 154 16 C146 12, 134 10, 122 12"
        stroke={STROKE}
        strokeWidth="1.1"
        fill="none"
      />
      {/* Right inner scroll curl */}
      <path
        d="M164 32 C168 36, 172 38, 176 36 C174 34, 170 34, 164 32"
        stroke={STROKE}
        strokeWidth="0.8"
        fill="none"
      />
      {/* Right outer tendril */}
      <path
        d="M154 16 C162 12, 172 12, 180 16 C186 20, 188 26, 186 32 C184 28, 182 22, 176 18 C170 14, 162 14, 154 16"
        stroke={STROKE_LIGHT}
        strokeWidth="0.6"
        fill="none"
        opacity="0.5"
      />
      {/* Right small leaf */}
      <path d="M142 14 C146 8, 152 6, 156 8 C152 10, 146 12, 142 14Z" fill={STROKE} opacity="0.1" />
      <path d="M142 14 C146 8, 152 6, 156 8" stroke={STROKE_LIGHT} strokeWidth="0.5" fill="none" opacity="0.4" />

      {/* Small hanging bell buds from center */}
      <path d="M96 18 C94 22, 92 28, 94 32" stroke={STROKE_LIGHT} strokeWidth="0.5" fill="none" opacity="0.5" />
      <path d="M94 32 C92 34, 94 36, 96 34" stroke={STROKE_LIGHT} strokeWidth="0.5" fill="none" opacity="0.5" />
      <path d="M104 18 C106 22, 108 28, 106 32" stroke={STROKE_LIGHT} strokeWidth="0.5" fill="none" opacity="0.5" />
      <path d="M106 32 C108 34, 106 36, 104 34" stroke={STROKE_LIGHT} strokeWidth="0.5" fill="none" opacity="0.5" />
      <path d="M100 19 C100 26, 100 32, 100 36" stroke={STROKE_LIGHT} strokeWidth="0.4" fill="none" opacity="0.4" />
      <path d="M100 36 C98 38, 100 40, 102 38" stroke={STROKE_LIGHT} strokeWidth="0.4" fill="none" opacity="0.4" />
    </svg>
  );
}
