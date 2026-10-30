"use client";

import { useState } from "react";
import Link from "next/link";
import AudioDemos from "@/components/AudioDemos";
import ProductViewer from "@/components/ProductViewer";
import ShareButton from "@/components/ShareButton";
import WishlistButton from "@/components/WishlistButton";
import ProductCard from "@/components/ProductCard";
import { products, type Product } from "@/data/productsList";
import { sampleProductReviews } from "@/data/productReviews";

export default function ProductDetailExperience({
  product,
}: {
  product: Product;
}) {
  const [finishId, setFinishId] = useState(product.finishes[0].id);
  const finish =
    product.finishes.find((item) => item.id === finishId) ??
    product.finishes[0];
  const configuration = Object.fromEntries(
    product.configurationOptions.map((option) => [
      option.id,
      option.choices[0].id,
    ])
  );
  const reviews = sampleProductReviews[product.id] ?? [];
  const relatedProducts = products
    .filter((item) => item.id !== product.id)
    .slice(0, 3);
  const averageRating =
    reviews.length === 0
      ? 0
      : reviews.reduce((sum, review) => sum + review.rating, 0) /
        reviews.length;

  return (
    <>
      <section className="grid items-start gap-8 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:py-12">
        <div className="min-w-0">
          <ProductViewer
            color={finish.color}
            deviceType={product.deviceType}
            configuration={configuration}
          />
          <p className="mt-3 text-right text-xs text-gray-500">
            Interactive concept model · {finish.name} finish
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-blue-300">
            {product.category}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-4 leading-7 text-gray-400">{product.description}</p>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
            <p className="text-3xl font-semibold">
              ${product.price.toFixed(2)}{" "}
              <span className="text-sm font-normal text-gray-400">
                {product.currency} · demo price
              </span>
            </p>
            <p className="text-sm text-emerald-300">
              Available to configure
            </p>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Concept product. No physical inventory, checkout, or delivery is
            available.
          </p>

          <fieldset className="mt-7">
            <legend className="mb-3 text-sm font-medium">
              Finish: {finish.name}
            </legend>
            <div className="flex flex-wrap gap-2">
              {product.finishes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`Choose ${item.name} finish`}
                  aria-pressed={item.id === finishId}
                  onClick={() => setFinishId(item.id)}
                  className={`flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm ${
                    item.id === finishId
                      ? "border-white bg-white/10"
                      : "border-white/15 hover:border-white/50"
                  }`}
                >
                  <span
                    className="h-4 w-4 rounded-full border border-white/20"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.name}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/configure?product=${product.id}&finish=${finishId}`}
              className="rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
            >
              Customize in 3D
            </Link>
            <WishlistButton productId={product.id} />
            <ShareButton title={product.name} />
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/2.5 p-5">
            <h2 className="text-lg font-semibold">Specifications</h2>
            <dl className="mt-4 divide-y divide-white/10">
              {product.specifications.map((specification) => (
                <div
                  key={specification.label}
                  className="flex justify-between gap-4 py-3 text-sm"
                >
                  <dt className="text-gray-400">{specification.label}</dt>
                  <dd className="text-right text-gray-200">
                    {specification.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <div className="grid gap-6 pb-12 lg:grid-cols-2">
        <AudioDemos product={product} />
        <section
          aria-labelledby="sample-reviews-heading"
          className="rounded-2xl border border-white/10 bg-white/2.5 p-5"
        >
          <p className="text-xs uppercase tracking-[0.18em] text-blue-300">
            Illustrative content
          </p>
          <h2
            id="sample-reviews-heading"
            className="mt-2 text-lg font-semibold"
          >
            Sample reviews
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            These example reviews are fictional placeholders, not verified
            customer feedback. Sample rating: {averageRating.toFixed(1)} / 5.
          </p>
          <div className="mt-4 space-y-3">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-xl border border-white/10 p-4"
              >
                <div className="flex flex-wrap justify-between gap-2">
                  <h3 className="font-medium">{review.title}</h3>
                  <span className="text-sm text-blue-200">
                    {review.rating} / 5
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-gray-400">
                  {review.body}
                </p>
                <p className="mt-3 text-xs text-gray-500">
                  Example reviewer: {review.name}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
      {relatedProducts.length > 0 && (
        <section
          aria-labelledby="related-products-heading"
          className="border-t border-white/10 py-10"
        >
          <p className="text-xs uppercase tracking-[0.18em] text-blue-300">
            More to explore
          </p>
          <h2
            id="related-products-heading"
            className="mt-2 text-2xl font-semibold"
          >
            Other Orbit concepts
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Accessories are not part of this concept catalog.
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
