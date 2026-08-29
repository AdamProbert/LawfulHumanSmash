import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { drawUnusedPartyCode } from "@/lib/partyCodes";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/parties/new-code
 * A 4-digit code no party currently holds, for the composer to show before
 * anything is saved. Nothing is reserved: the create call checks again, and
 * the panel redraws if the code was taken in the meantime.
 */
export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const code = await drawUnusedPartyCode();
    if (!code) {
      return NextResponse.json(
        { error: "No codes left. Free one up first." },
        { status: 409 }
      );
    }
    return NextResponse.json({ code });
  } catch (error) {
    console.error("Error drawing a party code:", error);
    return NextResponse.json(
      { error: "Failed to draw a code" },
      { status: 500 }
    );
  }
}
