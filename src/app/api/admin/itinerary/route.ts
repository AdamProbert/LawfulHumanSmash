import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/adminAuth";
import { DEFAULT_SET_LIST, parseTimeToMinutes } from "@/lib/itinerary";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/itinerary
 * The full running order, hidden rows included. On an empty table it seeds the
 * previously hardcoded set list, so the first visit to the tab has something
 * to edit rather than a blank page.
 */
export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const count = await prisma.itinerarySlot.count();
    if (count === 0) {
      await prisma.itinerarySlot.createMany({ data: DEFAULT_SET_LIST });
    }

    const slots = await prisma.itinerarySlot.findMany({
      orderBy: [{ atMinutes: "asc" }, { createdAt: "asc" }],
    });
    return NextResponse.json({ slots });
  } catch (error) {
    console.error("Error fetching itinerary:", error);
    return NextResponse.json(
      { error: "Failed to load itinerary" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/itinerary
 * Add a slot. `atMinutes` is derived from the display time unless given.
 * Body: { time, title, kind?, tone?, billing?, description?, atMinutes? }
 */
export async function POST(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const time = (body.time || "").trim();
    const title = (body.title || "").trim();

    if (!time || !title) {
      return NextResponse.json(
        { error: "A time and a title are required" },
        { status: 400 }
      );
    }

    const atMinutes =
      typeof body.atMinutes === "number"
        ? body.atMinutes
        : parseTimeToMinutes(time);
    if (atMinutes === null) {
      return NextResponse.json(
        { error: `Could not read "${time}" as a time. Try 7:40 or 7:40pm.` },
        { status: 400 }
      );
    }

    const slot = await prisma.itinerarySlot.create({
      data: {
        atMinutes,
        time,
        title,
        kind: body.kind === "act" ? "act" : "interstitial",
        tone: ["day", "dusk", "night"].includes(body.tone) ? body.tone : "day",
        billing: body.billing?.trim() || null,
        description: (body.description || "").trim(),
        isVisible: body.isVisible !== false,
      },
    });

    return NextResponse.json({ slot }, { status: 201 });
  } catch (error) {
    console.error("Error creating itinerary slot:", error);
    return NextResponse.json({ error: "Failed to add slot" }, { status: 500 });
  }
}
