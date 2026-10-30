"use client";

import { Suspense, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import SiteHeader from "@/components/SiteHeader";
import ProductViewer from "@/components/ProductViewer";
import ProductConfigurator from "@/components/ProductConfigurator";
import WishlistButton from "@/components/WishlistButton";
import {
  getSavedConfigurationsSnapshot,
  getServerSavedConfigurationsSnapshot,
  parseSavedConfigurations,
  saveConfiguration,
  deleteSavedConfiguration,
  subscribeToSavedConfigurations,
  type SavedConfiguration,
} from "@/data/savedConfigurations";
import { products, type Product } from "@/data/productsList";

export default function ConfigurePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#090a0f] px-4 py-10 text-white sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl text-sm text-gray-400">
            Loading configurator...
          </div>
        </main>
      }
    >
      <ConfigureScreen />
    </Suspense>
  );
}

function ConfigureScreen() {
  const searchParams = useSearchParams();
  const selectedProduct =
    products.find((item) => item.id === searchParams.get("product")) ??
    products[0];
  const selectedFinish =
    selectedProduct.finishes.find(
      (item) => item.id === searchParams.get("finish")
    )?.id ?? selectedProduct.finishes[0].id;
  const selectedOptions = Object.fromEntries(
    selectedProduct.configurationOptions.map((option) => [
      option.id,
      option.choices.find(
        (choice) => choice.id === searchParams.get(`option.${option.id}`)
      )?.id ?? option.choices[0].id,
    ])
  );
  const [comparisonIds, setComparisonIds] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const { addItem } = useCart();
  const savedSnapshot = useSyncExternalStore(
    subscribeToSavedConfigurations,
    getSavedConfigurationsSnapshot,
    getServerSavedConfigurationsSnapshot
  );
  const savedConfigurations = useMemo(
    () => parseSavedConfigurations(savedSnapshot),
    [savedSnapshot]
  );

  const finish =
    selectedProduct.finishes.find((item) => item.id === selectedFinish) ??
    selectedProduct.finishes[0];

  function addToCart(quantity: number) {
    addItem({
      productId: selectedProduct.id,
      finishId: selectedFinish,
      configuration: selectedOptions,
      quantity,
    });
    setNotice(`${quantity} × ${selectedProduct.name} added to your demo cart.`);
  }

  function updateUrl(
    item: Product,
    finishId: string,
    options: Record<string, string>
  ) {
    const url = new URL(window.location.href);
    url.searchParams.set("product", item.id);
    url.searchParams.set("finish", finishId);
    for (const key of [...url.searchParams.keys()]) {
      if (key.startsWith("option.")) url.searchParams.delete(key);
    }
    for (const [optionId, choiceId] of Object.entries(options)) {
      url.searchParams.set(`option.${optionId}`, choiceId);
    }
    window.history.replaceState(null, "", url);
  }

  function chooseProduct(item: Product) {
    updateUrl(
      item,
      item.finishes[0].id,
      Object.fromEntries(
        item.configurationOptions.map((option) => [
          option.id,
          option.choices[0].id,
        ])
      )
    );
    setNotice("");
  }

  function saveCurrentConfiguration() {
    try {
      const saved: SavedConfiguration = {
        id: crypto.randomUUID(),
        productId: selectedProduct.id,
        finishId: selectedFinish,
        options: selectedOptions,
        createdAt: new Date().toISOString(),
      };
      saveConfiguration(saved);
      setNotice("Configuration saved on this device.");
    } catch (error) {
      console.error("Could not save this configuration.", error);
      setNotice("Could not save this configuration. Check browser storage settings.");
    }
  }

  function restoreConfiguration(configuration: SavedConfiguration) {
    const item = products.find(
      (candidate) => candidate.id === configuration.productId
    );
    if (!item) {
      throw new Error(`Unknown saved product: ${configuration.productId}`);
    }
    updateUrl(item, configuration.finishId, configuration.options);
    setNotice(`${item.name} configuration restored.`);
  }

  function removeConfiguration(id: string) {
    try {
      deleteSavedConfiguration(id);
      setNotice("Saved configuration removed.");
    } catch (error) {
      console.error("Could not remove the saved configuration.", error);
      setNotice("Could not remove the saved configuration.");
    }
  }

  async function copyShareLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setNotice("Share link copied to clipboard.");
    } catch (error) {
      console.error("Could not copy the configuration link.", error);
      setNotice("Could not copy the link. Copy it from your browser address bar.");
    }
  }

  function toggleComparison(productId: string) {
    setComparisonIds((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId]
    );
  }

  const comparedProducts = products.filter((item) =>
    comparisonIds.includes(item.id)
  );
  const comparisonRows = Array.from(
    new Set(comparedProducts.flatMap((item) => item.specifications.map((spec) => spec.label)))
  );

  return (
    <main className="min-h-screen bg-[#090a0f] px-4 py-6 text-white sm:px-8 lg:px-12">
      <SiteHeader />

      <section className="mx-auto grid max-w-7xl gap-10 py-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14 lg:py-14">
        <div className="min-w-0">
          <ProductViewer
            color={finish.color}
            deviceType={selectedProduct.deviceType}
            configuration={selectedOptions}
          />

          <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
            <span>Interactive 3D product model</span>
            <span>{finish.name} finish</span>
          </div>
        </div>

        <div className="min-w-0 lg:py-3">
          <ProductConfigurator
            product={selectedProduct}
            selectedFinish={selectedFinish}
            selectedOptions={selectedOptions}
            onFinishChange={(finishId) =>
              updateUrl(selectedProduct, finishId, selectedOptions)
            }
            onOptionChange={(optionId, choiceId) => {
              updateUrl(selectedProduct, selectedFinish, {
                ...selectedOptions,
                [optionId]: choiceId,
              });
            }}
            onAddToCart={addToCart}
          />

          {notice && (
            <div
              role="status"
              className="mt-5 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-300"
            >
              <div className="flex items-start justify-between gap-3">
                <p>{notice}</p>
                <button
                  type="button"
                  onClick={() => setNotice("")}
                  aria-label="Dismiss notification"
                  className="text-green-300 hover:text-white"
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <section
        aria-labelledby="saved-configurations-heading"
        className="mx-auto max-w-7xl pb-12 sm:pb-16"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-blue-300">
              Keep your setup
            </p>
            <h2
              id="saved-configurations-heading"
              className="mt-2 text-2xl font-semibold tracking-tight"
            >
              Saved configurations
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={saveCurrentConfiguration}
              className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-gray-200"
            >
              Save this setup
            </button>
            <button
              type="button"
              onClick={copyShareLink}
              className="rounded-xl border border-white/15 px-4 py-2.5 text-sm transition hover:bg-white/10"
            >
              Copy share link
            </button>
          </div>
        </div>

        {savedConfigurations.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-white/10 bg-white/2.5 p-5 text-sm text-gray-400">
            Saved setups are stored in this browser. Save your current product,
            finish, and options to quickly restore them later.
          </p>
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {savedConfigurations.map((configuration) => {
              const savedProduct = products.find(
                (item) => item.id === configuration.productId
              );
              const savedFinish = savedProduct?.finishes.find(
                (item) => item.id === configuration.finishId
              );

              if (!savedProduct || !savedFinish) {
                throw new Error(
                  `Invalid saved configuration: ${configuration.id}`
                );
              }

              return (
                <li
                  key={configuration.id}
                  className="rounded-2xl border border-white/10 bg-white/2.5 p-4"
                >
                  <p className="font-medium">{savedProduct.name}</p>
                  <p className="mt-1 text-sm text-gray-400">
                    {savedFinish.name} finish
                  </p>
                  {savedProduct.configurationOptions.map((option) => {
                    const choice = option.choices.find(
                      (item) => item.id === configuration.options[option.id]
                    );
                    return (
                      <p
                        key={option.id}
                        className="mt-1 text-xs text-gray-500"
                      >
                        {option.label}: {choice?.label ?? "Default"}
                      </p>
                    );
                  })}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => restoreConfiguration(configuration)}
                      className="rounded-lg border border-white/15 px-3 py-2 text-xs font-medium hover:bg-white/10"
                    >
                      Restore
                    </button>
                    <button
                      type="button"
                      onClick={() => removeConfiguration(configuration.id)}
                      className="rounded-lg px-3 py-2 text-xs text-gray-400 hover:bg-white/5 hover:text-white"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section
        aria-labelledby="products-heading"
        className="mx-auto max-w-7xl pb-12 sm:pb-16"
      >
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-blue-300">
              The Orbit collection
            </p>
            <h2
              id="products-heading"
              className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              Choose your sound device
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-gray-400">
            Select a model to preview it in 3D and customize its finish.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((item) => {
            const isSelected = selectedProduct.id === item.id;

            return (
              <article
                key={item.id}
                className={`rounded-2xl border p-5 transition ${
                  isSelected
                    ? "border-blue-400/50 bg-blue-400/[0.07]"
                    : "border-white/10 bg-white/2.5 hover:border-white/20"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.15em] text-blue-300">
                      {item.category}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold">{item.name}</h3>
                  </div>
                  <p className="shrink-0 text-sm font-medium">
                    ${item.price.toFixed(2)}
                  </p>
                </div>

                <p className="mt-3 min-h-12 text-sm leading-6 text-gray-400">
                  {item.description}
                </p>

                <div
                  className="mt-5 flex items-center gap-2"
                  aria-label={`${item.finishes.length} available finishes`}
                >
                  {item.finishes.map((itemFinish) => (
                    <span
                      key={itemFinish.id}
                      title={itemFinish.name}
                      className="h-5 w-5 rounded-full border border-white/20"
                      style={{ backgroundColor: itemFinish.color }}
                    />
                  ))}
                  <span className="ml-1 text-xs text-gray-500">
                    {item.finishes.length} finishes
                  </span>
                </div>

                <button
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => chooseProduct(item)}
                  className="mt-6 w-full rounded-xl border border-white/15 px-4 py-3 text-sm font-medium transition hover:border-white/30 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-300"
                >
                  {isSelected ? "Currently selected" : "Choose this model"}
                </button>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <Link
                    href={`/products/${item.id}`}
                    className="flex min-h-11 items-center justify-center rounded-xl border border-white/15 px-4 py-2 text-sm transition hover:bg-white/10"
                  >
                    View details
                  </Link>
                  <WishlistButton productId={item.id} />
                </div>
                <button
                  type="button"
                  aria-pressed={comparisonIds.includes(item.id)}
                  onClick={() => toggleComparison(item.id)}
                  className="mt-2 w-full rounded-xl px-4 py-2 text-sm text-gray-400 transition hover:bg-white/5 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
                >
                  {comparisonIds.includes(item.id)
                    ? "Remove from comparison"
                    : "Compare"}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      {comparedProducts.length > 0 && (
        <section
          aria-labelledby="comparison-heading"
          className="mx-auto max-w-7xl pb-12 sm:pb-16"
        >
          <div className="mb-5">
            <p className="text-xs uppercase tracking-[0.2em] text-blue-300">
              Side by side
            </p>
            <h2
              id="comparison-heading"
              className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              Compare sound devices
            </h2>
          </div>

          {comparedProducts.length < 2 ? (
            <p className="rounded-2xl border border-white/10 bg-white/2.5 p-5 text-sm text-gray-400">
              Choose one more device to compare features and specifications.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full min-w-160 border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/4">
                    <th scope="col" className="w-40 p-4 font-medium text-gray-400">
                      Feature
                    </th>
                    {comparedProducts.map((item) => (
                      <th
                        key={item.id}
                        scope="col"
                        className="min-w-40 p-4 font-semibold"
                      >
                        {item.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  <tr>
                    <th scope="row" className="p-4 font-medium text-gray-400">
                      Category
                    </th>
                    {comparedProducts.map((item) => (
                      <td key={item.id} className="p-4 text-gray-200">
                        {item.category}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row" className="p-4 font-medium text-gray-400">
                      Price
                    </th>
                    {comparedProducts.map((item) => (
                      <td key={item.id} className="p-4 text-gray-200">
                        ${item.price.toFixed(2)} {item.currency}
                      </td>
                    ))}
                  </tr>
                  {comparisonRows.map((label) => (
                    <tr key={label}>
                      <th scope="row" className="p-4 font-medium text-gray-400">
                        {label}
                      </th>
                      {comparedProducts.map((item) => (
                        <td key={item.id} className="p-4 text-gray-200">
                          {item.specifications.find(
                            (spec) => spec.label === label
                          )?.value ?? "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      <footer className="mx-auto max-w-7xl border-t border-white/10 py-6 text-xs text-gray-500">
        Orbit 3D · Educational product configurator · No real purchases
      </footer>
    </main>
  );
}
