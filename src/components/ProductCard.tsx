import Link from "next/link";
import type { Product } from "@/data/productsList";
import ProductThumbnail from "@/components/ProductThumbnail";
import ShareButton from "@/components/ShareButton";
import WishlistButton from "@/components/WishlistButton";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="flex min-w-0 flex-col rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-white/20">
      <Link href={`/products/${product.id}`} className="group">
        <ProductThumbnail product={product} />
        <p className="mt-5 text-xs uppercase tracking-[0.16em] text-blue-300">
          {product.category}
        </p>
        <div className="mt-2 flex items-start justify-between gap-3">
          <h2 className="text-xl font-semibold group-hover:text-blue-200">
            {product.name}
          </h2>
          <span className="shrink-0 text-sm font-medium">
            ${product.price.toFixed(2)} {product.currency}
          </span>
        </div>
        <p className="mt-3 min-h-12 text-sm leading-6 text-gray-400">
          {product.description}
        </p>
      </Link>

      <p className="mt-3 text-xs text-gray-500">
        Demo availability: Ready to configure · No physical stock
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href={`/products/${product.id}`}
          className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-gray-200"
        >
          View details
        </Link>
        <WishlistButton productId={product.id} />
        <ShareButton
          title={product.name}
          url={`/products/${product.id}`}
          className="[&>button]:px-3"
        />
      </div>
    </article>
  );
}
