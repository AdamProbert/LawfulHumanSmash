import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/drinks
 * Fetch all drink options with their vote counts.
 * Used by both the RSVP page (to list options) and the Food & Drinks page (for the wheel).
 */
export async function GET() {
  try {
    const drinks = await prisma.drinkOption.findMany({
      include: {
        _count: {
          select: { votes: true },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ drinks });
  } catch (error) {
    console.error("Error fetching drinks:", error);
    return NextResponse.json(
      { error: "Failed to load drinks" },
      { status: 500 }
    );
  }
}
