"use client";

import { motion } from "framer-motion";

interface LeonardProps {
  size?: number;
  className?: string;
  showSpeech?: boolean;
  speechText?: string;
  animate?: boolean;
}

/**
 * Leonard — The Dignified Corgi
 * A stylised SVG corgi with bow tie, used as the site mascot.
 * Can optionally show a speech bubble and gentle floating animation.
 */
export default function Leonard({
  size = 200,
  className = "",
  showSpeech = false,
  speechText = "Have you RSVP'd yet?",
  animate = true,
}: LeonardProps) {
  const wrapper = animate ? motion.div : "div";
  const WrapperComponent = wrapper as React.ElementType;

  return (
    <WrapperComponent
      className={`relative inline-block ${className}`}
      {...(animate
        ? {
            animate: { y: [0, -6, 0] },
            transition: { repeat: Infinity, duration: 4, ease: "easeInOut" },
          }
        : {})}
    >
      {/* Speech Bubble */}
      {showSpeech && (
        <motion.div
          className="absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap z-10"
          initial={{ opacity: 0, y: 8, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="relative bg-white border border-gold px-4 py-2 rounded-lg shadow-md">
            <p className="font-heading text-sm text-ivy-dark">{speechText}</p>
            {/* Bubble arrow */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-gold rotate-45" />
          </div>
        </motion.div>
      )}

      {/* Leonard SVG */}
      <svg
        width={size}
        height={size * 0.85}
        viewBox="0 0 240 204"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Leonard the corgi"
      >
        {/* === Body === */}
        <ellipse cx="120" cy="148" rx="72" ry="36" fill="#E8A838" />
        <ellipse cx="120" cy="145" rx="68" ry="32" fill="#F0BC5E" />
        {/* Belly stripe */}
        <ellipse cx="120" cy="155" rx="50" ry="18" fill="#FFF5E0" />

        {/* === Legs (front) === */}
        <rect x="72" y="160" width="18" height="32" rx="9" fill="#E8A838" />
        <rect x="150" y="160" width="18" height="32" rx="9" fill="#E8A838" />
        {/* Paws */}
        <ellipse cx="81" cy="193" rx="11" ry="6" fill="#FFF5E0" />
        <ellipse cx="159" cy="193" rx="11" ry="6" fill="#FFF5E0" />

        {/* === Legs (back) === */}
        <rect x="56" y="162" width="16" height="28" rx="8" fill="#D49520" />
        <rect x="168" y="162" width="16" height="28" rx="8" fill="#D49520" />
        <ellipse cx="64" cy="191" rx="10" ry="5" fill="#F5E6C8" />
        <ellipse cx="176" cy="191" rx="10" ry="5" fill="#F5E6C8" />

        {/* === Tail (fluffy nub) === */}
        <ellipse cx="192" cy="130" rx="14" ry="10" fill="#E8A838" transform="rotate(-20 192 130)" />
        <ellipse cx="194" cy="128" rx="10" ry="7" fill="#F0BC5E" transform="rotate(-20 194 128)" />

        {/* === Head === */}
        <ellipse cx="120" cy="90" rx="44" ry="40" fill="#E8A838" />
        <ellipse cx="120" cy="88" rx="40" ry="36" fill="#F0BC5E" />

        {/* Face markings */}
        <path
          d="M100 85 C108 100, 132 100, 140 85 L135 95 C128 105, 112 105, 105 95 Z"
          fill="#FFF5E0"
          opacity="0.8"
        />

        {/* === Ears (large, erect, corgi-style) === */}
        {/* Left ear */}
        <path
          d="M82 80 C78 45, 88 25, 100 20 C105 30, 100 55, 95 75 Z"
          fill="#E8A838"
        />
        <path
          d="M86 75 C83 50, 91 32, 100 28 C103 36, 99 55, 96 72 Z"
          fill="#F7C97B"
        />
        <path
          d="M88 70 C86 55, 92 40, 99 35 C101 42, 98 55, 96 68 Z"
          fill="#FFD6A0"
          opacity="0.5"
        />

        {/* Right ear */}
        <path
          d="M158 80 C162 45, 152 25, 140 20 C135 30, 140 55, 145 75 Z"
          fill="#E8A838"
        />
        <path
          d="M154 75 C157 50, 149 32, 140 28 C137 36, 141 55, 144 72 Z"
          fill="#F7C97B"
        />
        <path
          d="M152 70 C154 55, 148 40, 141 35 C139 42, 142 55, 144 68 Z"
          fill="#FFD6A0"
          opacity="0.5"
        />

        {/* === Eyes (dignified, slightly narrowed) === */}
        {/* Left eye */}
        <ellipse cx="105" cy="82" rx="7" ry="8" fill="#2C1810" />
        <ellipse cx="105" cy="82" rx="5" ry="6" fill="#3D2317" />
        <circle cx="103" cy="80" r="2" fill="white" opacity="0.8" />
        {/* Right eye */}
        <ellipse cx="135" cy="82" rx="7" ry="8" fill="#2C1810" />
        <ellipse cx="135" cy="82" rx="5" ry="6" fill="#3D2317" />
        <circle cx="133" cy="80" r="2" fill="white" opacity="0.8" />

        {/* Eyebrows (slightly raised — distinguished) */}
        <path d="M96 72 C100 69, 108 69, 112 72" stroke="#D49520" strokeWidth="1.5" fill="none" />
        <path d="M128 72 C132 69, 140 69, 144 72" stroke="#D49520" strokeWidth="1.5" fill="none" />

        {/* === Nose === */}
        <ellipse cx="120" cy="97" rx="8" ry="5" fill="#2C1810" />
        <ellipse cx="118" cy="96" rx="2" ry="1.5" fill="#4A3628" opacity="0.6" />

        {/* === Mouth (slight dignified smile) === */}
        <path
          d="M112 102 C116 106, 124 106, 128 102"
          stroke="#2C1810"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* === Bow Tie === */}
        <g transform="translate(120, 125)">
          {/* Left wing */}
          <path
            d="M0 0 L-16 -8 L-16 8 Z"
            fill="#722F37"
          />
          <path
            d="M0 0 L-14 -6 L-14 6 Z"
            fill="#8B3A44"
          />
          {/* Right wing */}
          <path
            d="M0 0 L16 -8 L16 8 Z"
            fill="#722F37"
          />
          <path
            d="M0 0 L14 -6 L14 6 Z"
            fill="#8B3A44"
          />
          {/* Center knot */}
          <circle cx="0" cy="0" r="4" fill="#5A1F27" />
          <circle cx="0" cy="0" r="2.5" fill="#722F37" />
        </g>

        {/* === Subtle gold collar === */}
        <path
          d="M88 120 C95 128, 145 128, 152 120"
          stroke="#C9A84C"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="120" cy="125" r="0" fill="#C9A84C" />
      </svg>
    </WrapperComponent>
  );
}
