import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ProductDetailExperience from "@/components/ProductDetailExperience";
import SiteHeader from "@/components/SiteHeader";
import { products } from "@/data/productsList";

type Props = {
  params: Promise<{ productId: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ productId: product.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productId } = await params;
  const product = products.find((item) => item.id === productId);
  return product
    ? {
        title: `${product.name} | Orbit 3D`,
        description: product.description,
      }
    : { title: "Product not found | Orbit 3D" };
}

async function ProductPageContent({ params }: Props) {
  const { productId } = await params;
  const product = products.find((item) => item.id === productId);
  if (!product) notFound();

  return (
    <main className="min-h-screen bg-[#090a0f] px-4 py-4 text-white sm:px-8 lg:px-12">
      <SiteHeader />
      <div className="mx-auto max-w-7xl">
        <Link
          href="/products"
          className="mt-6 inline-flex min-h-10 items-center text-sm text-gray-400 hover:text-white"
        >
          ← All products
        </Link>
        <ProductDetailExperience product={product} />
      </div>
    </main>
  );
}

export default function ProductPage({ params }: Props) {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#090a0f] px-4 py-8 text-white sm:px-8 lg:px-12">
          <p role="status" className="mx-auto max-w-7xl text-sm text-gray-400">
            Loading product details...
          </p>
        </main>
      }
    >
      <ProductPageContent params={params} />
    </Suspense>
  );
}
