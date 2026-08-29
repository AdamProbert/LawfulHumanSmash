import { PrismaClient } from "@prisma/client";
import { DEFAULT_SET_LIST } from "../src/lib/itinerary";

const prisma = new PrismaClient();

function generateUniqueCode(existingCodes: Set<string>): string {
  let code: string;
  do {
    code = Math.floor(1000 + Math.random() * 9000).toString();
  } while (existingCodes.has(code));
  existingCodes.add(code);
  return code;
}

async function main() {
  console.log("🌿 Seeding the wedding database...\n");

  // --- Drink Options ---
  const drinks = [
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

  const drinkId = (name: string) =>
    name.toLowerCase().replace(/[^a-z]/g, "-");

  for (const drink of drinks) {
    await prisma.drinkOption.upsert({
      where: { id: drinkId(drink.name) },
      update: drink,
      create: { id: drinkId(drink.name), ...drink },
    });
  }

  // Retire options that are no longer on the menu. Anything that already has
  // votes is left alone rather than silently binning someone's choice - it is
  // reported instead so it can be dealt with deliberately.
  const retired = await prisma.drinkOption.findMany({
    where: { id: { notIn: drinks.map((d) => drinkId(d.name)) } },
    include: { _count: { select: { votes: true } } },
  });
  for (const drink of retired) {
    if (drink._count.votes > 0) {
      console.log(
        `  ⚠️  Kept "${drink.name}" - it already has ${drink._count.votes} vote(s)`
      );
      continue;
    }
    await prisma.drinkOption.delete({ where: { id: drink.id } });
    console.log(`  🗑️  Removed "${drink.name}"`);
  }

  console.log(`  🍸 Seeded ${drinks.length} drink options`);

  // --- Sample Parties (replace with your real guest list) ---
  const codes = new Set<string>();
  const sampleParties = [
    { email: "adam@example.com", guestNames: ["Adam Probert", "Mady"] },
    { email: "guest.one@example.com", guestNames: ["Test Guest One"] },
    {
      email: "guest.family@example.com",
      guestNames: ["Test Guest Two", "Test Guest Three", "Little Guest"],
    },
  ];

  for (const { email, guestNames } of sampleParties) {
    const code = generateUniqueCode(codes);
    const party = await prisma.party.upsert({
      where: { code },
      update: {},
      create: { code, email },
    });
    for (const name of guestNames) {
      await prisma.guest.create({ data: { name, partyId: party.id } });
    }
    console.log(
      `  🎟️  Party: ${guestNames.join(", ")} → Code: ${code}`
    );
  }

  // --- Sample Q&A ---
  const sampleQuestions = [
    {
      name: "Uncle Bob",
      question: "Is there parking at the venue?",
      category: "accommodation",
      answer: "Yes! Tall Johns House has free parking on-site.",
      isAnswered: true,
    },
    {
      name: "Cousin Sarah",
      question: "Can I bring my dog?",
      category: "pets",
      answer: "We'd love that! Well-behaved dogs are welcome. Leonard insists on meeting them all.",
      isAnswered: true,
    },
    {
      name: "Friend Dave",
      question: "What's the nearest airport?",
      category: "accommodation",
      answer: null,
      isAnswered: false,
    },
    {
      name: "Auntie Em",
      question: "Will there be dancing?",
      category: "whimsy",
      answer: "Absolutely. We have a DJ and a dance floor. Bring your moves!",
      isAnswered: true,
    },
  ];

  for (const q of sampleQuestions) {
    await prisma.question.create({ data: q });
  }
  console.log(`  ❓ Seeded ${sampleQuestions.length} sample questions`);

  // --- Itinerary ---
  // Only on an empty table: re-running the seed must not wipe out a running
  // order that has since been edited in /secretgarden.
  const existingSlots = await prisma.itinerarySlot.count();
  if (existingSlots === 0) {
    await prisma.itinerarySlot.createMany({ data: DEFAULT_SET_LIST });
    console.log(`  ⏰ Seeded ${DEFAULT_SET_LIST.length} itinerary slots`);
  } else {
    console.log(`  ⏰ Itinerary already has ${existingSlots} slots, left alone`);
  }

  console.log("\n✅ Seeding complete! Your wedding DB is ready.\n");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
