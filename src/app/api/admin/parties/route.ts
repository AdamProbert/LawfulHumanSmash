import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/parties
 * Every party with its activation code, contact email and guests, including
 * each guest's RSVP state, dietary note and drink picks. Admin only — this is
 * the whole guest list.
 */
export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const parties = await prisma.party.findMany({
      select: {
        id: true,
        code: true,
        email: true,
        createdAt: true,
        guests: {
          select: {
            id: true,
            name: true,
            attending: true,
            dietaryRequirements: true,
            rsvpSubmittedAt: true,
            drinkVotes: {
              select: { drink: { select: { id: true, name: true, emoji: true } } },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { code: "asc" },
    });

    // Flatten each guest's votes to the drink itself; the join row carries
    // nothing the admin panel needs.
    const shaped = parties.map((party) => ({
      ...party,
      guests: party.guests.map((guest) => ({
        ...guest,
        drinks: guest.drinkVotes.map((v) => v.drink),
        drinkVotes: undefined,
      })),
    }));

    return NextResponse.json({ parties: shaped });
  } catch (error) {
    console.error("Error fetching admin parties:", error);
    return NextResponse.json(
      { error: "Failed to load parties" },
      { status: 500 }
    );
  }
}
