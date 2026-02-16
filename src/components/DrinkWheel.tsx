"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

interface DrinkVoteData {
  id: string;
  name: string;
  emoji: string;
  color: string;
  _count: { votes: number };
}

interface DrinkWheelProps {
  drinks: DrinkVoteData[];
  size?: number;
}

/**
 * Animated pie-chart / wheel showing live drink vote distribution.
 * Uses CSS conic-gradient for the segments.
 */
export default function DrinkWheel({ drinks, size = 320 }: DrinkWheelProps) {
  const totalVotes = useMemo(
    () => drinks.reduce((sum, d) => sum + d._count.votes, 0),
    [drinks]
  );

  const segments = useMemo(() => {
    if (totalVotes === 0) return [];

    let currentAngle = 0;
    return drinks
      .filter((d) => d._count.votes > 0)
      .sort((a, b) => b._count.votes - a._count.votes)
      .map((drink) => {
        const percentage = (drink._count.votes / totalVotes) * 100;
        const startAngle = currentAngle;
        const endAngle = currentAngle + (percentage / 100) * 360;
        currentAngle = endAngle;
        return {
          ...drink,
          percentage,
          startAngle,
          endAngle,
        };
      });
  }, [drinks, totalVotes]);

  const conicGradient = useMemo(() => {
    if (segments.length === 0) return "conic-gradient(#E8D5A0 0deg, #E8D5A0 360deg)";

    const stops = segments
      .map(
        (seg) =>
          `${seg.color} ${seg.startAngle}deg ${seg.endAngle}deg`
      )
      .join(", ");

    return `conic-gradient(${stops})`;
  }, [segments]);

  return (
    <div className="flex flex-col items-center gap-8">
      {/* The Wheel */}
      <motion.div
        className="drink-wheel relative"
        style={{
          width: size,
          height: size,
          background: conicGradient,
        }}
        initial={{ rotate: -90, scale: 0.8, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        {/* Center label */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center"
          style={{ width: size * 0.35, height: size * 0.35 }}
        >
          <div className="flex flex-col items-center justify-center h-full">
            <span className="text-2xl">🍸</span>
            <span className="font-heading text-xs text-bark-light mt-1">
              {totalVotes} vote{totalVotes !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Legend */}
      <div className="w-full max-w-md">
        <div className="grid grid-cols-2 gap-2">
          {segments.map((seg, i) => (
            <motion.div
              key={seg.id}
              className="flex items-center gap-2 py-1.5 px-3 rounded-lg hover:bg-white/60 transition-colors"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + i * 0.05 }}
            >
              <div
                className="w-4 h-4 rounded-full flex-shrink-0 border border-white/50"
                style={{ backgroundColor: seg.color }}
              />
              <span className="font-body text-sm text-bark truncate">
                {seg.emoji} {seg.name}
              </span>
              <span className="font-heading text-xs text-bark-light ml-auto">
                {Math.round(seg.percentage)}%
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {totalVotes === 0 && (
        <p className="font-body text-bark-light text-center italic">
          No votes yet — be the first to vote via the RSVP page!
        </p>
      )}
    </div>
  );
}
