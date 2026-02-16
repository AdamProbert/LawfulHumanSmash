import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/rsvp
 * Submit an RSVP for a guest.
 *
 * Body: {
 *   guestId: string,
 *   attending: boolean,
 *   plusOneName?: string,
 *   dietaryRequirements?: string,
 *   drinkVotes?: string[] (array of DrinkOption IDs, max 3)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { guestId, attending, plusOneName, dietaryRequirements, drinkVotes } =
      body;

    if (!guestId || typeof attending !== "boolean") {
      return NextResponse.json(
        { error: "Missing required fields: guestId and attending" },
        { status: 400 }
      );
    }

    // Check guest exists
    const guest = await prisma.guest.findUnique({ where: { id: guestId } });
    if (!guest) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 });
    }

    // Update guest RSVP
    await prisma.guest.update({
      where: { id: guestId },
      data: {
        attending,
        plusOneName: plusOneName || null,
        dietaryRequirements: dietaryRequirements || null,
        rsvpSubmittedAt: new Date(),
      },
    });

    // Handle drink votes (max 3)
    if (attending && drinkVotes && Array.isArray(drinkVotes)) {
      const validVotes = drinkVotes.slice(0, 3);

      // Remove existing votes for this guest
      await prisma.drinkVote.deleteMany({
        where: { guestId },
      });

      // Create new votes
      for (const drinkId of validVotes) {
        await prisma.drinkVote.create({
          data: {
            guestId,
            drinkId,
          },
        });
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
