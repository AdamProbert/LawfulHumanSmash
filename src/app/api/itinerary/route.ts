import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_SET_LIST } from "@/lib/itinerary";

// The running order is editable from /secretgarden while the site is live, so
// it must never be frozen into the build.
export const dynamic = "force-dynamic";

/**
 * GET /api/itinerary
 * The public running order: visible slots only, in time order. Falls back to
 * the built-in set list while the table is still empty.
 */
export async function GET() {
  try {
    const slots = await prisma.itinerarySlot.findMany({
      where: { isVisible: true },
      select: {
        id: true,
        atMinutes: true,
        time: true,
        title: true,
        kind: true,
        tone: true,
        billing: true,
        description: true,
      },
      orderBy: [{ atMinutes: "asc" }, { createdAt: "asc" }],
    });

    if (slots.length === 0) {
      return NextResponse.json({
        slots: DEFAULT_SET_LIST.map((slot, i) => ({
          ...slot,
          id: `default-${i}`,
        })),
      });
    }

    return NextResponse.json({ slots });
  } catch (error) {
    console.error("Error fetching itinerary:", error);
    return NextResponse.json(
      { error: "Failed to load itinerary" },
      { status: 500 }
    );
  }
}
