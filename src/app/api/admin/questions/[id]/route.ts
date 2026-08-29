import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/adminAuth";
import { sendQuestionAnsweredEmail } from "@/lib/email";

/**
 * PATCH /api/admin/questions/:id
 * Body: any subset of { question, answer, isHidden }.
 * Setting a non-empty answer marks the question answered and, if a guest asked
 * it and left an email, sends them a notification the first time.
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
    const { question, answer, isHidden } = body;

    const existing = await prisma.question.findUnique({
      where: { id: params.id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    // Only recompute answered-ness when the answer itself is in play, so a
    // visibility toggle on its own cannot un-answer a question.
    const answerTouched = answer !== undefined;
    const willBeAnswered = answerTouched
      ? typeof answer === "string" && answer.trim().length > 0
      : existing.isAnswered;

    const updated = await prisma.question.update({
      where: { id: params.id },
      data: {
        ...(question !== undefined && String(question).trim()
          ? { question: String(question).trim() }
          : {}),
        ...(answerTouched ? { answer, isAnswered: willBeAnswered } : {}),
        ...(isHidden !== undefined ? { isHidden: Boolean(isHidden) } : {}),
      },
    });

    if (
      willBeAnswered &&
      !existing.isAnswered &&
      existing.email &&
      existing.source !== "admin"
    ) {
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

/**
 * DELETE /api/admin/questions/:id
 * Permanent. Hiding is the reversible option; this is for spam and mistakes.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.question.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting question:", error);
    return NextResponse.json(
      { error: "Failed to delete question" },
      { status: 500 }
    );
  }
}
