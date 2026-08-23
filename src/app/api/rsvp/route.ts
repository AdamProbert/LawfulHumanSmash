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

    await prisma.party.update({
      where: { id: partyId },
      data: { email: email || null },
    });

    const guestNames = new Map<string, string>(
      (
        await prisma.guest.findMany({
          where: { partyId },
          select: { id: true, name: true },
        })
      ).map((g): [string, string] => [g.id, g.name])
    );

    for (const g of guests) {
      if (typeof g.guestId !== "string" || typeof g.attending !== "boolean") {
        continue;
      }

      await prisma.guest.update({
        where: { id: g.guestId },
        data: {
          attending: g.attending,
          dietaryRequirements: g.attending
            ? g.dietaryRequirements || null
            : null,
          rsvpSubmittedAt: new Date(),
        },
      });

      await prisma.drinkVote.deleteMany({ where: { guestId: g.guestId } });

      if (g.attending && Array.isArray(g.drinkVotes)) {
        for (const drinkId of g.drinkVotes.slice(0, 3)) {
          await prisma.drinkVote.create({
            data: { guestId: g.guestId, drinkId },
          });
        }
      }
    }

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

