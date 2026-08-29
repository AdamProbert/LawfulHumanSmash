import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/adminAuth";

/**
 * POST /api/admin/parties/:id/guests
 * Add a guest to an existing party — a plus-one, or a child who was missed.
 *
 * Body: { name: string }
 * The guest starts with no RSVP, so they show as awaiting a reply and the
 * party can answer for them the next time they enter their code.
 */
export async function POST(
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

    const party = await prisma.party.findUnique({ where: { id: params.id } });
    if (!party) {
      return NextResponse.json({ error: "Party not found" }, { status: 404 });
    }

    const guest = await prisma.guest.create({
      data: { name, partyId: params.id },
      select: {
        id: true,
        name: true,
        attending: true,
        dietaryRequirements: true,
        rsvpSubmittedAt: true,
      },
    });

    return NextResponse.json({ guest: { ...guest, drinks: [] } }, { status: 201 });
  } catch (error) {
    console.error("Error adding guest:", error);
    return NextResponse.json({ error: "Failed to add guest" }, { status: 500 });
  }
}
