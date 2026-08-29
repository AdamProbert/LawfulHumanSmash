import { PrismaClient } from "@prisma/client";

/**
 * The drinks menu offered on the RSVP vote and the Food & Drinks wheel.
 * Kept apart from the main seed so it can be re-run against production
 * whenever the menu changes, without dragging the sample guest data with it.
 */
export const DRINKS = [
  { name: "Mojito",      emoji: "🌿", color: "#6E9B52" },
  { name: "IPA",         emoji: "🍺", color: "#C87D2A" },
  { name: "Lager",       emoji: "🍻", color: "#D9A441" },
  { name: "Ale",         emoji: "🌾", color: "#8B5A2B" },
  { name: "White Wine",  emoji: "🥂", color: "#D4B96A" },
  { name: "Red Wine",    emoji: "🍷", color: "#722F37" },
  { name: "Prosecco",    emoji: "🍾", color: "#E6B422" },
  { name: "Cider",       emoji: "🍎", color: "#5C9A38" },
  { name: "Soft Drinks", emoji: "🥤", color: "#5E8C9B" },
];

const drinkId = (name: string) => name.toLowerCase().replace(/[^a-z]/g, "-");

/**
 * Brings the drink_options table in line with DRINKS: adds what is new,
 * updates emoji/colour on what already exists, and retires the rest.
 *
 * A retired option that already has votes is kept and reported rather than
 * deleted, so nobody's choice disappears silently. Pass `force` to delete it
 * and its votes anyway.
 */
export async function seedDrinks(prisma: PrismaClient, force = false) {
  for (const drink of DRINKS) {
    await prisma.drinkOption.upsert({
      where: { id: drinkId(drink.name) },
      update: drink,
      create: { id: drinkId(drink.name), ...drink },
    });
  }

  const retired = await prisma.drinkOption.findMany({
    where: { id: { notIn: DRINKS.map((d) => drinkId(d.name)) } },
    include: { _count: { select: { votes: true } } },
  });

  for (const drink of retired) {
    if (drink._count.votes > 0 && !force) {
      console.log(
        `  ⚠️  Kept "${drink.name}" - it has ${drink._count.votes} vote(s). Re-run with --force to remove it and them.`
      );
      continue;
    }
    if (drink._count.votes > 0) {
      await prisma.drinkVote.deleteMany({ where: { drinkId: drink.id } });
    }
    await prisma.drinkOption.delete({ where: { id: drink.id } });
    console.log(
      `  🗑️  Removed "${drink.name}"${
        drink._count.votes > 0 ? ` and its ${drink._count.votes} vote(s)` : ""
      }`
    );
  }

  console.log(`  🍸 Drinks menu is now ${DRINKS.length} options`);
}

// Run directly: `npm run db:drinks` (add -- --force to bin voted-for options).
if (require.main === module) {
  const prisma = new PrismaClient();
  seedDrinks(prisma, process.argv.includes("--force"))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
