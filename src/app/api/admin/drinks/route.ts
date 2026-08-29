import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/drinks
 * Every drink option with its vote count and, unlike the public endpoint, the
 * name and party code of everyone who voted for it. Admin only.
 */
export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const drinks = await prisma.drinkOption.findMany({
      select: {
        id: true,
        name: true,
        emoji: true,
        color: true,
        votes: {
          select: {
            createdAt: true,
            guest: {
              select: {
                id: true,
                name: true,
                attending: true,
                party: { select: { code: true } },
              },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    const shaped = drinks
      .map((drink) => ({
        id: drink.id,
        name: drink.name,
        emoji: drink.emoji,
        color: drink.color,
        voteCount: drink.votes.length,
        voters: drink.votes
          .map((vote) => ({
            guestId: vote.guest.id,
            name: vote.guest.name,
            attending: vote.guest.attending,
            partyCode: vote.guest.party.code,
            votedAt: vote.createdAt,
          }))
          .sort((a, b) => a.name.localeCompare(b.name)),
      }))
      // Most popular first: the whole point of the tab is the ranking.
      .sort((a, b) => b.voteCount - a.voteCount || a.name.localeCompare(b.name));

    return NextResponse.json({ drinks: shaped });
  } catch (error) {
    console.error("Error fetching admin drinks:", error);
    return NextResponse.json({ error: "Failed to load drinks" }, { status: 500 });
  }
}
