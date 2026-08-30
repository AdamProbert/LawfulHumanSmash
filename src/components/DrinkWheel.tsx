"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
} from "react";
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

function textColorForBackground(hex: string) {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 150 ? "var(--bark)" : "var(--ivory)";
}

function pointOnCircle(angle: number, radius: number) {
  const radians = (angle * Math.PI) / 180;
  return {
    x: 50 + radius * Math.sin(radians),
    y: 50 - radius * Math.cos(radians),
  };
}

function pieSlicePath(startAngle: number, endAngle: number, radius = 42) {
  const start = pointOnCircle(startAngle, radius);
  const end = pointOnCircle(endAngle, radius);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  return [
    "M 50 50",
    `L ${start.x.toFixed(3)} ${start.y.toFixed(3)}`,
    `A ${radius} ${radius} 0 ${largeArc} 1 ${end.x.toFixed(3)} ${end.y.toFixed(3)}`,
    "Z",
  ].join(" ");
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

/**
 * Animated pie-chart / wheel showing live drink vote distribution.
 * Uses SVG paths so the selected segment can lift out of the pie.
 */
export default function DrinkWheel({ drinks, size = 320 }: DrinkWheelProps) {
  const [rotation, setRotation] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const rotationRef = useRef(0);
  const velocityRef = useRef(0);
  const frameRef = useRef<number | null>(null);
  const lastFrameAt = useRef<number | null>(null);
  const tickStepRef = useRef(0);
  const suppressClickRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const dragRef = useRef<{
    active: boolean;
    moved: boolean;
    lastAngle: number;
    lastAt: number;
  } | null>(null);
  const timers = useRef<number[]>([]);

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

  const selectedSegment = useMemo(
    () => segments.find((seg) => seg.id === selectedId) || segments[0],
    [segments, selectedId]
  );

  const keyRows = useMemo(
    () =>
      drinks.map((drink) => ({
        ...drink,
        percentage: totalVotes ? (drink._count.votes / totalVotes) * 100 : 0,
      })),
    [drinks, totalVotes]
  );

  useEffect(() => {
    if (!selectedId && segments[0]) setSelectedId(segments[0].id);
  }, [segments, selectedId]);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
      audioContextRef.current?.close();
      timers.current.forEach(window.clearTimeout);
      timers.current = [];
    };
  }, []);

  const audioContext = () => {
    type WebkitAudioWindow = typeof window & {
      webkitAudioContext?: typeof window.AudioContext;
    };
    const AudioCtx =
      window.AudioContext ||
      (window as WebkitAudioWindow).webkitAudioContext;
    if (!AudioCtx) return null;

    if (!audioContextRef.current) audioContextRef.current = new AudioCtx();
    return audioContextRef.current;
  };

  const playRatchetClick = () => {
    const context = audioContext();
    if (!context) return;
    const oscillator = context.createOscillator();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    oscillator.frequency.value = 135;
    oscillator.type = "sawtooth";
    filter.type = "bandpass";
    filter.frequency.value = 1850;
    filter.Q.value = 6;
    gain.gain.setValueAtTime(0.035, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.022);
    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.024);

  };

  const playPop = () => {
    const context = audioContext();
    if (!context) return;
    const oscillator = context.createOscillator();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(980, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      620,
      context.currentTime + 0.09
    );
    filter.type = "bandpass";
    filter.frequency.value = 1150;
    filter.Q.value = 3.5;
    gain.gain.setValueAtTime(0.065, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.13);

    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.14);
  };

  const selectedSegmentForRotation = (value: number) => {
    const pointerAngle = (45 - (((value % 360) + 360) % 360) + 360) % 360;
    return segments.find(
      (segment) =>
        pointerAngle >= segment.startAngle && pointerAngle < segment.endAngle
    );
  };

  const updateRotation = (nextRotation: number) => {
    const previousStep = tickStepRef.current;
    const nextStep = Math.floor(nextRotation / 45);
    const crossed = Math.abs(nextStep - previousStep);
    if (crossed > 0) {
      for (let i = 0; i < Math.min(crossed, 8); i += 1) playRatchetClick();
      tickStepRef.current = nextStep;
    }

    rotationRef.current = nextRotation;
    setRotation(nextRotation);
  };

  const finishSpin = () => {
    frameRef.current = null;
    lastFrameAt.current = null;
    velocityRef.current = 0;
    setIsSpinning(false);

    const landed = selectedSegmentForRotation(rotationRef.current);
    if (landed) setSelectedId(landed.id);
    playPop();
  };

  const animateMomentum = (at: number) => {
    if (lastFrameAt.current === null) lastFrameAt.current = at;
    const elapsed = Math.min(at - lastFrameAt.current, 40);
    lastFrameAt.current = at;

    const nextRotation = rotationRef.current + velocityRef.current * elapsed;
    updateRotation(nextRotation);

    velocityRef.current *= Math.pow(0.993, elapsed);
    if (Math.abs(velocityRef.current) < 0.012) {
      finishSpin();
      return;
    }

    frameRef.current = window.requestAnimationFrame(animateMomentum);
  };

  const startMomentum = (velocity: number) => {
    if (segments.length === 0) return;
    velocityRef.current = Math.max(-11, Math.min(11, velocity));
    setIsSpinning(true);
    if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    lastFrameAt.current = null;
    frameRef.current = window.requestAnimationFrame(animateMomentum);
  };

  const pointerAngleForEvent = (
    event: PointerEvent<HTMLButtonElement>
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    return (Math.atan2(x, -y) * 180) / Math.PI;
  };

  const spinWheel = () => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    const direction = velocityRef.current < -0.01 ? -1 : 1;
    const base = Math.abs(velocityRef.current);
    startMomentum(direction * Math.min(base + randomBetween(6.5, 8.8), 11));
  };

  const glideToSegment = (target: (typeof segments)[number]) => {
    const targetMidpoint = (target.startAngle + target.endAngle) / 2;
    const currentAngle = ((rotationRef.current % 360) + 360) % 360;
    const targetAdjustment =
      (45 - ((currentAngle + targetMidpoint) % 360) + 360) % 360;
    const startRotation = rotationRef.current;
    const targetRotation = startRotation + 1080 + targetAdjustment;
    const startedAt = performance.now();
    const duration = 1300;

    if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    setIsSpinning(true);
    lastFrameAt.current = null;

    const glide = (at: number) => {
      const progress = Math.min((at - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      updateRotation(startRotation + (targetRotation - startRotation) * eased);

      if (progress < 1) {
        frameRef.current = window.requestAnimationFrame(glide);
        return;
      }

      frameRef.current = null;
      rotationRef.current = targetRotation;
      velocityRef.current = 0;
      setRotation(targetRotation);
      setSelectedId(target.id);
      setIsSpinning(false);
      playPop();
    };

    frameRef.current = window.requestAnimationFrame(glide);
  };

  const selectFromKey = (drinkId: string) => {
    const target = segments.find((segment) => segment.id === drinkId);
    if (target) {
      glideToSegment(target);
      return;
    }
    setSelectedId(drinkId);
  };

  return (
    <div className="drink-wheel-wrap">
      <div className="drink-wheel-stage">
        <motion.button
          type="button"
          className="drink-wheel-button"
          onClick={spinWheel}
          onPointerDown={(event) => {
            event.stopPropagation();
            if (segments.length === 0) return;
            event.currentTarget.setPointerCapture(event.pointerId);
            if (frameRef.current !== null) {
              window.cancelAnimationFrame(frameRef.current);
              frameRef.current = null;
            }
            setIsSpinning(true);
            dragRef.current = {
              active: true,
              moved: false,
              lastAngle: pointerAngleForEvent(event),
              lastAt: event.timeStamp,
            };
          }}
          onPointerMove={(event) => {
            event.stopPropagation();
            const drag = dragRef.current;
            if (!drag?.active) return;
            const angle = pointerAngleForEvent(event);
            let delta = angle - drag.lastAngle;
            if (delta > 180) delta -= 360;
            if (delta < -180) delta += 360;
            if (Math.abs(delta) > 0.5) drag.moved = true;
            const elapsed = Math.max(event.timeStamp - drag.lastAt, 1);
            velocityRef.current = delta / elapsed;
            drag.lastAngle = angle;
            drag.lastAt = event.timeStamp;
            updateRotation(rotationRef.current + delta);
          }}
          onPointerUp={(event) => {
            event.stopPropagation();
            const drag = dragRef.current;
            dragRef.current = null;
            if (!drag?.moved) return;
            suppressClickRef.current = true;
            event.preventDefault();
            startMomentum(velocityRef.current * randomBetween(19, 26));
          }}
          onPointerCancel={(event) => {
            event.stopPropagation();
            dragRef.current = null;
            startMomentum(velocityRef.current * randomBetween(12, 17));
          }}
          onTouchStart={(event) => event.stopPropagation()}
          onTouchMove={(event) => event.stopPropagation()}
          onTouchEnd={(event) => event.stopPropagation()}
          onTouchCancel={(event) => event.stopPropagation()}
          disabled={segments.length === 0}
          aria-label="Spin the drinks vote wheel"
          initial={{ rotate: -90, scale: 0.8, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          whileTap={{ scale: 0.96 }}
        >
          <motion.div
            className="drink-wheel"
            style={{
              width: size,
              height: size,
            }}
            animate={{ rotate: rotation }}
            transition={{ duration: 0 }}
          >
            <svg
              className="drink-wheel-svg"
              viewBox="0 0 100 100"
              aria-hidden="true"
            >
              {segments.length === 0 ? (
                <circle cx="50" cy="50" r="42" fill="#E8D5A0" />
              ) : (
                <>
                  {segments.map((segment) => {
                    const midpoint =
                      (segment.startAngle + segment.endAngle) / 2;
                    const selected =
                      !isSpinning && segment.id === selectedSegment?.id;
                    const offset = selected ? 6 : 0;
                    const offsetPoint = pointOnCircle(midpoint, offset);

                    return (
                      <motion.path
                        key={segment.id}
                        d={pieSlicePath(segment.startAngle, segment.endAngle)}
                        fill={segment.color}
                        stroke="var(--ivory)"
                        strokeWidth={selected ? 2.2 : 1.25}
                        transform={`translate(${(offsetPoint.x - 50).toFixed(3)} ${(offsetPoint.y - 50).toFixed(3)})`}
                        initial={false}
                        animate={{ opacity: selected ? 1 : 0.86 }}
                        transition={{ duration: 0.25 }}
                      />
                    );
                  })}

                  {!isSpinning && selectedSegment && (
                    <g
                      className="drink-wheel-segment-label"
                      transform={`translate(${(() => {
                        const midpoint =
                          (selectedSegment.startAngle +
                            selectedSegment.endAngle) /
                          2;
                        const base = pointOnCircle(midpoint, 28);
                        const offset = pointOnCircle(midpoint, 6);
                        return `${(base.x + offset.x - 50).toFixed(3)} ${(base.y + offset.y - 50).toFixed(3)}`;
                      })()}) rotate(${-rotationRef.current})`}
                    >
                      <text
                        textAnchor="middle"
                        fill={textColorForBackground(selectedSegment.color)}
                      >
                        <tspan x="0" dy="-4.2">
                          {selectedSegment.emoji}
                        </tspan>
                        <tspan x="0" dy="6.4">
                          {selectedSegment.name}
                        </tspan>
                        <tspan x="0" dy="6.4">
                          {Math.round(selectedSegment.percentage)}%
                        </tspan>
                      </text>
                    </g>
                  )}
                </>
              )}
            </svg>
          </motion.div>
        </motion.button>

        <div
          className="drink-wheel-center"
          style={{ width: size * 0.35, height: size * 0.35 }}
          aria-hidden="true"
        >
          <span>
            {totalVotes} vote{totalVotes !== 1 ? "s" : ""}
          </span>
        </div>

      </div>

      {totalVotes === 0 ? (
        <p className="font-body text-bark-light text-center italic">
          No votes yet, be the first to vote via the RSVP page!
        </p>
      ) : (
        <div className="drink-wheel-key" aria-label="Drink vote key">
          {keyRows.map((drink) => (
            <button
              type="button"
              key={drink.id}
              onClick={() => selectFromKey(drink.id)}
              className="drink-wheel-key-item"
              style={{
                backgroundColor: drink.color,
                color: textColorForBackground(drink.color),
              }}
              aria-label={`Show ${drink.name} vote details`}
            >
              <span className="drink-wheel-key-emoji" aria-hidden="true">
                {drink.emoji}
              </span>
              <span className="drink-wheel-key-name">{drink.name}</span>
              <span className="drink-wheel-key-share">
                {Math.round(drink.percentage)}%
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
