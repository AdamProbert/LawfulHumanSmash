"use client";

import { useMemo, useRef, useState } from "react";
import CodeReel from "./CodeReel";
import type { AdminGuest, AdminParty } from "./types";
import { datedFilename, downloadCsv } from "./csv";
import { Empty, Pill, Stat, formatDateTime } from "./ui";

type Filter = "all" | "attending" | "declined" | "awaiting";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "attending", label: "Attending" },
  { id: "declined", label: "Declined" },
  { id: "awaiting", label: "Awaiting reply" },
];

const STATUS_LABELS: Record<Exclude<Filter, "all">, string> = {
  attending: "Attending",
  declined: "Declined",
  awaiting: "Awaiting",
};

/** Which bucket a guest falls into; null attending means they haven't replied. */
function bucket(guest: AdminGuest): Exclude<Filter, "all"> {
  if (guest.attending === null) return "awaiting";
  return guest.attending ? "attending" : "declined";
}

/**
 * The guest list: every party with its activation code, contact email, and
 * each guest's RSVP state, dietary note and drink picks — plus adding and
 * removing parties and guests.
 *
 * RSVP answers themselves stay read-only. They belong to the guests, and a
 * party can always redo theirs with their code.
 */
export default function GuestsTab({
  parties,
  setParties,
}: {
  parties: AdminParty[];
  setParties: React.Dispatch<React.SetStateAction<AdminParty[]>>;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  /** Party whose management controls are open; only one at a time. */
  const [editing, setEditing] = useState<string | null>(null);

  // New-party composer.
  const [showComposer, setShowComposer] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newNames, setNewNames] = useState("");
  const [creating, setCreating] = useState(false);
  /**
   * Parties created in this sitting. They are pinned to the top of the list so
   * the code that was just generated is on screen and editable straight away,
   * rather than sorting itself away into the middle of the list.
   */
  const [justCreated, setJustCreated] = useState<string[]>([]);
  /** Focused after each create so names can be typed straight into it. */
  const namesRef = useRef<HTMLTextAreaElement>(null);
  /**
   * The code waiting in the composer. It is drawn when the composer opens and
   * re-drawn after each create, so one is always sitting there ready by the
   * time the party is submitted. `drawnCode` is null while the reel spins.
   */
  const [drawnCode, setDrawnCode] = useState<string | null>(null);
  const [codeValue, setCodeValue] = useState("");

  // Per-party drafts for the code/email fields and the add-guest box.
  const [partyDrafts, setPartyDrafts] = useState<
    Record<string, { code: string; email: string }>
  >({});
  const [guestNameDrafts, setGuestNameDrafts] = useState<
    Record<string, string>
  >({});

  const stats = useMemo(() => {
    const guests = parties.flatMap((p) => p.guests);
    return {
      parties: parties.length,
      guests: guests.length,
      attending: guests.filter((g) => g.attending === true).length,
      declined: guests.filter((g) => g.attending === false).length,
      awaiting: guests.filter((g) => g.attending === null).length,
      partiesReplied: parties.filter((p) =>
        p.guests.some((g) => g.rsvpSubmittedAt)
      ).length,
    };
  }, [parties]);

  // A party survives the filter if any of its guests do, and it is shown with
  // only those guests: filtering to "awaiting" should not pad the list out
  // with housemates who already replied.
  const visible = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return parties
      .map((party) => ({
        ...party,
        guests: party.guests.filter(
          (g) => filter === "all" || bucket(g) === filter
        ),
      }))
      .filter((party) => party.guests.length > 0)
      .filter((party) => {
        if (!needle) return true;
        return (
          party.code.includes(needle) ||
          (party.email || "").toLowerCase().includes(needle) ||
          party.guests.some((g) => g.name.toLowerCase().includes(needle))
        );
      })
      // Newest first among the ones made in this sitting, then everything
      // else in the order the server sent.
      .sort((a, b) => {
        const ai = justCreated.indexOf(a.id);
        const bi = justCreated.indexOf(b.id);
        if (ai === -1 && bi === -1) return 0;
        if (ai === -1) return 1;
        if (bi === -1) return -1;
        return ai - bi;
      });
  }, [parties, filter, search, justCreated]);

  // Exports exactly what is on screen, filters and search included: the usual
  // reason to reach for the CSV is to hand one slice of the list to a caterer
  // or a venue, not to re-export everything every time.
  const exportCsv = () => {
    const rows: unknown[][] = [
      [
        "Party code",
        "Party email",
        "Guest",
        "Status",
        "Dietary requirements",
        "Drink picks",
        "Replied at",
      ],
      ...visible.flatMap((party) =>
        party.guests.map((guest) => [
          party.code,
          party.email || "",
          guest.name,
          STATUS_LABELS[bucket(guest)],
          guest.dietaryRequirements || "",
          guest.drinks.map((d) => d.name).join("; "),
          guest.rsvpSubmittedAt ? formatDateTime(guest.rsvpSubmittedAt) : "",
        ])
      ),
    ];
    downloadCsv(datedFilename(`guests-${filter}`), rows);
  };

  /** Ask the server for an unused code and let the reel land on it. */
  const drawCode = async () => {
    setDrawnCode(null);
    setCodeValue("");
    try {
      const res = await fetch("/api/admin/parties/new-code");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to draw a code");
        return null;
      }
      setDrawnCode(data.code);
      setCodeValue(data.code);
      return data.code as string;
    } catch {
      setError("Failed to draw a code");
      return null;
    }
  };

  const openComposer = () => {
    setShowComposer(true);
    setError("");
    drawCode();
  };

  const createParty = async (e: React.FormEvent) => {
    e.preventDefault();
    const guestNames = newNames
      .split("\n")
      .map((n) => n.trim())
      .filter(Boolean);
    if (guestNames.length === 0) return;

    setCreating(true);
    setError("");

    /**
     * One attempt. `code` is undefined when we have nothing to offer, in
     * which case the server draws its own.
     */
    const attempt = async (code: string | undefined) =>
      fetch("/api/admin/parties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, email: newEmail, guestNames }),
      });

    try {
      const submitted = codeValue.trim() || undefined;
      let res = await attempt(submitted);
      let data = await res.json();

      // The drawn code was not reserved, so another admin could have taken it
      // in the meantime. If it was ours to lose — drawn, not typed — quietly
      // draw another and try once more rather than making this the user's
      // problem. A code they typed themselves is reported instead.
      if (res.status === 409 && data.codeTaken && submitted === drawnCode) {
        const fresh = await drawCode();
        if (fresh) {
          res = await attempt(fresh);
          data = await res.json();
        }
      }

      if (!res.ok) {
        setError(data.error || "Failed to create party");
        return;
      }

      setParties((prev) => [data.party, ...prev]);
      setJustCreated((prev) => [data.party.id, ...prev]);
      // Cleared and left open so the next party can be typed straight in,
      // with its code already drawn and waiting.
      setNewEmail("");
      setNewNames("");
      // A filter or search would hide the party that was just made.
      setFilter("all");
      setSearch("");
      namesRef.current?.focus();
      drawCode();
    } catch {
      setError("Failed to create party");
    } finally {
      setCreating(false);
    }
  };

  const saveParty = async (party: AdminParty) => {
    const draft = partyDrafts[party.id];
    if (!draft) return;

    setBusyId(party.id);
    setError("");
    try {
      const res = await fetch(`/api/admin/parties/${party.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: draft.code, email: draft.email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save party");
        return;
      }
      setParties((prev) =>
        prev.map((p) => (p.id === party.id ? data.party : p))
      );
      setPartyDrafts((prev) => {
        const next = { ...prev };
        delete next[party.id];
        return next;
      });
    } catch {
      setError("Failed to save party");
    } finally {
      setBusyId(null);
    }
  };

  const deleteParty = async (party: AdminParty) => {
    const replied = party.guests.filter((g) => g.rsvpSubmittedAt).length;
    const warning = replied
      ? `\n\n${replied} of them have already replied — those answers go too.`
      : "";
    const ok = window.confirm(
      `Delete party ${party.code} and all ${party.guests.length} of its guests?` +
        `\n\n${party.guests.map((g) => g.name).join(", ")}` +
        warning +
        `\n\nThis cannot be undone.`
    );
    if (!ok) return;

    setBusyId(party.id);
    setError("");
    try {
      const res = await fetch(`/api/admin/parties/${party.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to delete party");
        return;
      }
      setParties((prev) => prev.filter((p) => p.id !== party.id));
    } catch {
      setError("Failed to delete party");
    } finally {
      setBusyId(null);
    }
  };

  const addGuest = async (party: AdminParty) => {
    const name = (guestNameDrafts[party.id] || "").trim();
    if (!name) return;

    setBusyId(party.id);
    setError("");
    try {
      const res = await fetch(`/api/admin/parties/${party.id}/guests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to add guest");
        return;
      }
      setParties((prev) =>
        prev.map((p) =>
          p.id === party.id ? { ...p, guests: [...p.guests, data.guest] } : p
        )
      );
      setGuestNameDrafts((prev) => ({ ...prev, [party.id]: "" }));
    } catch {
      setError("Failed to add guest");
    } finally {
      setBusyId(null);
    }
  };

  const renameGuest = async (
    party: AdminParty,
    guest: AdminGuest,
    name: string
  ) => {
    const trimmed = name.trim();
    if (!trimmed || trimmed === guest.name) return;

    setBusyId(guest.id);
    setError("");
    try {
      const res = await fetch(`/api/admin/guests/${guest.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to rename guest");
        return;
      }
      setParties((prev) =>
        prev.map((p) =>
          p.id === party.id
            ? {
                ...p,
                guests: p.guests.map((g) =>
                  g.id === guest.id ? data.guest : g
                ),
              }
            : p
        )
      );
    } catch {
      setError("Failed to rename guest");
    } finally {
      setBusyId(null);
    }
  };

  const deleteGuest = async (party: AdminParty, guest: AdminGuest) => {
    const warning = guest.rsvpSubmittedAt
      ? "\n\nThey have already replied — that answer goes too."
      : "";
    const ok = window.confirm(
      `Remove ${guest.name} from party ${party.code}?${warning}`
    );
    if (!ok) return;

    setBusyId(guest.id);
    setError("");
    try {
      const res = await fetch(`/api/admin/guests/${guest.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to remove guest");
        return;
      }
      setParties((prev) =>
        prev.map((p) =>
          p.id === party.id
            ? { ...p, guests: p.guests.filter((g) => g.id !== guest.id) }
            : p
        )
      );
    } catch {
      setError("Failed to remove guest");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className="admin-stats">
        <Stat value={stats.parties} label="Parties" />
        <Stat value={stats.guests} label="Guests" />
        <Stat value={stats.attending} label="Attending" />
        <Stat value={stats.declined} label="Declined" />
        <Stat value={stats.awaiting} label="Awaiting" />
        <Stat
          value={`${stats.partiesReplied}/${stats.parties}`}
          label="Parties replied"
        />
      </div>

      {showComposer ? (
        <form onSubmit={createParty} className="admin-card space-y-2">
          <p className="font-heading text-sm text-ivy-dark">Add a party</p>

          <div>
            <label className="admin-label">Email (optional)</label>
            <input
              className="admin-input"
              type="email"
              placeholder="They can add this when they RSVP"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="admin-label">Guests — one per line</label>
            <textarea
              ref={namesRef}
              className="admin-input min-h-[72px] resize-y"
              placeholder={"Ada Lovelace\nCharles Babbage"}
              value={newNames}
              onChange={(e) => setNewNames(e.target.value)}
              autoFocus
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div>
              <label className="admin-label">Code</label>
              <CodeReel
                code={drawnCode}
                value={codeValue}
                onChange={setCodeValue}
                disabled={creating}
              />
            </div>
            <p className="font-body text-xs text-bark-light self-end pb-1.5">
              {drawnCode
                ? "Drawn and ready. Type over it if you need a particular one."
                : "Drawing a code…"}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="admin-btn"
              disabled={creating || !newNames.trim()}
            >
              {creating ? "Creating…" : "Create party"}
            </button>
            <button
              type="button"
              className="admin-btn"
              data-variant="ghost"
              onClick={() => setShowComposer(false)}
            >
              Done
            </button>
          </div>
        </form>
      ) : (
        <button className="admin-btn mb-3" onClick={openComposer}>
          Add a party
        </button>
      )}

      <div className="flex flex-wrap gap-2 items-center mb-4">
        <div className="admin-tabs !mb-0 !pb-0">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              className="admin-tab"
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <input
          className="admin-input flex-1 min-w-[12rem]"
          placeholder="Search name, code or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="admin-btn"
          data-variant="ghost"
          onClick={exportCsv}
          disabled={visible.length === 0}
        >
          Download CSV
        </button>
      </div>

      {error && <p className="font-body text-sm text-accent-red mb-3">{error}</p>}

      {visible.length === 0 ? (
        <Empty>No parties match that.</Empty>
      ) : (
        visible.map((filteredParty) => {
          const isEditing = editing === filteredParty.id;
          /** Made in this sitting, so it stays pinned to the top. */
          const isNew = justCreated.includes(filteredParty.id);
          // Managing a party always works on the whole party. `visible` has
          // already dropped the guests the filter excluded, and adding or
          // removing against that shortened list would misjudge how many
          // guests are really left.
          const party = isEditing
            ? parties.find((p) => p.id === filteredParty.id) || filteredParty
            : filteredParty;
          const draft = partyDrafts[party.id] || {
            code: party.code,
            email: party.email || "",
          };
          const partyDirty =
            draft.code !== party.code || draft.email !== (party.email || "");
          // Deleting the last guest would strand the party, so the row offers
          // the party delete instead.
          const canRemoveGuests = party.guests.length > 1;

          return (
            <div key={party.id} className="admin-card">
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
                <div className="flex items-baseline gap-3">
                  <span className="admin-code">{party.code}</span>
                  {isNew && <Pill status="yes">New</Pill>}
                  <span className="font-body text-sm text-bark-light">
                    {party.email || "no email yet"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-body text-xs text-bark-light">
                    {party.guests.length}{" "}
                    {party.guests.length === 1 ? "guest" : "guests"}
                  </span>
                  <button
                    className="admin-btn"
                    data-variant="ghost"
                    onClick={() => setEditing(isEditing ? null : party.id)}
                  >
                    {isEditing ? "Done" : "Manage"}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {party.guests.map((guest) => (
                  <div
                    key={guest.id}
                    className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-gold-pale/50 pt-2 first:border-t-0 first:pt-0"
                  >
                    {isEditing ? (
                      <input
                        className="admin-input w-auto flex-1 min-w-[9rem]"
                        defaultValue={guest.name}
                        disabled={busyId === guest.id}
                        // Committed on blur rather than per keystroke: a name
                        // is edited once, and this avoids a request per letter.
                        onBlur={(e) =>
                          renameGuest(party, guest, e.target.value)
                        }
                      />
                    ) : (
                      <span className="font-heading text-sm text-ivy-dark">
                        {guest.name}
                      </span>
                    )}

                    {guest.attending === null ? (
                      <Pill status="pending">Awaiting</Pill>
                    ) : guest.attending ? (
                      <Pill status="yes">Attending</Pill>
                    ) : (
                      <Pill status="no">Declined</Pill>
                    )}

                    {guest.dietaryRequirements && (
                      <span className="font-body text-xs text-accent-burgundy">
                        🍽 {guest.dietaryRequirements}
                      </span>
                    )}

                    {guest.drinks.length > 0 && (
                      <span className="font-body text-xs text-bark-light">
                        {guest.drinks
                          .map((d) => `${d.emoji} ${d.name}`)
                          .join(" · ")}
                      </span>
                    )}

                    {isEditing ? (
                      <button
                        className="admin-btn ml-auto"
                        data-variant="danger"
                        disabled={busyId === guest.id || !canRemoveGuests}
                        title={
                          canRemoveGuests
                            ? undefined
                            : "The only guest — delete the party instead"
                        }
                        onClick={() => deleteGuest(party, guest)}
                      >
                        Remove
                      </button>
                    ) : (
                      <span className="font-body text-xs text-bark-light/70 ml-auto">
                        {guest.rsvpSubmittedAt
                          ? formatDateTime(guest.rsvpSubmittedAt)
                          : "—"}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {isEditing && (
                <div className="mt-3 pt-3 border-t border-gold-pale/50 space-y-2">
                  <div className="flex flex-wrap gap-2 items-end">
                    <div>
                      <label className="admin-label">Code</label>
                      <input
                        className="admin-input admin-code-input"
                        maxLength={4}
                        value={draft.code}
                        onChange={(e) =>
                          setPartyDrafts((prev) => ({
                            ...prev,
                            [party.id]: {
                              ...draft,
                              code: e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 4),
                            },
                          }))
                        }
                      />
                    </div>
                    <div className="flex-1 min-w-[12rem]">
                      <label className="admin-label">Email</label>
                      <input
                        className="admin-input"
                        type="email"
                        value={draft.email}
                        onChange={(e) =>
                          setPartyDrafts((prev) => ({
                            ...prev,
                            [party.id]: { ...draft, email: e.target.value },
                          }))
                        }
                      />
                    </div>
                    <button
                      className="admin-btn"
                      disabled={busyId === party.id || !partyDirty}
                      onClick={() => saveParty(party)}
                    >
                      Save
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 items-end">
                    <div className="flex-1 min-w-[12rem]">
                      <label className="admin-label">Add a guest</label>
                      <input
                        className="admin-input"
                        placeholder="Name"
                        value={guestNameDrafts[party.id] || ""}
                        onChange={(e) =>
                          setGuestNameDrafts((prev) => ({
                            ...prev,
                            [party.id]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addGuest(party);
                          }
                        }}
                      />
                    </div>
                    <button
                      className="admin-btn"
                      disabled={
                        busyId === party.id ||
                        !(guestNameDrafts[party.id] || "").trim()
                      }
                      onClick={() => addGuest(party)}
                    >
                      Add
                    </button>
                    <button
                      className="admin-btn ml-auto"
                      data-variant="danger"
                      disabled={busyId === party.id}
                      onClick={() => deleteParty(party)}
                    >
                      Delete party
                    </button>
                  </div>

                  <p className="font-body text-xs text-bark-light">
                    Showing every guest in this party while you manage it, even
                    if a filter is on.
                  </p>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
