import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendRsvpThankYouEmail } from "@/lib/email";

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

    const party = await prisma.party.findUnique({ where: { id: partyId } });
    if (!party) {
      return NextResponse.json({ error: "Party not found" }, { status: 404 });
    }

    const [, partyGuests] = await Promise.all([
      prisma.party.update({
        where: { id: partyId },
        data: { email: email || null },
      }),
      prisma.guest.findMany({
        where: { partyId },
        select: { id: true, name: true },
      }),
    ]);

    const guestNames = new Map<string, string>(
      partyGuests.map((g): [string, string] => [g.id, g.name])
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

    if (email) {
      try {
        await sendRsvpThankYouEmail(
          email,
          guests
            .filter((g): g is GuestRSVP => typeof g.guestId === "string")
            .map((g) => ({
              name: guestNames.get(g.guestId) || "Guest",
              attending: g.attending,
            })),
          party.code
        );
      } catch (emailError) {
        console.error("Failed to send RSVP thank-you email:", emailError);
      }
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

