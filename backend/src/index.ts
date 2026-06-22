import "dotenv/config";
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const { Pool } = pg;

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

app.get("/", (_req, res) => {
  res.send("Backend is running");
});

app.get("/api/products", async (_req, res) => {
  const products = await prisma.product.findMany({
    orderBy: { id: "asc" },
  });

  res.json(products);
});

app.get("/api/products/search", async (req, res) => {
  const q = String(req.query.q || "");

  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { brand: { contains: q, mode: "insensitive" } },
        { category: { contains: q, mode: "insensitive" } },
        { color: { contains: q, mode: "insensitive" } },
      ],
    },
  });

  res.json(products);
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});