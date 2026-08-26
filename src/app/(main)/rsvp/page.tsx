"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import BookChapter from "@/components/BookChapter";
import BookPage from "@/components/BookPage";
import { readCookie, writeCookie, RSVP_CODE_COOKIE } from "@/lib/cookies";

type WizardStep = "code" | "attendance" | "details" | "email" | "success";

interface GuestState {
  id: string;
  name: string;
  attending: boolean | null;
  dietaryRequirements: string;
  drinkVotes: string[];
}

interface DrinkOption {
  id: string;
  name: string;
  emoji: string;
}

const CODE_COOKIE_MAX_AGE = 60 * 60 * 24 * 180; // 180 days

export default function RSVPPage() {
  return (
    <Suspense fallback={null}>
      <RSVPWizard />
    </Suspense>
  );
}

function RSVPWizard() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<WizardStep>("code");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingCookie, setCheckingCookie] = useState(true);

  const [partyId, setPartyId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [guests, setGuests] = useState<GuestState[]>([]);
  const [drinkOptions, setDrinkOptions] = useState<DrinkOption[]>([]);

  // A code in the URL (e.g. from an emailed link) wins over a cached cookie,
  // so the code step is skipped entirely whenever either is available.
  useEffect(() => {
    const fromLink = searchParams.get("code");
    const cached = fromLink || readCookie(RSVP_CODE_COOKIE);
    if (cached && cached.length === 4) {
      setCode(cached);
      verifyCode(cached);
    } else {
      setCheckingCookie(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verifyCode = async (codeValue: string) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/rsvp/verify?code=${codeValue}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Code not found. Please check and try again.");
        writeCookie(RSVP_CODE_COOKIE, "", 0);
        return;
      }

      const drinksRes = await fetch("/api/drinks");
      const drinksData = await drinksRes.json();

      setPartyId(data.party.id);
      setEmail(data.party.email || "");
      setGuests(
        data.party.guests.map(
          (g: {
            id: string;
            name: string;
            attending: boolean | null;
            dietaryRequirements: string | null;
            drinkVotes: { drinkId: string }[];
          }) => ({
            id: g.id,
            name: g.name,
            attending: g.attending,
            dietaryRequirements: g.dietaryRequirements || "",
            drinkVotes: g.drinkVotes.map((v) => v.drinkId),
          })
        )
      );
      setDrinkOptions(drinksData.drinks || []);
      writeCookie(RSVP_CODE_COOKIE, codeValue, CODE_COOKIE_MAX_AGE);
      setStep("attendance");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setCheckingCookie(false);
    }
  };

  const setAttending = (guestId: string, attending: boolean) => {
    setGuests((prev) =>
      prev.map((g) => (g.id === guestId ? { ...g, attending } : g))
    );
  };

  const setDietary = (guestId: string, value: string) => {
    setGuests((prev) =>
      prev.map((g) =>
        g.id === guestId ? { ...g, dietaryRequirements: value } : g
      )
    );
  };

  const toggleDrinkVote = (guestId: string, drinkId: string) => {
    setGuests((prev) =>
      prev.map((g) => {
        if (g.id !== guestId) return g;
        if (g.drinkVotes.includes(drinkId)) {
          return { ...g, drinkVotes: g.drinkVotes.filter((id) => id !== drinkId) };
        }
        if (g.drinkVotes.length >= 3) return g;
        return { ...g, drinkVotes: [...g.drinkVotes, drinkId] };
      })
    );
  };

  const anyAttending = guests.some((g) => g.attending);

  const continueFromAttendance = () => {
    if (guests.some((g) => g.attending === null)) {
      setError("Please respond for everyone in your party");
      return;
    }
    setError("");
    setStep(anyAttending ? "details" : "email");
  };

  const submitRSVP = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partyId,
          email: email || null,
          guests: guests.map((g) => ({
            guestId: g.id,
            attending: g.attending,
            dietaryRequirements: g.dietaryRequirements || null,
            drinkVotes: g.drinkVotes,
          })),
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
    <BookChapter title="RSVP">
      <BookPage>
        {/* Header */}
        <div className="text-center mb-4">
          <p className="font-heading text-sm text-bark-light">
            Please respond by{" "}
            <span className="text-accent-burgundy">January 1st, 2027</span>
          </p>
        </div>

        <div className="max-w-sm w-full mx-auto">
          <AnimatePresence mode="wait">
            {/* ── Step 1: Enter Code ────────────── */}
            {step === "code" && !checkingCookie && (
              <motion.div
                key="code-step"
                initial={{ opacity: 0, scaleY: 0, originY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                exit={{ opacity: 0, scaleY: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div className="text-center space-y-6">
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
                        inputMode="numeric"
                        pattern="[0-9]*"
                        autoComplete="one-time-code"
                        maxLength={1}
                        className="w-14 h-16 text-center text-2xl font-heading input-nouveau"
                        value={code[i] || ""}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          const newCode = code.split("");
                          newCode[i] = val;
                          setCode(newCode.join("").slice(0, 4));
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
                          if (e.key === "Enter" && code.length === 4)
                            verifyCode(code);
                        }}
                      />
                    ))}
                  </div>

                  {error && (
                    <p className="text-accent-red text-sm font-body">{error}</p>
                  )}

                  <button
                    onClick={() => verifyCode(code)}
                    disabled={loading || code.length !== 4}
                    className="btn-nouveau disabled:opacity-50"
                  >
                    {loading ? "Checking..." : "Find My Invitation"}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Step 2: Attendance ────────────── */}
            {step === "attendance" && (
              <motion.div
                key="attendance-step"
                initial={{ opacity: 0, scaleY: 0, originY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="font-heading text-2xl text-ivy-dark mb-1">
                      Who&apos;s joining us?
                    </h2>
                    <p className="font-body text-bark-light">
                      Let us know for each person in your party
                    </p>
                  </div>

                  <div className="space-y-4">
                    {guests.map((g) => (
                      <div key={g.id}>
                        <p className="font-heading text-base text-ivy-dark mb-2">
                          {g.name}
                        </p>
                        <div className="flex gap-3">
                          <button
                            onClick={() => setAttending(g.id, true)}
                            className={`flex-1 py-2.5 px-3 rounded-art border-2 font-heading text-sm text-center transition-all ${
                              g.attending === true
                                ? "border-leaf bg-leaf/10 text-ivy-dark"
                                : "border-gold/30 text-bark-light hover:border-gold"
                            }`}
                          >
                            Joyfully Accept ✨
                          </button>
                          <button
                            onClick={() => setAttending(g.id, false)}
                            className={`flex-1 py-2.5 px-3 rounded-art border-2 font-heading text-sm text-center transition-all ${
                              g.attending === false
                                ? "border-accent-burgundy bg-accent-burgundy/10 text-accent-burgundy"
                                : "border-gold/30 text-bark-light hover:border-gold"
                            }`}
                          >
                            Regretfully Decline
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {error && (
                    <p className="text-accent-red text-sm font-body text-center">
                      {error}
                    </p>
                  )}

                  <div className="text-center pt-2">
                    <button
                      onClick={continueFromAttendance}
                      className="btn-nouveau"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Step 3: Dietary & Drinks ────────────── */}
            {step === "details" && (
              <motion.div
                key="details-step"
                initial={{ opacity: 0, scaleY: 0, originY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="font-heading text-2xl text-ivy-dark mb-1">
                      A few more details
                    </h2>
                    <p className="font-body text-bark-light">
                      For everyone who&apos;s joining us
                    </p>
                  </div>

                  {guests
                    .filter((g) => g.attending)
                    .map((g) => (
                      <div key={g.id} className="space-y-4">
                        <p className="font-heading text-base text-ivy-dark border-b border-gold/20 pb-1">
                          {g.name}
                        </p>

                        <div>
                          <label className="font-heading text-sm tracking-wider uppercase text-gold-dark block mb-2">
                            Dietary Requirements / Allergies
                          </label>
                          <textarea
                            className="input-nouveau min-h-[70px] resize-y"
                            placeholder="Vegan, gluten-free, nut allergy, etc."
                            value={g.dietaryRequirements}
                            onChange={(e) => setDietary(g.id, e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="font-heading text-sm tracking-wider uppercase text-gold-dark block mb-2">
                            Vote for your top 3 drinks 🍸
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {drinkOptions.map((drink) => {
                              const selected = g.drinkVotes.includes(drink.id);
                              const maxed = g.drinkVotes.length >= 3 && !selected;
                              return (
                                <button
                                  key={drink.id}
                                  onClick={() => toggleDrinkVote(g.id, drink.id)}
                                  disabled={maxed}
                                  className={`py-2 px-3 rounded-lg border text-left font-body text-sm transition-all ${
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
                      </div>
                    ))}

                  <div className="text-center pt-2">
                    <button onClick={() => setStep("email")} className="btn-nouveau">
                      Continue
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Step 4: Email ────────────── */}
            {step === "email" && (
              <motion.div
                key="email-step"
                initial={{ opacity: 0, scaleY: 0, originY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="font-heading text-2xl text-ivy-dark mb-1">
                      Last thing!
                    </h2>
                    <p className="font-body text-bark-light">
                      Leave us an email so we can keep you in the loop
                    </p>
                  </div>

                  <div>
                    <label className="font-heading text-sm tracking-wider uppercase text-gold-dark block mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      className="input-nouveau"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  {error && (
                    <p className="text-accent-red text-sm font-body text-center">
                      {error}
                    </p>
                  )}

                  <div className="text-center pt-2">
                    <button
                      onClick={submitRSVP}
                      disabled={loading}
                      className="btn-nouveau disabled:opacity-50"
                    >
                      {loading ? "Sending..." : "Send RSVP"}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Step 5: Success ────────────── */}
            {step === "success" && (
              <motion.div
                key="success-step"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div className="text-center space-y-6">
                  <motion.div
                    className="text-6xl"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                  >
                    {anyAttending ? "🎉" : "💛"}
                  </motion.div>

                  <h2 className="font-heading text-3xl text-ivy-dark">
                    {anyAttending
                      ? "We can't wait to see you!"
                      : "We'll miss you!"}
                  </h2>

                  <p className="font-body text-lg text-bark-light">
                    {anyAttending
                      ? "Your RSVP has been received. See you on July 10th!"
                      : "Thank you for letting us know. You'll be missed!"}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </BookPage>
    </BookChapter>
  );
}

