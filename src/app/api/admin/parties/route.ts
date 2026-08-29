import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/adminAuth";
import { PARTY_CODE_PATTERN, createPartyCode } from "@/lib/partyCodes";

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

/**
 * POST /api/admin/parties
 * Create a party and its guests in one go.
 *
 * Body: { code?: string, email?: string, guestNames: string[] }
 *
 * The composer draws a code before the party is saved, so one is usually
 * supplied here; it is validated as free rather than trusted. Without one, a
 * code is generated. Either way two parties can never share a code.
 */
export async function POST(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const guestNames: string[] = Array.isArray(body.guestNames)
      ? body.guestNames
          .map((name: unknown) => String(name).trim())
          .filter((name: string) => name.length > 0)
      : [];

    if (guestNames.length === 0) {
      return NextResponse.json(
        { error: "A party needs at least one guest" },
        { status: 400 }
      );
    }

    const email = String(body.email || "").trim() || null;

    // Shared by both paths so the created party always comes back in the
    // same shape.
    const selection = {
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
        },
        orderBy: { createdAt: "asc" as const },
      },
    };
    const guestData = { create: guestNames.map((name) => ({ name })) };

    let party;
    if (body.code !== undefined) {
      const code = String(body.code).trim();
      if (!PARTY_CODE_PATTERN.test(code)) {
        return NextResponse.json(
          { error: "A code must be exactly 4 digits" },
          { status: 400 }
        );
      }
      const clash = await prisma.party.findUnique({ where: { code } });
      if (clash) {
        // 409 rather than a silent redraw: the caller knows whether this code
        // was typed deliberately or merely drawn, and only it can decide
        // whether swapping it is acceptable.
        return NextResponse.json(
          { error: `Code ${code} is already in use`, codeTaken: true },
          { status: 409 }
        );
      }
      party = await prisma.party.create({
        data: { code, email, guests: guestData },
        select: selection,
      });
    } else {
      party = await createPartyCode((code) =>
        prisma.party.create({
          data: { code, email, guests: guestData },
          select: selection,
        })
      );
    }

    if (!party) {
      return NextResponse.json(
        { error: "Could not find a free code. Try again." },
        { status: 409 }
      );
    }

    // Matches the GET shape so the panel can drop it straight into its list.
    return NextResponse.json(
      {
        party: {
          ...party,
          guests: party.guests.map((g) => ({ ...g, drinks: [] })),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating party:", error);
    return NextResponse.json(
      { error: "Failed to create party" },
      { status: 500 }
    );
  }
}
