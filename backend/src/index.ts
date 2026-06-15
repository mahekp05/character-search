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

app.get("/api/characters", async (_req, res) => {
  const characters = await prisma.character.findMany({
    orderBy: { id: "asc" },
  });

  res.json(characters);
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});