import { PrismaClient } from "@prisma/client";
import { DEFAULT_SET_LIST } from "../src/lib/itinerary";
import { seedDrinks } from "./seed-drinks";

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
  await seedDrinks(prisma);

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
      answer: "Yes! Tall John's House has free parking on-site.",
      isAnswered: true,
    },
    {
      name: "Cousin Sarah",
      question: "Can I bring my dog?",
      answer: "We'd love that! Well-behaved dogs are welcome. Leonard insists on meeting them all.",
      isAnswered: true,
    },
    {
      name: "Friend Dave",
      question: "What's the nearest airport?",
      answer: null,
      isAnswered: false,
    },
    {
      name: "Auntie Em",
      question: "Will there be dancing?",
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
