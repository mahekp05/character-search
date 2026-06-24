import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import fs from "fs";
import csv from "csv-parser";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

type ProductRow = {
  "Product ID": string;
  "Product Name": string;
  Brand: string;
  Category: string;
  Price: string;
  Rating: string;
  Color: string;
  Size: string;
};

async function main() {
  const products: any[] = [];

  fs.createReadStream("./data/fashion_products.csv")
    .pipe(csv())
    .on("data", (row: ProductRow) => {
      products.push({
        name: row["Product Name"],
        brand: row.Brand,
        category: row.Category,
        color: row.Color,
        size: row.Size,
        price: Number(row.Price),
        rating: Number(row.Rating),
        tags: [
          row["Product Name"],
          row.Brand,
          row.Category,
          row.Color,
          row.Size,
        ].filter(Boolean),
      });
    })
    .on("end", async () => {
      await prisma.product.createMany({
        data: products,
      });

      console.log(`Imported ${products.length} products`);
      await prisma.$disconnect();
    });
}

main().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});