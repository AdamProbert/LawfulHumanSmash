import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Vote counts change while the site is live. Without this, Next prerenders this
// handler at build time and every guest is served the counts frozen at deploy.
export const dynamic = "force-dynamic";

/**
 * GET /api/drinks
 * Fetch all drink options, by default with their vote counts.
 * Used by both the RSVP page (to list options) and the Food & Drinks page (for the wheel).
 *
 * `?counts=0` skips the vote aggregation. The RSVP page only needs the names and
 * emoji to build its picker, and it blocks first paint on this call, so it opts
 * out rather than paying for a scan of the whole votes table.
 */
export async function GET(request: NextRequest) {
  const withCounts = request.nextUrl.searchParams.get("counts") !== "0";

  try {
    // Two explicit queries rather than one with a spread: Prisma infers the row
    // type from the literal argument, and a conditional include/select collapses
    // that inference.
    const drinks = withCounts
      ? await prisma.drinkOption.findMany({
          include: { _count: { select: { votes: true } } },
          orderBy: { name: "asc" },
        })
      : await prisma.drinkOption.findMany({
          select: { id: true, name: true, emoji: true },
          orderBy: { name: "asc" },
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
