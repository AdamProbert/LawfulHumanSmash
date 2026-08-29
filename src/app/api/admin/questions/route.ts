import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

/** Byline stored on FAQs we write ourselves rather than a guest asking. */
const ADMIN_AUTHOR = "Adam & Mady";

/**
 * GET /api/admin/questions
 * Full question list (name, email, category, answer, visibility). Admin only.
 * Unanswered guest questions float to the top: they are the work queue.
 */
export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const questions = await prisma.question.findMany({
      orderBy: [
        { isAnswered: "asc" },
        { sortOrder: "asc" },
        { createdAt: "desc" },
      ],
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

/**
 * POST /api/admin/questions
 * Write our own Q&A entry. It is marked source "admin" so the panel never
 * offers to email an asker back, and it goes live immediately if it has an
 * answer.
 *
 * Body: { question: string, answer?: string, category?: string, isHidden?: boolean }
 */
export async function POST(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const question = (body.question || "").trim();
    const answer = (body.answer || "").trim();

    if (!question) {
      return NextResponse.json(
        { error: "A question is required" },
        { status: 400 }
      );
    }

    const created = await prisma.question.create({
      data: {
        name: ADMIN_AUTHOR,
        email: null,
        question,
        answer: answer || null,
        category: body.category || "uncategorized",
        isAnswered: answer.length > 0,
        isHidden: Boolean(body.isHidden),
        source: "admin",
      },
    });

    return NextResponse.json({ question: created }, { status: 201 });
  } catch (error) {
    console.error("Error creating question:", error);
    return NextResponse.json(
      { error: "Failed to add question" },
      { status: 500 }
    );
  }
}
