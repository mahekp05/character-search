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

  // A full copy of every product, fetched once when the page loads.
  //
  // Why fetch this separately? We need it ONLY to build the filter dropdown
  // options (categories, colors, sizes). We deliberately do NOT use it to
  // populate the product grid — the grid stays empty until the user searches
  // or picks a filter (see the "Start exploring" welcome state below).
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  // UI state for loading and errors.
  // Loading starts as false because we do NOT fetch the grid on first load.
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // The values the user has typed/selected.
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");

  // Is the user currently searching or filtering anything?
  // When this is false we show the welcome/explore state instead of a grid.
  const hasActiveQuery =
    searchTerm.trim() || category || color || size || maxPrice || minRating;

  // Fetch every product once when the page first loads.
  // This list feeds the filter dropdowns below — nothing else.
  useEffect(() => {
    getAllProducts()
      .then(setAllProducts)
      .catch(() => {
        // If this fails, the dropdowns just stay empty — not critical.
      });
  }, []);

  // Fetch the product GRID whenever the search term or any filter changes.
  //
  // The grid is intentionally NOT loaded by default: the homepage should feel
  // like a curated starting point, not a dump of every product. So we only
  // fetch once the user has an active search/filter. If they clear everything,
  // we empty the grid and fall back to the welcome state.
  //
  // We wrap the fetch in a 300ms timer ("debounce") so we don't fire a request
  // on every single keystroke while the user is typing.
  useEffect(() => {
    // No active search or filter → show the welcome state, fetch nothing.
    if (!hasActiveQuery) {
      setProducts([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        let result: Product[];

        if (searchTerm.trim()) {
          // If there is a search term, use the search endpoint.
          result = await searchProducts(searchTerm.trim());
        } else {
          // Otherwise use the filter endpoint with whichever filters are set.
          result = await filterProducts({
            category,
            color,
            size,
            maxPrice,
            minRating,
          });
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
  }, [searchTerm, category, color, size, maxPrice, minRating, hasActiveQuery]);

  // Build the lists of unique categories, colors and sizes for the dropdowns.
  // useMemo just means "only recalculate this when allProducts changes".
  const categoryOptions = useMemo(
    () => unique(allProducts.map((p) => p.category)),
    [allProducts]
  );
  const colorOptions = useMemo(
    () => unique(allProducts.map((p) => p.color)),
    [allProducts]
  );
  const sizeOptions = useMemo(
    () => unique(allProducts.map((p) => p.size)),
    [allProducts]
  );

  // Clear every filter and the search box (returns to the welcome state).
  function clearAll() {
    setSearchTerm("");
    setCategory("");
    setColor("");
    setSize("");
    setMaxPrice("");
    setMinRating("");
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

        {/* Size */}
        <label className="flex flex-col text-sm font-medium text-charcoal/80">
          Size
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className={fieldClass}
          >
            <option value="">All</option>
            {sizeOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        {/* Min rating */}
        <label className="flex flex-col text-sm font-medium text-charcoal/80">
          Min rating
          <select
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            className={fieldClass}
          >
            <option value="">All</option>
            <option value="4">4+</option>
            <option value="3">3+</option>
            <option value="2">2+</option>
            <option value="1">1+</option>
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

      {/* Loading state — only appears after the user searches or filters. */}
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

      {/* Welcome / explore state — shown when nothing is searched or filtered. */}
      {!loading && !error && !hasActiveQuery && (
        <div className="rounded-2xl bg-warm-cream p-16 text-center shadow-sm shadow-taupe/20">
          <p className="font-display text-2xl font-medium text-charcoal">
            Start exploring
          </p>
          <p className="mt-2 text-sm text-charcoal/60">
            Search for a product or choose filters to discover pieces.
          </p>
        </div>
      )}

      {/* No-result state — only after an active search/filter returns nothing. */}
      {!loading && !error && hasActiveQuery && products.length === 0 && (
        <div className="rounded-2xl bg-warm-cream p-16 text-center shadow-sm shadow-taupe/20">
          <p className="font-display text-2xl font-medium text-charcoal">
            Nothing here just yet
          </p>
          <p className="mt-2 text-sm text-charcoal/60">
            Try a different search or clear your filters to keep exploring.
          </p>
        </div>
      )}

      {/* Product grid — only when an active query returned products. */}
      {!loading && !error && hasActiveQuery && products.length > 0 && (
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
