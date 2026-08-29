import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/** The 4-digit code printed on an invitation and typed in at /rsvp. */
export const PARTY_CODE_PATTERN = /^\d{4}$/;

/** How many times to re-draw when a chosen code turns out to be taken. */
const MAX_ATTEMPTS = 25;

/**
 * A 4-digit code not in `taken`.
 *
 * Codes are drawn from 1000–9999 rather than being sequential so one party
 * cannot guess another's from their own, and leading zeros are avoided so a
 * code never loses a digit in a spreadsheet.
 */
function pickCode(taken: Set<string>): string | null {
  if (taken.size >= 9000) return null;

  // Random probing is cheap while the list is small relative to the space.
  for (let attempt = 0; attempt < 200; attempt++) {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    if (!taken.has(code)) return code;
  }

  // Densely populated: scan deterministically so a free code is still found
  // rather than wrongly reported as unavailable.
  for (let code = 1000; code <= 9999; code++) {
    const candidate = code.toString();
    if (!taken.has(candidate)) return candidate;
  }

  return null;
}

/**
 * Draw a code that no party currently holds, without reserving it.
 *
 * Used to fill the composer's box the moment it opens, so a code is on screen
 * before the party is created. Nothing is written, so the code can in
 * principle be taken by another admin in the meantime — the create call
 * validates it again and the caller redraws if it lost the race.
 */
export async function drawUnusedPartyCode(): Promise<string | null> {
  const existing = await prisma.party.findMany({ select: { code: true } });
  return pickCode(new Set(existing.map((p) => p.code)));
}

/** True for Prisma's "unique constraint failed" on the party code. */
function isCodeCollision(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

/**
 * Run `write` with a freshly generated, unused party code.
 *
 * Reading the used codes and then inserting is not atomic, so two admins
 * saving at the same moment could pick the same number. Rather than widen the
 * window, this lets the database's unique constraint be the referee: a
 * collision is caught and the write retried with another code. Returns null
 * only if no free code exists at all.
 */
export async function createPartyCode<T>(
  write: (code: string) => Promise<T>
): Promise<T | null> {
  const existing = await prisma.party.findMany({ select: { code: true } });
  const taken = new Set(existing.map((p) => p.code));

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const code = pickCode(taken);
    if (!code) return null;

    try {
      return await write(code);
    } catch (error) {
      if (!isCodeCollision(error)) throw error;
      // Someone else took it between the read and the write; remember that and
      // draw again.
      taken.add(code);
    }
  }

  return null;
}
