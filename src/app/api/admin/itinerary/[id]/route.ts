import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/adminAuth";
import { parseTimeToMinutes } from "@/lib/itinerary";

/**
 * PATCH /api/admin/itinerary/:id
 * Body: any subset of { time, title, kind, tone, billing, description, isVisible }.
 * Changing the display time re-derives atMinutes, keeping the running order
 * and the "Now" marker in step with what guests read.
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
    const data: Record<string, unknown> = {};

    if (body.time !== undefined) {
      const time = String(body.time).trim();
      const atMinutes = parseTimeToMinutes(time);
      if (atMinutes === null) {
        return NextResponse.json(
          { error: `Could not read "${time}" as a time. Try 7:40 or 7:40pm.` },
          { status: 400 }
        );
      }
      data.time = time;
      data.atMinutes = atMinutes;
    }
    if (body.title !== undefined) {
      const title = String(body.title).trim();
      if (!title) {
        return NextResponse.json({ error: "Title is required" }, { status: 400 });
      }
      data.title = title;
    }
    if (body.kind !== undefined) {
      data.kind = body.kind === "act" ? "act" : "interstitial";
    }
    if (body.tone !== undefined && ["day", "dusk", "night"].includes(body.tone)) {
      data.tone = body.tone;
    }
    if (body.billing !== undefined) {
      data.billing = String(body.billing).trim() || null;
    }
    if (body.description !== undefined) {
      data.description = String(body.description).trim();
    }
    if (body.isVisible !== undefined) {
      data.isVisible = Boolean(body.isVisible);
    }

    const slot = await prisma.itinerarySlot.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json({ slot });
  } catch (error) {
    console.error("Error updating itinerary slot:", error);
    return NextResponse.json({ error: "Failed to save slot" }, { status: 500 });
  }
}

/** DELETE /api/admin/itinerary/:id */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.itinerarySlot.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting itinerary slot:", error);
    return NextResponse.json({ error: "Failed to delete slot" }, { status: 500 });
  }
}
