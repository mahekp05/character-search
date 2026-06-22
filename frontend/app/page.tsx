"use client";

// This is the StyleMate homepage.
// It needs "use client" because it has interactive pieces:
// a search box, filter controls, and React state (useState/useEffect).

import { useEffect, useMemo, useState } from "react";
import {
  getAllProducts,
  searchProducts,
  filterProducts,
  type Product,
} from "@/lib/api";
import ProductCard from "@/components/ProductCard";

export default function HomePage() {
  // The products we are currently showing in the grid.
  const [products, setProducts] = useState<Product[]>([]);

  // A full copy of every product, fetched once. We use it only to build
  // the category/color dropdown options, so they don't shrink while filtering.
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  // UI state for loading and errors.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // The values the user has typed/selected.
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Fetch every product once when the page first loads.
  // This list feeds the filter dropdowns below.
  useEffect(() => {
    getAllProducts()
      .then(setAllProducts)
      .catch(() => {
        // If this fails, the dropdowns just stay empty — not critical.
      });
  }, []);

  // Re-fetch the product grid whenever the search term or any filter changes.
  // We wrap it in a 300ms timer ("debounce") so we don't fire a request
  // on every single keystroke while the user is typing.
  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        let result: Product[];

        if (searchTerm.trim()) {
          // If there is a search term, use the search endpoint.
          result = await searchProducts(searchTerm.trim());
        } else {
          // Otherwise use the filter endpoint. With no filters chosen,
          // the backend simply returns all products.
          result = await filterProducts({ category, color, maxPrice });
        }

        setProducts(result);
      } catch {
        setError("Something went wrong. Is the backend running?");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    // If the user types again before 300ms, cancel the previous timer.
    return () => clearTimeout(timer);
  }, [searchTerm, category, color, maxPrice]);

  // Build the lists of unique categories and colors for the dropdowns.
  // useMemo just means "only recalculate this when allProducts changes".
  const categoryOptions = useMemo(
    () => unique(allProducts.map((p) => p.category)),
    [allProducts]
  );
  const colorOptions = useMemo(
    () => unique(allProducts.map((p) => p.color)),
    [allProducts]
  );

  // Clear every filter and the search box.
  function clearAll() {
    setSearchTerm("");
    setCategory("");
    setColor("");
    setMaxPrice("");
  }

  // Shared styling for the filter <select> / <input> controls so they
  // all feel consistent (Warm Cream surface, soft Taupe border).
  const fieldClass =
    "mt-1.5 rounded-xl border border-taupe/50 bg-warm-cream px-4 py-2.5 text-sm text-charcoal outline-none transition focus:border-burgundy focus:ring-2 focus:ring-dusty-rose/40";

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10">
      {/* ---------- Hero section ---------- */}
      <header className="mb-12 flex flex-col items-center text-center">
        {/* Small "personal stylist" badge in the accent color */}
        <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-golden-apricot/15 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-golden-apricot">
          ✦ Your personal stylist
        </span>

        {/* Logo / hero title in Playfair Display */}
        <h1 className="font-display text-6xl font-semibold tracking-tight text-burgundy sm:text-7xl">
          StyleMate
        </h1>

        {/* Tagline in Poppins */}
        <p className="mt-4 max-w-xl text-base leading-relaxed text-charcoal/70">
          A curated shopping experience — discover pieces chosen to feel
          effortless, elevated, and entirely you.
        </p>
      </header>

      {/* ---------- Search bar ---------- */}
      <div className="mx-auto mb-6 max-w-2xl">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for dresses, tops, shoes..."
          className="w-full rounded-full border border-taupe/50 bg-warm-cream px-6 py-4 text-charcoal shadow-sm shadow-taupe/20 outline-none transition placeholder:text-taupe focus:border-burgundy focus:ring-2 focus:ring-dusty-rose/40"
        />
      </div>

      {/* ---------- Filter controls ---------- */}
      <div className="mb-3 flex flex-wrap items-end gap-5 rounded-2xl bg-warm-cream p-5 shadow-sm shadow-taupe/20">
        {/* Category */}
        <label className="flex flex-col text-sm font-medium text-charcoal/80">
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={fieldClass}
          >
            <option value="">All</option>
            {categoryOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        {/* Color */}
        <label className="flex flex-col text-sm font-medium text-charcoal/80">
          Color
          <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className={fieldClass}
          >
            <option value="">All</option>
            {colorOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        {/* Max price */}
        <label className="flex flex-col text-sm font-medium text-charcoal/80">
          Max price
          <input
            type="number"
            min="0"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="e.g. 100"
            className={`${fieldClass} w-32 placeholder:text-taupe`}
          />
        </label>

        {/* Primary "Clear all" button (Burgundy), pushed right with ml-auto */}
        <button
          onClick={clearAll}
          className="ml-auto rounded-full bg-burgundy px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
        >
          Clear all
        </button>
      </div>

      {/* Small hint: search and filters use separate backend endpoints,
          so the filters apply when the search box is empty. */}
      {searchTerm.trim() && (
        <p className="mb-6 text-sm italic text-taupe">
          Showing results for &ldquo;{searchTerm.trim()}&rdquo;. Clear the search
          box to use the filters.
        </p>
      )}

      {!searchTerm.trim() && <div className="mb-6" />}

      {/* ---------- Results ---------- */}

      {/* Loading state */}
      {loading && (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {/* Show 8 soft "skeleton" cards while loading. */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse overflow-hidden rounded-2xl bg-warm-cream shadow-sm shadow-taupe/20"
            >
              <div className="aspect-square bg-pearl-beige" />
              <div className="space-y-2 p-5">
                <div className="h-4 w-2/3 rounded bg-pearl-beige" />
                <div className="h-3 w-1/3 rounded bg-pearl-beige" />
                <div className="h-4 w-1/4 rounded bg-pearl-beige" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="rounded-2xl bg-warm-cream p-10 text-center text-burgundy shadow-sm shadow-taupe/20">
          {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && products.length === 0 && (
        <div className="rounded-2xl bg-warm-cream p-16 text-center shadow-sm shadow-taupe/20">
          <p className="font-display text-2xl font-medium text-charcoal">
            Nothing here just yet
          </p>
          <p className="mt-2 text-sm text-charcoal/60">
            Try a different search or clear your filters to keep exploring.
          </p>
        </div>
      )}

      {/* Product grid */}
      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

// Helper: take a list that may contain nulls/duplicates and return
// a clean, sorted list of unique non-empty strings.
function unique(values: (string | null | undefined)[]): string[] {
  const set = new Set<string>();
  for (const v of values) {
    if (v) set.add(v);
  }
  return Array.from(set).sort();
}
