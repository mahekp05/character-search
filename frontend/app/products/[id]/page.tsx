// Product detail page, shown at /products/<id>.
//
// This is a Server Component (no "use client"), so we can fetch data
// directly with await. In Next.js 16, the `params` object is a Promise,
// so we must await it before reading `params.id`.

import Link from "next/link";
import { getProductById } from "@/lib/api";

// Same image helpers as the card: decide real image vs. placeholder.
function isRealImage(url?: string | null) {
  if (!url) return false;
  return !url.includes("example.com");
}

function formatPrice(price?: number | null) {
  if (price === null || price === undefined) return "Price unavailable";
  return `$${price.toFixed(2)}`;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  // If the backend returned a 404, show a simple "not found" message.
  if (!product) {
    return (
      <div className="mx-auto w-full max-w-3xl px-5 py-24 text-center">
        <h1 className="font-display text-3xl font-medium text-charcoal">
          Product not found
        </h1>
        <p className="mt-3 text-charcoal/60">
          We couldn&apos;t find the piece you were looking for.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-burgundy px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
        >
          ← Back to all products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10">
      {/* Back link */}
      <Link
        href="/"
        className="mb-8 inline-block text-sm font-medium text-burgundy transition hover:text-dusty-rose"
      >
        ← Back to all products
      </Link>

      <div className="grid gap-10 md:grid-cols-2">
        {/* Large image */}
        <div className="aspect-square overflow-hidden rounded-3xl bg-warm-cream shadow-sm shadow-taupe/20">
          {isRealImage(product.imageUrl) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.imageUrl as string}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-pearl-beige via-dusty-rose/30 to-golden-apricot/30">
              <span className="font-display text-7xl font-medium text-burgundy/40">
                {product.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          {product.brand && (
            <p className="text-xs font-medium uppercase tracking-widest text-taupe">
              {product.brand}
            </p>
          )}
          <h1 className="mt-2 font-display text-4xl font-semibold leading-tight text-charcoal">
            {product.name}
          </h1>

          <p className="mt-4 text-2xl font-semibold text-burgundy">
            {formatPrice(product.price)}
          </p>

          {/* Category + color pills */}
          <div className="mt-5 flex flex-wrap gap-2">
            {product.category && (
              <span className="rounded-full bg-pearl-beige px-3.5 py-1.5 text-sm text-charcoal/70">
                {product.category}
              </span>
            )}
            {product.color && (
              <span className="rounded-full bg-pearl-beige px-3.5 py-1.5 text-sm text-charcoal/70">
                {product.color}
              </span>
            )}
          </div>

          {product.description && (
            <p className="mt-6 leading-relaxed text-charcoal/80">
              {product.description}
            </p>
          )}

          {/* AI stylist note — warm, concierge tone (accent styling) */}
          <div className="mt-7 rounded-2xl bg-golden-apricot/10 p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-golden-apricot">
              ✦ Your stylist&apos;s note
            </p>
            <p className="mt-2 font-display text-lg italic leading-relaxed text-charcoal/80">
              A versatile piece you&apos;ll reach for again and again — easy to
              dress up or down.
            </p>
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="mt-7">
              <p className="mb-2 text-sm font-medium text-taupe">Tags</p>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-dusty-rose/20 px-3.5 py-1.5 text-sm text-burgundy"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Primary call to action */}
          <button className="mt-8 w-full rounded-full bg-burgundy px-6 py-3.5 text-sm font-medium text-white transition hover:opacity-90 sm:w-auto sm:px-10">
            Add to wardrobe
          </button>
        </div>
      </div>
    </div>
  );
}
