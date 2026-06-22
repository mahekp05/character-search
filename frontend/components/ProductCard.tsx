import Link from "next/link";
import type { Product } from "@/lib/api";

// A reusable product card used inside the homepage grid.
// It only displays data and links to the detail page, so it does NOT
// need "use client" (no state, buttons, or events).

// Helper: turn a number like 49.9 into "$49.90".
function formatPrice(price?: number | null) {
  if (price === null || price === undefined) return "Price unavailable";
  return `$${price.toFixed(2)}`;
}

// Helper: the sample data uses example.com image URLs that won't load,
// so for those we show a soft styled placeholder instead of a broken image.
function isRealImage(url?: string | null) {
  if (!url) return false;
  return !url.includes("example.com");
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group block overflow-hidden rounded-2xl bg-warm-cream shadow-sm shadow-taupe/20 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-dusty-rose/30"
    >
      {/* Large image area (square) */}
      <div className="relative aspect-square overflow-hidden bg-pearl-beige">
        {isRealImage(product.imageUrl) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl as string}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          // Soft warm-toned placeholder with the product's first letter.
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-pearl-beige via-dusty-rose/30 to-golden-apricot/30">
            <span className="font-display text-5xl font-medium text-burgundy/40">
              {product.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Text area with generous, editorial spacing */}
      <div className="space-y-1.5 p-5">
        {/* Product name in the elegant display font */}
        <h3 className="font-display text-lg font-medium leading-snug text-charcoal">
          {product.name}
        </h3>

        {product.brand && (
          <p className="text-xs font-medium uppercase tracking-widest text-taupe">
            {product.brand}
          </p>
        )}

        <p className="pt-0.5 font-semibold text-burgundy">
          {formatPrice(product.price)}
        </p>

        {product.description && (
          <p className="line-clamp-2 pt-1 text-sm leading-relaxed text-charcoal/70">
            {product.description}
          </p>
        )}
      </div>
    </Link>
  );
}
