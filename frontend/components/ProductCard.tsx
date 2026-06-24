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

const placeholderImages: Record<string, string> = {
  Dress: "/placeholders/dress.png",
  Shoes: "/placeholders/shoes.png",
  "T-shirt": "/placeholders/tshirt.png",
  Jeans: "/placeholders/jeans.png",
  Sweater: "/placeholders/sweater.png",
};

function getProductImage(product: Product) {
  if (isRealImage(product.imageUrl)) return product.imageUrl as string;

  return placeholderImages[product.name] || "/placeholders/default.png";
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group block overflow-hidden rounded-2xl bg-warm-cream shadow-sm shadow-taupe/20 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-dusty-rose/30"
    >
      {/* Large image area (square) */}
        <div className="relative aspect-square overflow-hidden bg-pearl-beige">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getProductImage(product)}
            alt={product.name}
            className="h-full w-full object-contain p-8 transition duration-500 group-hover:scale-105"
          />
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
