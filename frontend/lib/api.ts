// Small helper file for talking to the StyleMate backend.
// Keeping all the fetch logic here means our components stay clean,
// and if the backend URL ever changes we only edit it in one place.

// The backend runs on http://localhost:5000.
// We read it from an env var if present, otherwise fall back to localhost.
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// This describes the shape of a product coming back from the backend.
// The "?" means the field might be missing (it is optional in the database).
export type Product = {
  id: string;
  name: string;
  brand?: string | null;
  category?: string | null;
  color?: string | null;
  price?: number | null;
  imageUrl?: string | null;
  description?: string | null;
  tags?: string[];
  size?: string | null;
  rating?: number | null;
};

// Get every product. Used to fill the filter dropdowns on the homepage.
export async function getAllProducts(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/api/products`);
  if (!res.ok) throw new Error("Failed to load products");
  return res.json();
}

// Search products by a keyword (name, brand, category, color, etc.).
export async function searchProducts(query: string): Promise<Product[]> {
  const res = await fetch(
    `${API_URL}/api/products/search?q=${encodeURIComponent(query)}`
  );
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}

// Filter products by optional category, color, size, max price and min rating.
// We only add a query param if the user actually chose a value, so the
// backend receives a clean URL containing just the active filters.
export async function filterProducts(filters: {
  category?: string;
  color?: string;
  size?: string;
  maxPrice?: string;
  minRating?: string;
}): Promise<Product[]> {
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.color) params.set("color", filters.color);
  if (filters.size) params.set("size", filters.size);
  if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
  if (filters.minRating) params.set("minRating", filters.minRating);

  const res = await fetch(`${API_URL}/api/products/filter?${params.toString()}`);
  if (!res.ok) throw new Error("Filtering failed");
  return res.json();
}

// Get a single product by its id (used on the detail page).
// Returns null if the product was not found (backend sends a 404).
export async function getProductById(id: string): Promise<Product | null> {
  const res = await fetch(`${API_URL}/api/products/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to load product");
  return res.json();
}
