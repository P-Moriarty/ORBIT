"use client";

import { useEffect, useRef, useState } from "react";
import type { Product } from "@/data/productsList";
import ProductViewer from "@/components/ProductViewer";

export default function ProductThumbnail({ product }: { product: Product }) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);

  useEffect(() => {
    const element = previewRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsNearViewport(entry.isIntersecting),
      { rootMargin: "160px 0px", threshold: 0.01 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const finish = product.finishes[0];
  const configuration = Object.fromEntries(
    product.configurationOptions.map((option) => [
      option.id,
      option.choices[0].id,
    ])
  );

  return (
    <div
      ref={previewRef}
      className="relative aspect-video overflow-hidden rounded-xl border border-white/5 bg-[#11131b]"
    >
      {isNearViewport ? (
        <ProductViewer
          color={finish.color}
          deviceType={product.deviceType}
          configuration={configuration}
          compact
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% 45%, ${finish.color}66, transparent 56%), linear-gradient(145deg, #171b27, #0d0e14)`,
          }}
        />
      )}
      <span className="pointer-events-none absolute bottom-2 right-2 rounded-full border border-white/10 bg-black/55 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-gray-300">
        3D preview
      </span>
    </div>
  );
}
