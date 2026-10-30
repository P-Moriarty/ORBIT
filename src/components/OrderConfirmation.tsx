"use client";

import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { products } from "@/data/productsList";
import {
  getDemoOrderSnapshot,
  getServerDemoOrderSnapshot,
  MISSING_DEMO_ORDER_SNAPSHOT,
  parseDemoOrderSnapshot,
  subscribeToDemoOrder,
  type DemoOrder,
} from "@/data/demoOrders";

export default function OrderConfirmation({ orderId }: { orderId: string }) {
  const subscribe = useCallback(
    (onChange: () => void) => subscribeToDemoOrder(onChange),
    []
  );
  const getSnapshot = useCallback(
    () => getDemoOrderSnapshot(orderId),
    [orderId]
  );
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerDemoOrderSnapshot
  );
  const result = useMemo(() => {
    if (snapshot === null) return { status: "loading" } as const;
    if (snapshot === MISSING_DEMO_ORDER_SNAPSHOT) {
      return { status: "missing" } as const;
    }
    try {
      const order = parseDemoOrderSnapshot(snapshot, orderId);
      return order
        ? ({ status: "ready", order } as const)
        : ({ status: "missing" } as const);
    } catch (error) {
      return { status: "error", error } as const;
    }
  }, [orderId, snapshot]);

  useEffect(() => {
    if (result.status === "error") {
      console.error("Could not read the demo order.", result.error);
    }
  }, [result]);

  const order: DemoOrder | null =
    result.status === "ready" ? result.order : null;

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-8 text-white sm:px-8">
      <Link href="/" className="text-xl font-bold tracking-[0.18em]">
        ORBIT<span className="text-blue-400">.</span>
      </Link>
      <section className="mt-12 rounded-2xl border border-white/10 bg-white/2.5 p-6 sm:p-9">
        {result.status === "loading" && (
          <p role="status" className="text-gray-300">
            Loading demo order…
          </p>
        )}
        {result.status === "missing" && (
          <>
            <h1 className="text-3xl font-semibold">Order not found</h1>
            <p className="mt-3 text-sm leading-6 text-gray-400">
              Demo orders are stored only in the browser that created them.
              This order may have been cleared from local storage.
            </p>
          </>
        )}
        {result.status === "error" && (
          <>
            <h1 className="text-3xl font-semibold">Could not load this order</h1>
            <p className="mt-3 text-sm leading-6 text-gray-400">
              Browser storage may be unavailable or the saved order may be
              invalid.
            </p>
          </>
        )}
        {result.status === "ready" && order && (
          <>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">
              Demo checkout complete
            </p>
            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
              Thanks for exploring Orbit.
            </h1>
            <p className="mt-3 text-sm leading-6 text-gray-400">
              This is a local demo receipt. No payment was collected, no order
              was sent to a store, and no product will be shipped.
            </p>
            <dl className="mt-6 grid gap-3 rounded-xl border border-white/10 p-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-gray-500">Demo order reference</dt>
                <dd className="mt-1 break-all font-mono">{order.id}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Created on this device</dt>
                <dd className="mt-1">
                  {new Date(order.createdAt).toLocaleString()}
                </dd>
              </div>
            </dl>
            <h2 className="mt-7 font-semibold">Order summary</h2>
            <ul className="mt-3 divide-y divide-white/10 rounded-xl border border-white/10">
              {order.items.map((item) => {
                const product = products.find(
                  (entry) => entry.id === item.productId
                );
                const finish = product?.finishes.find(
                  (entry) => entry.id === item.finishId
                );
                if (!product || !finish) {
                  throw new Error(
                    `Unknown demo order item: ${item.productId}/${item.finishId}`
                  );
                }
                return (
                  <li
                    key={`${item.productId}-${item.finishId}-${JSON.stringify(item.configuration)}`}
                    className="flex justify-between gap-4 p-4 text-sm"
                  >
                    <span>
                      {product.name} · {finish.name} × {item.quantity}
                      {product.configurationOptions.map((option) => {
                        const choice = option.choices.find(
                          (entry) =>
                            entry.id === item.configuration[option.id]
                        );
                        return (
                          <span
                            key={option.id}
                            className="mt-1 block text-xs text-gray-400"
                          >
                            {option.label}: {choice?.label ?? "Default"}
                          </span>
                        );
                      })}
                    </span>
                    <span className="shrink-0">
                      ${(product.price * item.quantity).toFixed(2)}
                    </span>
                  </li>
                );
              })}
              <li className="flex justify-between p-4 font-semibold">
                <span>Demo total</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </li>
            </ul>
          </>
        )}
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/products"
            className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-gray-200"
          >
            Continue exploring
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-white/15 px-5 py-3 text-sm hover:bg-white/10"
          >
            Home
          </Link>
        </div>
      </section>
    </main>
  );
}
