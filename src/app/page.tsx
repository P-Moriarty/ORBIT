"use client";

import { useState } from "react";
import Link from "next/link";
import LandingBackground from "@/components/LandingBackground";
import SiteHeader from "@/components/SiteHeader";
import ProductViewer from "@/components/ProductViewer";
import SoundscapeScene from "@/components/SoundscapeScene";
import WaveformScene from "@/components/WaveformScene";
import { products } from "@/data/productsList";

function getLandingProduct() {
  const headphone = products.find((item) => item.deviceType === "headphones");
  if (!headphone) {
    throw new Error("The landing page requires a headphone product.");
  }
  return headphone;
}

const product = getLandingProduct();

export default function Home() {
  const [selectedFinish, setSelectedFinish] = useState(product.finishes[0]);

  return (
    <main className="relative isolate min-h-screen bg-transparent px-4 py-8 text-white sm:px-8 lg:px-16">
      <LandingBackground />
      <div className="relative z-10">
        <SiteHeader />

        <section className="mx-auto grid max-w-7xl items-center gap-10 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-16">
        <div className="min-w-0">
          <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-blue-400">
            <span className="h-2 w-2 rounded-full bg-blue-400" />
            Designed for your world
          </div>

          <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Sound that
            <br />
            <span className="text-gray-500">moves with you.</span>
          </h1>

          <p className="mt-6 max-w-md text-base leading-7 text-gray-400">
            Meet Orbit One, a wireless over-ear headphone concept designed for
            immersive listening, all-day comfort, and expressive design.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/configure"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-gray-200"
            >
              Explore in 3D
            </Link>

            <span className="text-sm text-gray-400">
              Concept model · Interactive demo
            </span>
          </div>

          <div className="mt-12 grid max-w-md grid-cols-3 gap-4 border-t border-white/10 pt-6">
            <div>
              <p className="text-lg font-semibold">360°</p>
              <p className="mt-1 text-xs text-gray-500">View every angle</p>
            </div>

            <div>
              <p className="text-lg font-semibold">3</p>
              <p className="mt-1 text-xs text-gray-500">Color options</p>
            </div>

            <div>
              <p className="text-lg font-semibold">3D</p>
              <p className="mt-1 text-xs text-gray-500">Real-time rendering</p>
            </div>
          </div>
        </div>

        <div className="min-w-0">
          <ProductViewer
            color={selectedFinish.color}
            deviceType={product.deviceType}
            configuration={{
              [product.configurationOptions[0].id]:
                product.configurationOptions[0].choices[0].id,
            }}
          />

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-medium">{product.name}</p>
              <p className="mt-1 text-sm text-gray-500">Choose your finish</p>
            </div>

            <div className="flex items-center gap-3">
              {product.finishes.map((finish) => (
                <button
                  key={finish.id}
                  type="button"
                  title={finish.name}
                  aria-label={`Select ${finish.name} finish`}
                  aria-pressed={selectedFinish.id === finish.id}
                  onClick={() => setSelectedFinish(finish)}
                  className={`h-9 w-9 rounded-full border-2 transition ${
                    selectedFinish.id === finish.id
                      ? "scale-110 border-white"
                      : "border-white/20 hover:border-white/60"
                  }`}
                  style={{ backgroundColor: finish.color }}
                />
              ))}
            </div>
          </div>

          <p className="mt-3 text-right text-xs text-gray-500">
            Selected finish: {selectedFinish.name}
          </p>
        </div>
          </section>

          <SoundscapeScene />
        <WaveformScene />

        <footer className="mx-auto max-w-7xl border-t border-white/10 py-6 text-xs text-gray-500">
          ORBIT 3D — A learning project built with Next.js and Three.js.
        </footer>
      </div>
    </main>
  );
}
