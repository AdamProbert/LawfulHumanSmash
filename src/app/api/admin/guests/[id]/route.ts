import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/adminAuth";

/**
 * PATCH /api/admin/guests/:id
 * Body: { name }
 *
 * Corrects a spelling or a married name. RSVP answers are deliberately not
 * editable here: they belong to the guest, and the party can always redo them
 * with their code.
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
    const name = String(body.name || "").trim();

    if (!name) {
      return NextResponse.json({ error: "A name is required" }, { status: 400 });
    }

    const guest = await prisma.guest.update({
      where: { id: params.id },
      data: { name },
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
    });

    const { drinkVotes, ...rest } = guest;
    return NextResponse.json({
      guest: { ...rest, drinks: drinkVotes.map((v) => v.drink) },
    });
  } catch (error) {
    console.error("Error updating guest:", error);
    return NextResponse.json(
      { error: "Failed to update guest" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/guests/:id
 * Removes the guest and their drink votes.
 *
 * A party is refused if this would empty it: a party with no guests is
 * unreachable — its code would verify and then show nobody to reply for — so
 * the caller is told to delete the party instead.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const guest = await prisma.guest.findUnique({
      where: { id: params.id },
      select: { id: true, partyId: true },
    });
    if (!guest) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 });
    }

    const siblings = await prisma.guest.count({
      where: { partyId: guest.partyId },
    });
    if (siblings <= 1) {
      return NextResponse.json(
        {
          error:
            "That is the party's only guest. Delete the whole party instead.",
        },
        { status: 409 }
      );
    }

    await prisma.$transaction([
      prisma.drinkVote.deleteMany({ where: { guestId: params.id } }),
      prisma.guest.delete({ where: { id: params.id } }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting guest:", error);
    return NextResponse.json(
      { error: "Failed to delete guest" },
      { status: 500 }
    );
  }
}
