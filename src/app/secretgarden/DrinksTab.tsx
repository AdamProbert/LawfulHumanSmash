"use client";

import { useMemo, useState } from "react";
import type { AdminDrink } from "./types";
import { datedFilename, downloadCsv } from "./csv";
import { Empty, Pill, Stat } from "./ui";

/**
 * The drink vote, broken down. The public wheel only shows totals; this shows
 * who picked what, so the bar order can account for who is actually coming.
 */
export default function DrinksTab({ drinks }: { drinks: AdminDrink[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  // Declined guests keep their votes in the database; counting them would
  // over-order for people who are not coming.
  const [attendingOnly, setAttendingOnly] = useState(false);

  const rows = useMemo(() => {
    const counted = drinks.map((drink) => {
      const voters = attendingOnly
        ? drink.voters.filter((v) => v.attending === true)
        : drink.voters;
      return { ...drink, voters, voteCount: voters.length };
    });
    return counted.sort(
      (a, b) => b.voteCount - a.voteCount || a.name.localeCompare(b.name)
    );
  }, [drinks, attendingOnly]);

  const totalVotes = rows.reduce((sum, d) => sum + d.voteCount, 0);
  const topCount = rows[0]?.voteCount || 0;
  const distinctVoters = new Set(
    rows.flatMap((d) => d.voters.map((v) => v.guestId))
  ).size;

  // Totals only, in the order they are ranked on screen: the export is the
  // order for the bar, not a record of who voted. Drinks nobody picked still
  // get a row, so a zero never looks like an omission.
  const exportCsv = () => {
    const csvRows: unknown[][] = [
      ["Drink", "Votes"],
      ...rows.map((drink) => [`${drink.emoji} ${drink.name}`, drink.voteCount]),
    ];
    downloadCsv(
      datedFilename(attendingOnly ? "drink-totals-attending" : "drink-totals"),
      csvRows
    );
  };

  return (
    <div>
      <div className="admin-stats">
        <Stat value={totalVotes} label="Votes cast" />
        <Stat value={distinctVoters} label="Guests voted" />
        <Stat value={rows.length} label="Options" />
        <Stat value={rows[0]?.name || "—"} label="Front runner" />
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <label className="flex items-center gap-2 font-body text-sm text-bark-light cursor-pointer">
          <input
            type="checkbox"
            checked={attendingOnly}
            onChange={(e) => setAttendingOnly(e.target.checked)}
          />
          Count attending guests only
        </label>
        <button
          className="admin-btn ml-auto"
          data-variant="ghost"
          onClick={exportCsv}
          disabled={rows.length === 0}
        >
          Download CSV
        </button>
      </div>

      {rows.length === 0 ? (
        <Empty>No drink options yet.</Empty>
      ) : (
        rows.map((drink) => {
          const share = topCount ? (drink.voteCount / topCount) * 100 : 0;
          const isOpen = expanded === drink.id;

          return (
            <div key={drink.id} className="admin-card">
              <button
                className="w-full text-left"
                onClick={() => setExpanded(isOpen ? null : drink.id)}
                aria-expanded={isOpen}
              >
                <div className="flex items-baseline gap-2 mb-1.5">
                  <span className="font-heading text-base text-ivy-dark">
                    {drink.emoji} {drink.name}
                  </span>
                  <span className="font-body text-sm text-gold-dark ml-auto tabular-nums">
                    {drink.voteCount}{" "}
                    {drink.voteCount === 1 ? "vote" : "votes"}
                  </span>
                  <span className="font-body text-xs text-bark-light">
                    {isOpen ? "▲" : "▼"}
                  </span>
                </div>
                <div className="admin-bar">
                  <span
                    style={{
                      width: `${share}%`,
                      background: drink.color,
                    }}
                  />
                </div>
              </button>

              {isOpen && (
                <div className="mt-3 pt-3 border-t border-gold-pale/50">
                  {drink.voters.length === 0 ? (
                    <p className="font-body text-sm text-bark-light">
                      Nobody has voted for this one.
                    </p>
                  ) : (
                    <ul className="space-y-1.5">
                      {drink.voters.map((voter) => (
                        <li
                          key={voter.guestId}
                          className="flex flex-wrap items-center gap-2"
                        >
                          <span className="font-body text-sm text-bark">
                            {voter.name}
                          </span>
                          <span className="admin-code text-xs">
                            {voter.partyCode}
                          </span>
                          {voter.attending === true ? (
                            <Pill status="yes">Attending</Pill>
                          ) : voter.attending === false ? (
                            <Pill status="no">Declined</Pill>
                          ) : (
                            <Pill status="pending">Awaiting</Pill>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
