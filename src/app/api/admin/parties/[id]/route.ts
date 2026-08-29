import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/adminAuth";
import { PARTY_CODE_PATTERN } from "@/lib/partyCodes";

/**
 * PATCH /api/admin/parties/:id
 * Body: any subset of { code, email }.
 *
 * A code is generated when the party is created, but can be overwritten here
 * — to match an invitation that was printed first, say. Uniqueness is still
 * enforced: two parties sharing a code would make /rsvp ambiguous.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data: { code?: string; email?: string | null } = {};

    if (body.code !== undefined) {
      const code = String(body.code).trim();
      if (!PARTY_CODE_PATTERN.test(code)) {
        return NextResponse.json(
          { error: "A code must be exactly 4 digits" },
          { status: 400 }
        );
      }
      const clash = await prisma.party.findUnique({ where: { code } });
      if (clash && clash.id !== params.id) {
        return NextResponse.json(
          { error: `Code ${code} is already used by another party` },
          { status: 409 }
        );
      }
      data.code = code;
    }

    if (body.email !== undefined) {
      data.email = String(body.email).trim() || null;
    }

    const party = await prisma.party.update({
      where: { id: params.id },
      data,
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
    });

    return NextResponse.json({
      party: {
        ...party,
        guests: party.guests.map(({ drinkVotes, ...guest }) => ({
          ...guest,
          drinks: drinkVotes.map((v) => v.drink),
        })),
      },
    });
  } catch (error) {
    console.error("Error updating party:", error);
    return NextResponse.json(
      { error: "Failed to update party" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/parties/:id
 * Removes the party, its guests and their drink votes.
 *
 * The deletes are ordered and wrapped in a transaction because the foreign
 * keys are restrictive by design: nothing here cascades on its own, so losing
 * a guest list can never be a side effect of deleting something else.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const party = await prisma.party.findUnique({
      where: { id: params.id },
      select: { id: true, guests: { select: { id: true } } },
    });
    if (!party) {
      return NextResponse.json({ error: "Party not found" }, { status: 404 });
    }

    const guestIds = party.guests.map((g) => g.id);

    await prisma.$transaction([
      prisma.drinkVote.deleteMany({ where: { guestId: { in: guestIds } } }),
      prisma.guest.deleteMany({ where: { partyId: params.id } }),
      prisma.party.delete({ where: { id: params.id } }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting party:", error);
    return NextResponse.json(
      { error: "Failed to delete party" },
      { status: 500 }
    );
  }
}
