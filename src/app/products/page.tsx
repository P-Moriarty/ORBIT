"use client";

import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/productsList";

export default function ProductsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("featured");
  const [maxPrice, setMaxPrice] = useState("all");
  const categories = [...new Set(products.map((product) => product.deviceType))];
  const filteredProducts = products.filter((product) => {
    const matchesQuery = `${product.name} ${product.category} ${product.description}`
      .toLowerCase()
      .includes(query.trim().toLowerCase());
    return (
      matchesQuery &&
      (category === "all" || product.deviceType === category) &&
      (maxPrice === "all" || product.price < Number(maxPrice))
    );
  });
  const visibleProducts =
    sort === "price-low"
      ? filteredProducts.sort((first, second) => first.price - second.price)
      : sort === "price-high"
        ? filteredProducts.sort((first, second) => second.price - first.price)
        : filteredProducts;

  return (
    <main className="min-h-screen bg-[#090a0f] px-4 py-4 text-white sm:px-8 lg:px-12">
      <SiteHeader />
      <section className="mx-auto max-w-7xl py-10 sm:py-14">
        <p className="text-xs uppercase tracking-[0.2em] text-blue-300">
          The Orbit collection
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Find your sound
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
          Explore concept devices, inspect their details, and customize a
          configuration. Prices and availability are illustrative only.
        </p>

        <div className="mt-8 grid gap-4 rounded-2xl border border-white/10 bg-white/2.5 p-4 sm:grid-cols-2 xl:grid-cols-4">
          <label className="grid gap-2 text-sm text-gray-300">
            Search devices
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try headphones or studio"
              className="min-h-11 rounded-xl border border-white/15 bg-black/20 px-3 text-white placeholder:text-gray-500"
            />
          </label>
          <label className="grid gap-2 text-sm text-gray-300">
            Device type
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="min-h-11 rounded-xl border border-white/15 bg-[#11131b] px-3 text-white"
            >
              <option value="all">All devices</option>
              {categories.map((type) => (
                <option key={type} value={type}>
                  {type.replaceAll("-", " ")}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm text-gray-300">
            Sort by
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="min-h-11 rounded-xl border border-white/15 bg-[#11131b] px-3 text-white"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm text-gray-300">
            Maximum demo price
            <select
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
              className="min-h-11 rounded-xl border border-white/15 bg-[#11131b] px-3 text-white"
            >
              <option value="all">Any price</option>
              <option value="125">Under $125</option>
              <option value="150">Under $150</option>
              <option value="200">Under $200</option>
            </select>
          </label>
        </div>

        <p className="mt-5 text-sm text-gray-400" aria-live="polite">
          {visibleProducts.length}{" "}
          {visibleProducts.length === 1 ? "device" : "devices"} found
        </p>
        {visibleProducts.length > 0 ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-2xl border border-white/10 p-8 text-center text-gray-400">
            No devices match those filters. Try another search or device type.
          </p>
        )}
      </section>
    </main>
  );
}
