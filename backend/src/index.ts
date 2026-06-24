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

// Get all products
app.get("/api/products", async (_req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: "asc" },
    });

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Search products by keyword across multiple fields.
// NOTE: this route must be declared BEFORE "/api/products/:id",
// otherwise ":id" would match the word "search".
app.get("/api/products/search", async (req, res) => {
  try {
    const q = String(req.query.q || "");

    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { brand: { contains: q, mode: "insensitive" } },
          { category: { contains: q, mode: "insensitive" } },
          { color: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          // tags is a string array, so we check if any tag equals the keyword.
          { tags: { has: q } },
        ],
      },
    });

    res.json(products);
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Filter products by optional query params:
// category, color, brand, minPrice, maxPrice
// NOTE: must also be declared BEFORE "/api/products/:id".
app.get("/api/products/filter", async (req, res) => {
  try {
    const { category, color, brand, size, minPrice, maxPrice, minRating } =
      req.query;

    // Build the "where" object step by step, only adding filters
    // for the params the user actually sent.
    const where: any = {};

    if (category) {
      where.category = { equals: String(category), mode: "insensitive" };
    }

    if (color) {
      where.color = { equals: String(color), mode: "insensitive" };
    }

    if (brand) {
      where.brand = { equals: String(brand), mode: "insensitive" };
    }

    if (size) {
      where.size = { equals: String(size), mode: "insensitive" };
    }

    // Price range: combine minPrice and maxPrice into one "price" filter.
    if (minPrice || maxPrice) {
      where.price = {};

      if (minPrice) {
        where.price.gte = Number(minPrice);
      }

      if (maxPrice) {
        where.price.lte = Number(maxPrice);
      }
    }

    // Minimum rating: keep products rated at least this high (e.g. 4 = "4+").
    if (minRating) {
      where.rating = { gte: Number(minRating) };
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { id: "asc" },
    });

    res.json(products);
  } catch (error) {
    console.error("Error filtering products:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Get a single product by id.
// This goes LAST so the literal routes above take priority.
app.get("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
