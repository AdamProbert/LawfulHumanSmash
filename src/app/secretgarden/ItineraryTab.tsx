"use client";

import { useState } from "react";
import { SLOT_KINDS, SLOT_TONES, formatMinutes } from "@/lib/itinerary";
import type { AdminItinerarySlot } from "./types";
import { Empty, Pill } from "./ui";

interface Draft {
  time: string;
  title: string;
  kind: string;
  tone: string;
  billing: string;
  description: string;
}

function draftOf(slot: AdminItinerarySlot): Draft {
  return {
    time: slot.time,
    title: slot.title,
    kind: slot.kind,
    tone: slot.tone,
    billing: slot.billing || "",
    description: slot.description,
  };
}

const BLANK: Draft = {
  time: "",
  title: "",
  kind: "interstitial",
  tone: "day",
  billing: "",
  description: "",
};

/**
 * The running order behind the Itinerary page. Rows sort by their time, so
 * fixing a time is all it takes to move a slot; there is no separate ordering
 * to keep in step.
 */
export default function ItineraryTab({
  slots,
  setSlots,
}: {
  slots: AdminItinerarySlot[];
  setSlots: React.Dispatch<React.SetStateAction<AdminItinerarySlot[]>>;
}) {
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [newSlot, setNewSlot] = useState<Draft>(BLANK);
  const [adding, setAdding] = useState(false);

  /** Keep the list in the order the Itinerary page will render it. */
  const sortBySlotTime = (list: AdminItinerarySlot[]) =>
    [...list].sort((a, b) => a.atMinutes - b.atMinutes);

  const patch = async (id: string, body: Record<string, unknown>) => {
    setBusyId(id);
    setError("");
    try {
      const res = await fetch(`/api/admin/itinerary/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save");
        return;
      }
      setSlots((prev) =>
        sortBySlotTime(prev.map((s) => (s.id === id ? data.slot : s)))
      );
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } catch {
      setError("Failed to save");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (slot: AdminItinerarySlot) => {
    const ok = window.confirm(
      `Delete "${slot.time} ${slot.title}" permanently?\n\nHide it instead if you might want it back.`
    );
    if (!ok) return;

    setBusyId(slot.id);
    try {
      const res = await fetch(`/api/admin/itinerary/${slot.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSlots((prev) => prev.filter((s) => s.id !== slot.id));
      } else {
        setError("Failed to delete");
      }
    } finally {
      setBusyId(null);
    }
  };

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setError("");
    try {
      const res = await fetch("/api/admin/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSlot),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to add");
        return;
      }
      setSlots((prev) => sortBySlotTime([...prev, data.slot]));
      setNewSlot(BLANK);
    } catch {
      setError("Failed to add");
    } finally {
      setAdding(false);
    }
  };

  /** The time/title/kind/tone/billing/description block, shared by add and edit. */
  const fields = (draft: Draft, update: (changes: Partial<Draft>) => void) => (
    <>
      <div className="flex flex-wrap gap-2">
        <div className="w-24">
          <label className="admin-label">Time</label>
          <input
            className="admin-input"
            placeholder="7:40"
            value={draft.time}
            onChange={(e) => update({ time: e.target.value })}
          />
        </div>
        <div className="flex-1 min-w-[10rem]">
          <label className="admin-label">Title</label>
          <input
            className="admin-input"
            placeholder="First dance"
            value={draft.title}
            onChange={(e) => update({ title: e.target.value })}
          />
        </div>
        <div>
          <label className="admin-label">Kind</label>
          <select
            className="admin-input w-auto"
            value={draft.kind}
            onChange={(e) => update({ kind: e.target.value })}
          >
            {SLOT_KINDS.map((k) => (
              <option key={k.id} value={k.id}>
                {k.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="admin-label">Tone</label>
          <select
            className="admin-input w-auto"
            value={draft.tone}
            onChange={(e) => update({ tone: e.target.value })}
          >
            {SLOT_TONES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="admin-label">Billing (optional)</label>
        <input
          className="admin-input"
          placeholder="Headline"
          value={draft.billing}
          onChange={(e) => update({ billing: e.target.value })}
        />
      </div>

      <div>
        <label className="admin-label">Description</label>
        <textarea
          className="admin-input min-h-[56px] resize-y"
          value={draft.description}
          onChange={(e) => update({ description: e.target.value })}
        />
      </div>
    </>
  );

  return (
    <div>
      <p className="font-body text-sm text-bark-light mb-4">
        Times are read from what you type, so <strong>1:30</strong> means half
        one in the afternoon. Add <strong>am</strong> if you really mean the
        small hours. Rows sort themselves by time.
      </p>

      <form onSubmit={add} className="admin-card space-y-2">
        <p className="font-heading text-sm text-ivy-dark">Add a slot</p>
        {fields(newSlot, (changes) =>
          setNewSlot((prev) => ({ ...prev, ...changes }))
        )}
        <button
          type="submit"
          className="admin-btn"
          disabled={adding || !newSlot.time.trim() || !newSlot.title.trim()}
        >
          {adding ? "Adding…" : "Add slot"}
        </button>
      </form>

      {error && (
        <p className="font-body text-sm text-accent-red my-3">{error}</p>
      )}

      <div className="mt-4">
        {slots.length === 0 ? (
          <Empty>No slots yet.</Empty>
        ) : (
          slots.map((slot) => {
            const draft = drafts[slot.id] || draftOf(slot);
            const update = (changes: Partial<Draft>) =>
              setDrafts((prev) => ({
                ...prev,
                [slot.id]: { ...draft, ...changes },
              }));
            const dirty =
              draft.time !== slot.time ||
              draft.title !== slot.title ||
              draft.kind !== slot.kind ||
              draft.tone !== slot.tone ||
              draft.billing !== (slot.billing || "") ||
              draft.description !== slot.description;

            return (
              <div
                key={slot.id}
                className="admin-card space-y-2"
                data-muted={!slot.isVisible}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-heading text-sm text-ivy-dark">
                    {slot.time} · {slot.title}
                  </span>
                  <span className="font-body text-xs text-bark-light/70">
                    sorts at {formatMinutes(slot.atMinutes)}
                  </span>
                  <span className="ml-auto flex gap-1.5">
                    {!slot.isVisible && <Pill status="neutral">Hidden</Pill>}
                    <Pill status={slot.kind === "act" ? "yes" : "neutral"}>
                      {slot.kind === "act" ? "Act" : "Interstitial"}
                    </Pill>
                  </span>
                </div>

                {fields(draft, update)}

                <div className="flex flex-wrap gap-2">
                  <button
                    className="admin-btn"
                    disabled={busyId === slot.id || !dirty}
                    onClick={() => patch(slot.id, { ...draft })}
                  >
                    {busyId === slot.id ? "Saving…" : "Save"}
                  </button>
                  <button
                    className="admin-btn"
                    data-variant="ghost"
                    disabled={busyId === slot.id}
                    onClick={() =>
                      patch(slot.id, { isVisible: !slot.isVisible })
                    }
                  >
                    {slot.isVisible ? "Hide" : "Show on site"}
                  </button>
                  <button
                    className="admin-btn"
                    data-variant="danger"
                    disabled={busyId === slot.id}
                    onClick={() => remove(slot)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
