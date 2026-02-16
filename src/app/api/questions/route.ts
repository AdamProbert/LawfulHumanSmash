import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/questions
 * Fetch all questions. Only answered ones are shown publicly.
 * Query params: ?category=accommodation (optional filter)
 */
export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category");

  try {
    const questions = await prisma.question.findMany({
      where: {
        ...(category && category !== "all" ? { category } : {}),
      },
      orderBy: [{ isAnswered: "desc" }, { createdAt: "desc" }],
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
 * Submit a new question.
 *
 * Body: {
 *   name: string,
 *   email?: string,
 *   question: string,
 *   category: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, question, category } = body;

    if (!name || !question || !category) {
      return NextResponse.json(
        { error: "Missing required fields: name, question, category" },
        { status: 400 }
      );
    }

    const newQuestion = await prisma.question.create({
      data: {
        name,
        email: email || null,
        question,
        category,
      },
    });

    return NextResponse.json({ question: newQuestion }, { status: 201 });
  } catch (error) {
    console.error("Error creating question:", error);
    return NextResponse.json(
      { error: "Failed to submit question" },
      { status: 500 }
    );
  }
}
