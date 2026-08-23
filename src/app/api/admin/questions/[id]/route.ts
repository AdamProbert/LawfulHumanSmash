import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/adminAuth";
import { sendQuestionAnsweredEmail } from "@/lib/email";

/**
 * PATCH /api/admin/questions/:id
 * Body: { category?: string, answer?: string }
 * Setting a non-empty answer marks the question answered and, if the asker
 * left an email, sends them a notification.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { category, answer } = await request.json();

    const existing = await prisma.question.findUnique({
      where: { id: params.id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    const willBeAnswered = typeof answer === "string" && answer.trim().length > 0;

    const updated = await prisma.question.update({
      where: { id: params.id },
      data: {
        ...(category !== undefined ? { category } : {}),
        ...(answer !== undefined ? { answer } : {}),
        isAnswered: willBeAnswered,
      },
    });

    if (willBeAnswered && !existing.isAnswered && existing.email) {
      try {
        await sendQuestionAnsweredEmail(existing.email, existing.question, answer);
      } catch (emailError) {
        console.error("Failed to send answered-question email:", emailError);
      }
    }

    return NextResponse.json({ question: updated });
  } catch (error) {
    console.error("Error updating question:", error);
    return NextResponse.json(
      { error: "Failed to update question" },
      { status: 500 }
    );
  }
}
