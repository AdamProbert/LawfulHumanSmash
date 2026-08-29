"use client";

import { useMemo, useState } from "react";
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
 * each guest's RSVP state, dietary note and drink picks. Read-only — RSVPs are
 * the guests' to change, and a code is only useful if it matches the printed
 * invitation.
 */
export default function GuestsTab({ parties }: { parties: AdminParty[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

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
      });
  }, [parties, filter, search]);

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

      {visible.length === 0 ? (
        <Empty>No parties match that.</Empty>
      ) : (
        visible.map((party) => (
          <div key={party.id} className="admin-card">
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
              <div className="flex items-baseline gap-3">
                <span className="admin-code">{party.code}</span>
                <span className="font-body text-sm text-bark-light">
                  {party.email || "no email yet"}
                </span>
              </div>
              <span className="font-body text-xs text-bark-light">
                {party.guests.length}{" "}
                {party.guests.length === 1 ? "guest" : "guests"}
              </span>
            </div>

            <div className="space-y-2">
              {party.guests.map((guest) => (
                <div
                  key={guest.id}
                  className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-gold-pale/50 pt-2 first:border-t-0 first:pt-0"
                >
                  <span className="font-heading text-sm text-ivy-dark">
                    {guest.name}
                  </span>

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

                  <span className="font-body text-xs text-bark-light/70 ml-auto">
                    {guest.rsvpSubmittedAt
                      ? formatDateTime(guest.rsvpSubmittedAt)
                      : "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
