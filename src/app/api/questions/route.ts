import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendQuestionAskedNotificationEmail } from "@/lib/email";

/**
 * GET /api/questions
 * Publicly lists answered questions only. Asker name/email are internal and
 * never returned here.
 * Query params: ?category=accommodation (optional filter)
 */
export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category");

  try {
    const questions = await prisma.question.findMany({
      where: {
        isAnswered: true,
        ...(category && category !== "all" ? { category } : {}),
      },
      select: {
        id: true,
        question: true,
        answer: true,
        category: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "Failed to load questions" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/questions
 * Submit a new question. The name is logged internally (e.g. from a cached
 * RSVP) but is never shown on the public Q&A page. Category defaults to
 * "uncategorized" until an admin assigns one.
 *
 * Body: { name: string, email?: string, question: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, question } = body;

    if (!name || !question) {
      return NextResponse.json(
        { error: "Missing required fields: name and question" },
        { status: 400 }
      );
    }

    const newQuestion = await prisma.question.create({
      data: {
        name,
        email: email || null,
        question,
      },
    });

    // Notify us so we can go and answer it. A mail failure must not fail the
    // guest's submission; the question is already saved.
    try {
      await sendQuestionAskedNotificationEmail({ name, email, question });
    } catch (emailError) {
      console.error("Failed to send question notification email:", emailError);
    }

    return NextResponse.json({ question: newQuestion }, { status: 201 });
  } catch (error) {
    console.error("Error creating question:", error);
    return NextResponse.json(
      { error: "Failed to submit question" },
      { status: 500 }
    );
  }
}
