"use client";

import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/productsList";
import { useWishlist } from "@/hooks/useWishlist";

export default function WishlistPage() {
  const { productIds } = useWishlist();
  const savedProducts = products.filter((product) =>
    productIds.includes(product.id)
  );

  return (
    <main className="min-h-screen bg-[#090a0f] px-4 py-4 text-white sm:px-8 lg:px-12">
      <SiteHeader />
      <section className="mx-auto max-w-7xl py-10 sm:py-14">
        <p className="text-xs uppercase tracking-[0.2em] text-blue-300">
          Your shortlist
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Wishlist
        </h1>
        <p className="mt-4 text-sm text-gray-400">
          Saved products stay in this browser.
        </p>

        {savedProducts.length > 0 ? (
          <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {savedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="mt-7 rounded-2xl border border-white/10 bg-white/2.5 p-8 text-center">
            <h2 className="text-lg font-medium">No saved products yet</h2>
            <p className="mt-2 text-sm text-gray-400">
              Save devices from the collection or a product detail page to
              compare them later.
            </p>
            <Link
              href="/products"
              className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-white px-5 text-sm font-semibold text-black hover:bg-gray-200"
            >
              Browse products
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
