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
  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: [
      {
        name: "Black Mini Dress",
        brand: "Zara",
        category: "Dress",
        color: "Black",
        price: 59.99,
        imageUrl: "https://example.com/dress.jpg",
        description: "Simple black dress for going out or dinner.",
        tags: ["black", "dress", "minimal", "party"],
      },
      {
        name: "White Button Down Shirt",
        brand: "H&M",
        category: "Top",
        color: "White",
        price: 24.99,
        imageUrl: "https://example.com/shirt.jpg",
        description: "Clean basic shirt for school, internships, or casual outfits.",
        tags: ["white", "shirt", "workwear", "basic"],
      },
    ],
  });

  console.log("Seeded products");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });