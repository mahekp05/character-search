import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.character.createMany({
    data: [
      {
        name: "Hermione Granger",
        sourceTitle: "Harry Potter",
        sourceType: "Book/Movie",
        description:
          "An intelligent, ambitious, loyal overachiever who values knowledge and justice.",
      },
      {
        name: "Leslie Knope",
        sourceTitle: "Parks and Recreation",
        sourceType: "TV Show",
        description:
          "An optimistic, driven, chaotic-good leader who cares deeply about her community.",
      },
      {
        name: "Mr. Darcy",
        sourceTitle: "Pride and Prejudice",
        sourceType: "Book/Movie",
        description:
          "A reserved, emotionally guarded romantic lead with strong principles.",
      },
    ],
  });

  console.log("Seeded characters");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });