import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/rsvp/verify?code=1234
 * Verify an invitation code and return the party with its named guests.
 */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code || code.length !== 4) {
    return NextResponse.json(
      { error: "Please provide a valid 4-digit code" },
      { status: 400 }
    );
  }

  try {
    const party = await prisma.party.findUnique({
      where: { code },
      select: {
        id: true,
        code: true,
        email: true,
        guests: {
          select: {
            id: true,
            name: true,
            attending: true,
            dietaryRequirements: true,
            rsvpSubmittedAt: true,
            drinkVotes: { select: { drinkId: true } },
          },
        },
      },
    });

    if (!party) {
      return NextResponse.json(
        { error: "Code not found. Please check your invitation and try again." },
        { status: 404 }
      );
    }

    return NextResponse.json({ party });
  } catch (error) {
    console.error("Error verifying code:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

