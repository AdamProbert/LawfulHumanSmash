import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Vote counts change while the site is live. Without this, Next prerenders this
// handler at build time and every guest is served the counts frozen at deploy.
export const dynamic = "force-dynamic";

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
