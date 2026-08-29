import { PrismaClient } from "@prisma/client";

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
    { name: "Prosecco",       emoji: "🥂", color: "#E6B422" },
    { name: "Gin & Tonic",    emoji: "🍸", color: "#4A7C2E" },
    { name: "Aperol Spritz",  emoji: "🍊", color: "#D4760A" },
    { name: "Pimm's",         emoji: "🍓", color: "#9B2335" },
    { name: "Craft Beer",     emoji: "🍺", color: "#A88734" },
    { name: "Cider",          emoji: "🍎", color: "#5C9A38" },
    { name: "Red Wine",       emoji: "🍷", color: "#722F37" },
    { name: "White Wine",     emoji: "🥂", color: "#D4B96A" },
    { name: "Espresso Martini", emoji: "☕", color: "#3B2F2F" },
    { name: "Rum Punch",      emoji: "🍹", color: "#6B3FA0" },
  ];

  for (const drink of drinks) {
    await prisma.drinkOption.upsert({
      where: { id: drink.name.toLowerCase().replace(/[^a-z]/g, "-") },
      update: drink,
      create: { id: drink.name.toLowerCase().replace(/[^a-z]/g, "-"), ...drink },
    });
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
