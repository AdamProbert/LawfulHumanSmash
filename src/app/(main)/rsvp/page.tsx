"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Leonard from "@/components/Leonard";

type RSVPStep = "code" | "form" | "success";

interface GuestData {
  id: string;
  name: string;
  code: string;
}

export default function RSVPPage() {
  const [step, setStep] = useState<RSVPStep>("code");
  const [code, setCode] = useState("");
  const [guest, setGuest] = useState<GuestData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Form state
  const [attending, setAttending] = useState<boolean | null>(null);
  const [plusOneName, setPlusOneName] = useState("");
  const [dietary, setDietary] = useState("");
  const [drinkVotes, setDrinkVotes] = useState<string[]>([]);
  const [drinkOptions, setDrinkOptions] = useState<
    { id: string; name: string; emoji: string }[]
  >([]);

  const verifyCode = useCallback(async () => {
    if (code.length !== 4) {
      setError("Please enter your 4-digit code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/rsvp/verify?code=${code}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Code not found. Please check and try again.");
        return;
      }

      setGuest(data.guest);

      // Fetch drink options
      const drinksRes = await fetch("/api/drinks");
      const drinksData = await drinksRes.json();
      setDrinkOptions(drinksData.drinks || []);

      setStep("form");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [code]);

  const toggleDrinkVote = (drinkId: string) => {
    setDrinkVotes((prev) => {
      if (prev.includes(drinkId)) return prev.filter((id) => id !== drinkId);
      if (prev.length >= 3) return prev; // Max 3
      return [...prev, drinkId];
    });
  };

  const submitRSVP = async () => {
    if (attending === null) {
      setError("Please let us know if you're attending");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestId: guest?.id,
          attending,
          plusOneName: plusOneName || null,
          dietaryRequirements: dietary || null,
          drinkVotes,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong");
        return;
      }

      setStep("success");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-nouveau min-h-[80vh]">
      <div className="section-inner">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-4xl sm:text-5xl text-gold-gradient mb-2">
            RSVP
          </h1>
          <p className="font-heading text-lg text-bark-light">
            Please respond by <strong className="text-accent-burgundy">January 1st, 2027</strong>
          </p>
        </motion.div>

        {/* Leonard + Scroll Area */}
        <div className="flex flex-col lg:flex-row items-start justify-center gap-8 lg:gap-4">
          {/* Leonard */}
          <motion.div
            className="flex-shrink-0 self-center lg:self-start lg:mt-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Leonard
              size={200}
              showSpeech={step === "code"}
              speechText="Enter your code! 📜"
              animate={step !== "form"}
            />
          </motion.div>

          {/* Scroll Form Area */}
          <div className="flex-1 max-w-xl w-full">
            <AnimatePresence mode="wait">
              {/* ── Step 1: Enter Code ────────────── */}
              {step === "code" && (
                <motion.div
                  key="code-step"
                  initial={{ opacity: 0, scaleY: 0, originY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  exit={{ opacity: 0, scaleY: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <div className="parchment-scroll p-8 sm:p-10">
                    {/* Scroll top curl */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-parchment-dark rounded-full border border-gold/40" />

                    <div className="text-center space-y-6 pt-4">
                      <div>
                        <h2 className="font-heading text-2xl text-ivy-dark mb-2">
                          Your Invitation Code
                        </h2>
                        <p className="font-body text-bark-light">
                          Enter the 4-digit code from your invitation
                        </p>
                      </div>

                      <div className="flex justify-center gap-3">
                        {[0, 1, 2, 3].map((i) => (
                          <input
                            key={i}
                            type="text"
                            maxLength={1}
                            className="w-14 h-16 text-center text-2xl font-heading input-nouveau"
                            value={code[i] || ""}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "");
                              const newCode = code.split("");
                              newCode[i] = val;
                              setCode(newCode.join("").slice(0, 4));
                              // Auto-focus next
                              if (val && i < 3) {
                                const next = e.target
                                  .parentElement?.children[i + 1] as HTMLInputElement;
                                next?.focus();
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Backspace" && !code[i] && i > 0) {
                                const prev = (e.target as HTMLInputElement)
                                  .parentElement?.children[i - 1] as HTMLInputElement;
                                prev?.focus();
                              }
                              if (e.key === "Enter") verifyCode();
                            }}
                          />
                        ))}
                      </div>

                      {error && (
                        <p className="text-accent-red text-sm font-body">{error}</p>
                      )}

                      <button
                        onClick={verifyCode}
                        disabled={loading}
                        className="btn-nouveau disabled:opacity-50"
                      >
                        {loading ? "Checking..." : "Find My Invitation"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Step 2: RSVP Form ────────────── */}
              {step === "form" && (
                <motion.div
                  key="form-step"
                  initial={{ opacity: 0, scaleY: 0, originY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <div className="parchment-scroll p-8 sm:p-10">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-parchment-dark rounded-full border border-gold/40" />

                    <div className="space-y-8 pt-4">
                      {/* Greeting */}
                      <div className="text-center">
                        <h2 className="font-heading text-2xl text-ivy-dark mb-1">
                          Welcome, {guest?.name}!
                        </h2>
                        <p className="font-body text-bark-light">
                          We&apos;d love to hear from you
                        </p>
                      </div>

                      {/* Attending? */}
                      <div>
                        <label className="font-heading text-sm tracking-wider uppercase text-gold-dark block mb-3">
                          Will you be attending?
                        </label>
                        <div className="flex gap-4">
                          <button
                            onClick={() => setAttending(true)}
                            className={`flex-1 py-3 px-4 rounded-art border-2 font-heading text-center transition-all ${
                              attending === true
                                ? "border-leaf bg-leaf/10 text-ivy-dark"
                                : "border-gold/30 text-bark-light hover:border-gold"
                            }`}
                          >
                            Joyfully Accept ✨
                          </button>
                          <button
                            onClick={() => setAttending(false)}
                            className={`flex-1 py-3 px-4 rounded-art border-2 font-heading text-center transition-all ${
                              attending === false
                                ? "border-accent-burgundy bg-accent-burgundy/10 text-accent-burgundy"
                                : "border-gold/30 text-bark-light hover:border-gold"
                            }`}
                          >
                            Regretfully Decline
                          </button>
                        </div>
                      </div>

                      {attending && (
                        <motion.div
                          className="space-y-6"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          transition={{ duration: 0.5 }}
                        >
                          {/* Plus One */}
                          <div>
                            <label className="font-heading text-sm tracking-wider uppercase text-gold-dark block mb-2">
                              Plus One Name
                            </label>
                            <input
                              type="text"
                              className="input-nouveau"
                              placeholder="Leave blank if coming solo"
                              value={plusOneName}
                              onChange={(e) => setPlusOneName(e.target.value)}
                            />
                          </div>

                          {/* Dietary Requirements */}
                          <div>
                            <label className="font-heading text-sm tracking-wider uppercase text-gold-dark block mb-2">
                              Dietary Requirements / Allergies
                            </label>
                            <textarea
                              className="input-nouveau min-h-[80px] resize-y"
                              placeholder="Vegan, gluten-free, nut allergy, etc."
                              value={dietary}
                              onChange={(e) => setDietary(e.target.value)}
                            />
                          </div>

                          {/* Drink Votes */}
                          <div>
                            <label className="font-heading text-sm tracking-wider uppercase text-gold-dark block mb-2">
                              Vote for your top 3 drinks 🍸
                            </label>
                            <p className="font-body text-sm text-bark-light mb-3">
                              Pick up to 3 — this helps us stock the bar!
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                              {drinkOptions.map((drink) => {
                                const selected = drinkVotes.includes(drink.id);
                                const maxed =
                                  drinkVotes.length >= 3 && !selected;
                                return (
                                  <button
                                    key={drink.id}
                                    onClick={() => toggleDrinkVote(drink.id)}
                                    disabled={maxed}
                                    className={`py-2 px-3 rounded-lg border text-left font-body transition-all ${
                                      selected
                                        ? "border-gold bg-gold/10 text-ivy-dark"
                                        : maxed
                                        ? "border-gray-200 text-gray-300 cursor-not-allowed"
                                        : "border-gold/30 text-bark hover:border-gold"
                                    }`}
                                  >
                                    <span className="mr-2">{drink.emoji}</span>
                                    {drink.name}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {error && (
                        <p className="text-accent-red text-sm font-body text-center">
                          {error}
                        </p>
                      )}

                      {/* Submit */}
                      <div className="text-center pt-4">
                        <button
                          onClick={submitRSVP}
                          disabled={loading || attending === null}
                          className="btn-nouveau disabled:opacity-50"
                        >
                          {loading ? "Sending..." : "Send RSVP"}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Step 3: Success ────────────── */}
              {step === "success" && (
                <motion.div
                  key="success-step"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="parchment-scroll p-8 sm:p-10 text-center">
                    <div className="space-y-6">
                      <motion.div
                        className="text-6xl"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          delay: 0.3,
                        }}
                      >
                        {attending ? "🎉" : "💛"}
                      </motion.div>

                      <h2 className="font-heading text-3xl text-ivy-dark">
                        {attending
                          ? "We can't wait to see you!"
                          : "We'll miss you!"}
                      </h2>

                      <p className="font-body text-lg text-bark-light">
                        {attending
                          ? "Your RSVP has been received. See you on July 10th!"
                          : "Thank you for letting us know. You'll be missed!"}
                      </p>

                      <Leonard
                        size={140}
                        showSpeech
                        speechText={
                          attending
                            ? "Excellent taste! See you there! 🐾"
                            : "Leonard will miss you! 🐾"
                        }
                        animate
                        className="mx-auto"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
