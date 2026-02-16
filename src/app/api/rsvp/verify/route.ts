import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/rsvp/verify?code=1234
 * Verify a guest's 4-digit invitation code.
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
    const guest = await prisma.guest.findUnique({
      where: { code },
      select: {
        id: true,
        name: true,
        code: true,
        attending: true,
        rsvpSubmittedAt: true,
      },
    });

    if (!guest) {
      return NextResponse.json(
        { error: "Code not found. Please check your invitation and try again." },
        { status: 404 }
      );
    }

    return NextResponse.json({ guest });
  } catch (error) {
    console.error("Error verifying code:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
