import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  sendRsvpNotificationEmail,
  sendRsvpThankYouEmail,
} from "@/lib/email";

/** Loose sanity check only; the confirmation email is the real validation. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface GuestRSVP {
  guestId: string;
  attending: boolean;
  dietaryRequirements?: string | null;
  drinkVotes?: string[];
}

/**
 * POST /api/rsvp
 * Submit an RSVP for every guest in a party.
 *
 * Body: {
 *   partyId: string,
 *   email?: string,
 *   guests: GuestRSVP[]
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { partyId, email, guests } = body as {
      partyId: string;
      email?: string;
      guests: GuestRSVP[];
    };

    if (!partyId || !Array.isArray(guests) || guests.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields: partyId and guests" },
        { status: 400 }
      );
    }

    // Every RSVP needs a reachable address: it is the only confirmation the
    // guest gets, and our only way to reach them before the day.
    const trimmedEmail = (email || "").trim();
    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      return NextResponse.json(
        { error: "Please enter an email address so we can confirm your RSVP" },
        { status: 400 }
      );
    }

    const party = await prisma.party.findUnique({ where: { id: partyId } });
    if (!party) {
      return NextResponse.json({ error: "Party not found" }, { status: 404 });
    }

    // Names for the drinks this party voted for, so the notification email can
    // spell them out rather than listing opaque ids.
    const votedDrinkIds = Array.from(
      new Set(
        guests.flatMap((g) =>
          Array.isArray(g.drinkVotes) ? g.drinkVotes.slice(0, 3) : []
        )
      )
    );

    const [, partyGuests, drinkOptions] = await Promise.all([
      prisma.party.update({
        where: { id: partyId },
        data: { email: trimmedEmail },
      }),
      prisma.guest.findMany({
        where: { partyId },
        select: { id: true, name: true, rsvpSubmittedAt: true },
      }),
      votedDrinkIds.length
        ? prisma.drinkOption.findMany({
            where: { id: { in: votedDrinkIds } },
            select: { id: true, name: true, emoji: true },
          })
        : Promise.resolve([]),
    ]);

    const guestNames = new Map<string, string>(
      partyGuests.map((g): [string, string] => [g.id, g.name])
    );

    // Read before the transaction below stamps a fresh rsvpSubmittedAt on
    // everyone: any existing stamp means this party is changing an answer
    // rather than replying for the first time.
    const previousSubmission = partyGuests
      .map((g) => g.rsvpSubmittedAt)
      .filter((d): d is Date => d !== null)
      .sort((a, b) => b.getTime() - a.getTime())[0];

    const drinkLabels = new Map<string, string>(
      drinkOptions.map((d): [string, string] => [d.id, `${d.emoji} ${d.name}`])
    );

    // One round trip for the whole party rather than 3–4 per guest in series.
    const validGuests = guests.filter(
      (g) =>
        typeof g.guestId === "string" && typeof g.attending === "boolean"
    );
    const submittedAt = new Date();

    await prisma.$transaction([
      ...validGuests.map((g) =>
        prisma.guest.update({
          where: { id: g.guestId },
          data: {
            attending: g.attending,
            dietaryRequirements: g.attending
              ? g.dietaryRequirements || null
              : null,
            rsvpSubmittedAt: submittedAt,
          },
        })
      ),
      prisma.drinkVote.deleteMany({
        where: { guestId: { in: validGuests.map((g) => g.guestId) } },
      }),
      prisma.drinkVote.createMany({
        data: validGuests.flatMap((g) =>
          g.attending && Array.isArray(g.drinkVotes)
            ? g.drinkVotes
                .slice(0, 3)
                .map((drinkId) => ({ guestId: g.guestId, drinkId }))
            : []
        ),
        skipDuplicates: true,
      }),
    ]);

    const guestSummaries = validGuests.map((g) => ({
      name: guestNames.get(g.guestId) || "Guest",
      attending: g.attending,
      dietaryRequirements: g.attending ? g.dietaryRequirements || null : null,
      // Mirrors the votes actually stored above, same three-vote cap.
      drinks:
        g.attending && Array.isArray(g.drinkVotes)
          ? g.drinkVotes
              .slice(0, 3)
              .map((id) => drinkLabels.get(id))
              .filter((label): label is string => Boolean(label))
          : [],
    }));

    // Both emails are best-effort: the RSVP itself is already saved, so a mail
    // failure must not fail the request or block the other message.
    const [thankYouResult, notificationResult] = await Promise.allSettled([
      sendRsvpThankYouEmail(trimmedEmail, guestSummaries, party.code),
      sendRsvpNotificationEmail({
        code: party.code,
        email: trimmedEmail,
        guests: guestSummaries,
        previouslySubmittedAt: previousSubmission ?? null,
      }),
    ]);

    if (thankYouResult.status === "rejected") {
      console.error(
        "Failed to send RSVP thank-you email:",
        thankYouResult.reason
      );
    }
    if (notificationResult.status === "rejected") {
      console.error(
        "Failed to send RSVP notification email:",
        notificationResult.reason
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error submitting RSVP:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

