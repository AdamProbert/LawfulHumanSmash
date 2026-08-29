"use client";

import { useCallback, useEffect, useState } from "react";
import DrinksTab from "./DrinksTab";
import GuestsTab from "./GuestsTab";
import ItineraryTab from "./ItineraryTab";
import QuestionsTab from "./QuestionsTab";
import type {
  AdminDrink,
  AdminItinerarySlot,
  AdminParty,
  AdminQuestion,
} from "./types";

type TabId = "guests" | "questions" | "drinks" | "itinerary";

const TABS: { id: TabId; label: string }[] = [
  { id: "guests", label: "Guests" },
  { id: "questions", label: "Q&A" },
  { id: "drinks", label: "Drinks" },
  { id: "itinerary", label: "Itinerary" },
];

export default function SecretGardenPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState<TabId>("guests");
  const [loading, setLoading] = useState(true);

  const [parties, setParties] = useState<AdminParty[]>([]);
  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const [drinks, setDrinks] = useState<AdminDrink[]>([]);
  const [slots, setSlots] = useState<AdminItinerarySlot[]>([]);

  /**
   * Everything in one pass. The panel is one person on one screen, and the
   * whole dataset is a few hundred rows, so loading it up front makes tab
   * switching instant and keeps the counts in the tab bar honest.
   */
  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const responses = await Promise.all([
        fetch("/api/admin/parties"),
        fetch("/api/admin/questions"),
        fetch("/api/admin/drinks"),
        fetch("/api/admin/itinerary"),
      ]);

      if (responses.some((r) => r.status === 401)) {
        setAuthed(false);
        return;
      }

      const [partyData, questionData, drinkData, slotData] = await Promise.all(
        responses.map((r) => r.json())
      );

      setParties(partyData.parties || []);
      setQuestions(questionData.questions || []);
      setDrinks(drinkData.drinks || []);
      setSlots(slotData.slots || []);
      setAuthed(true);
    } catch (err) {
      console.error("Failed to load admin data:", err);
      setAuthed(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!res.ok) {
      setLoginError("Incorrect password");
      return;
    }

    setPassword("");
    loadAll();
  };

  const handleLogout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    setAuthed(false);
    setParties([]);
    setQuestions([]);
    setDrinks([]);
    setSlots([]);
  };

  if (authed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vine-pattern">
        <p className="font-body text-bark-light">Loading…</p>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vine-pattern px-4">
        <form
          onSubmit={handleLogin}
          className="frame-nouveau max-w-xs w-full space-y-4"
        >
          <h1 className="font-heading text-xl text-ivy-dark text-center">
            The Secret Garden
          </h1>
          <input
            type="password"
            className="input-nouveau"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {loginError && (
            <p className="text-accent-red text-sm font-body text-center">
              {loginError}
            </p>
          )}
          <button type="submit" className="btn-nouveau w-full">
            Enter
          </button>
        </form>
      </div>
    );
  }

  // Counts beside each tab label, so the work queue is visible without
  // opening the tab.
  const counts: Record<TabId, number | null> = {
    guests: parties.reduce((sum, p) => sum + p.guests.length, 0),
    questions: questions.filter((q) => !q.isAnswered).length || null,
    drinks: null,
    itinerary: slots.length,
  };

  return (
    <div className="admin-shell bg-vine-pattern">
      <div className="admin-inner">
        <div className="flex flex-wrap items-baseline gap-3 mb-5">
          <h1 className="font-heading text-2xl text-ivy-dark">
            The Secret Garden
          </h1>
          <div className="ml-auto flex gap-2">
            <button
              className="admin-btn"
              data-variant="ghost"
              onClick={loadAll}
              disabled={loading}
            >
              {loading ? "Refreshing…" : "Refresh"}
            </button>
            <button
              className="admin-btn"
              data-variant="ghost"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        </div>

        <div className="admin-tabs" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              className="admin-tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
            >
              {t.label}
              {counts[t.id] !== null && (
                <span className="admin-tab-count">{counts[t.id]}</span>
              )}
            </button>
          ))}
        </div>

        {tab === "guests" && <GuestsTab parties={parties} />}
        {tab === "questions" && (
          <QuestionsTab questions={questions} setQuestions={setQuestions} />
        )}
        {tab === "drinks" && <DrinksTab drinks={drinks} />}
        {tab === "itinerary" && (
          <ItineraryTab slots={slots} setSlots={setSlots} />
        )}
      </div>
    </div>
  );
}
