import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/adminAuth";

/**
 * GET /api/admin/questions
 * Full question list (name, email, category, answer) — admin only.
 */
export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const questions = await prisma.question.findMany({
      orderBy: [{ isAnswered: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Error fetching admin questions:", error);
    return NextResponse.json(
      { error: "Failed to load questions" },
      { status: 500 }
    );
  }
}
