"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import SiteHeader from "@/components/SiteHeader";
import { createDemoOrder } from "@/data/demoOrders";
import { products } from "@/data/productsList";

export default function CartPage() {
  const router = useRouter();
  const { items, itemCount, setItemQuantity, removeItem, clearCart } = useCart();
  const [checkoutNotice, setCheckoutNotice] = useState("");
  const subtotal = items.reduce(
    (total, item) => {
      const itemProduct = products.find(
        (product) => product.id === item.productId
      );
      return total + (itemProduct?.price ?? 0) * item.quantity;
    },
    0
  );

  function completeDemoCheckout() {
    try {
      const orderId = createDemoOrder(items);
      clearCart();
      router.push(`/order-confirmation/${orderId}`);
    } catch (error) {
      console.error("Could not complete the demo checkout.", error);
      setCheckoutNotice(
        "Could not save your demo order. Check browser storage settings and try again."
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#090a0f] px-4 py-6 text-white sm:px-8 lg:px-12">
      <SiteHeader />

      <section className="mx-auto max-w-5xl py-10 sm:py-14">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Your cart
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Review your demo order.
        </p>

        {checkoutNotice && (
          <div
            role="status"
            className="mt-8 rounded-2xl border border-green-500/30 bg-green-500/10 p-5 text-sm text-green-300"
          >
            {checkoutNotice}
          </div>
        )}

        {items.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/3 p-8 text-center sm:p-12">
            <p className="text-lg font-medium">
              {checkoutNotice
                ? "Demo checkout could not be completed."
                : "Your cart is empty"}
            </p>
            <p className="mt-2 text-sm text-gray-400">
              {checkoutNotice
                ? checkoutNotice
                : "Choose a model and add it to your demo cart."}
            </p>
            <Link
              href="/configure"
              className="mt-6 inline-flex rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
            <div>
              <div className="mb-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    clearCart();
                    setCheckoutNotice("");
                  }}
                  className="text-sm text-gray-400 underline decoration-white/20 underline-offset-4 hover:text-white"
                >
                  Clear cart
                </button>
              </div>
              <ul className="divide-y divide-white/10 rounded-2xl border border-white/10">
                {items.map((item) => {
                const itemProduct = products.find(
                  (entry) => entry.id === item.productId
                );
                const finish = itemProduct?.finishes.find(
                  (entry) => entry.id === item.finishId
                );
                if (!itemProduct || !finish) {
                  throw new Error(
                    `Unknown cart item: ${item.productId}/${item.finishId}`
                  );
                }

                return (
                  <li
                    key={`${item.productId}-${item.finishId}-${JSON.stringify(item.configuration)}`}
                    className="flex flex-wrap items-center justify-between gap-5 p-5 sm:p-6"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <span
                        aria-hidden="true"
                        className="h-12 w-12 shrink-0 rounded-xl border border-white/10"
                        style={{ backgroundColor: finish.color }}
                      />
                      <div>
                        <h2 className="font-medium">{itemProduct.name}</h2>
                        <p className="mt-1 text-sm text-gray-400">
                          {finish.name} finish
                        </p>
                        {itemProduct.configurationOptions.map((option) => {
                          const choice = option.choices.find(
                            (entry) =>
                              entry.id === item.configuration[option.id]
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
                        <p className="mt-1 text-sm text-gray-400">
                          ${itemProduct.price.toFixed(2)} each
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        aria-label={`Decrease ${finish.name} quantity`}
                        onClick={() =>
                          setItemQuantity(item, item.quantity - 1)
                        }
                        className="h-9 w-9 rounded-lg border border-white/15 hover:bg-white/10"
                      >
                        −
                      </button>
                      <span
                        aria-live="polite"
                        className="min-w-6 text-center text-sm"
                      >
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label={`Increase ${finish.name} quantity`}
                        onClick={() =>
                          setItemQuantity(item, item.quantity + 1)
                        }
                        className="h-9 w-9 rounded-lg border border-white/15 hover:bg-white/10"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          removeItem(item)
                        }
                        className="ml-2 text-sm text-gray-400 hover:text-white"
                      >
                        Remove
                      </button>
                    </div>

                    <p className="w-full text-right font-medium sm:w-auto">
                      ${(itemProduct.price * item.quantity).toFixed(2)}
                    </p>
                  </li>
                );
                })}
              </ul>
            </div>

            <aside className="h-fit rounded-2xl border border-white/10 bg-white/3 p-6">
              <h2 className="text-lg font-semibold">Order summary</h2>
              <div className="mt-5 flex justify-between text-sm text-gray-400">
                <span>Items ({itemCount})</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="mt-4 flex justify-between border-t border-white/10 pt-4 font-semibold">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <p className="mt-4 text-xs leading-5 text-gray-500">
                Demo cart only. No payment or purchase will be processed.
              </p>
              <button
                type="button"
                onClick={completeDemoCheckout}
                className="mt-6 inline-flex w-full justify-center rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-300"
              >
                Complete demo checkout
              </button>
              <Link
                href="/configure"
                className="mt-3 inline-flex w-full justify-center rounded-xl border border-white/15 px-5 py-3 text-sm font-medium transition hover:bg-white/10"
              >
                Continue shopping
              </Link>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
