import { products } from "@/data/productsList";
import type { CartItem } from "@/components/CartProvider";

export type DemoOrder = {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
};

const STORAGE_PREFIX = "orbit-3d-demo-order:";
const ORDER_UPDATED_EVENT = "orbit-demo-orders-updated";
export const MISSING_DEMO_ORDER_SNAPSHOT = "__orbit_demo_order_missing__";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isConfiguration(
  value: unknown,
  productId: string
): value is Record<string, string> {
  if (!isRecord(value)) return false;
  const product = products.find((item) => item.id === productId);
  return (
    !!product &&
    Object.keys(value).length === product.configurationOptions.length &&
    product.configurationOptions.every((option) => {
      const choiceId = value[option.id];
      return (
        typeof choiceId === "string" &&
        option.choices.some((choice) => choice.id === choiceId)
      );
    })
  );
}

function normalizeItems(value: unknown): CartItem[] {
  if (!Array.isArray(value)) {
    throw new Error("Demo order items have an invalid format.");
  }
  return value.map((entry) => {
    if (
      !isRecord(entry) ||
      typeof entry.productId !== "string" ||
      typeof entry.finishId !== "string" ||
      typeof entry.quantity !== "number" ||
      !Number.isInteger(entry.quantity) ||
      entry.quantity <= 0 ||
      !isConfiguration(entry.configuration, entry.productId)
    ) {
      throw new Error("A demo order item has invalid data.");
    }

    const product = products.find((item) => item.id === entry.productId);
    if (!product?.finishes.some((finish) => finish.id === entry.finishId)) {
      throw new Error("A demo order item references an unknown product finish.");
    }

    return {
      productId: product.id,
      finishId: entry.finishId,
      configuration: entry.configuration,
      quantity: entry.quantity,
    };
  });
}

export function createDemoOrder(items: readonly CartItem[]): string {
  if (items.length === 0) {
    throw new Error("Cannot create a demo order from an empty cart.");
  }
  const normalizedItems = normalizeItems(items);
  const id = crypto.randomUUID();
  const order: DemoOrder = {
    id,
    createdAt: new Date().toISOString(),
    items: normalizedItems,
    subtotal: normalizedItems.reduce((total, item) => {
      const product = products.find((candidate) => candidate.id === item.productId);
      if (!product) throw new Error(`Unknown demo order product: ${item.productId}`);
      return total + product.price * item.quantity;
    }, 0),
  };
  window.localStorage.setItem(`${STORAGE_PREFIX}${id}`, JSON.stringify(order));
  window.dispatchEvent(new Event(ORDER_UPDATED_EVENT));
  return id;
}

export function subscribeToDemoOrder(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(ORDER_UPDATED_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(ORDER_UPDATED_EVENT, onChange);
  };
}

export function getDemoOrderSnapshot(id: string) {
  if (!/^[\da-f-]{36}$/i.test(id)) return MISSING_DEMO_ORDER_SNAPSHOT;
  return (
    window.localStorage.getItem(`${STORAGE_PREFIX}${id}`) ??
    MISSING_DEMO_ORDER_SNAPSHOT
  );
}

export function getServerDemoOrderSnapshot() {
  return null;
}

export function parseDemoOrderSnapshot(
  snapshot: string,
  id: string
): DemoOrder | null {
  if (snapshot === MISSING_DEMO_ORDER_SNAPSHOT) return null;
  const parsed: unknown = JSON.parse(snapshot);
  if (
    !isRecord(parsed) ||
    parsed.id !== id ||
    typeof parsed.createdAt !== "string" ||
    Number.isNaN(Date.parse(parsed.createdAt))
  ) {
    throw new Error("Saved demo order has an invalid format.");
  }

  const items = normalizeItems(parsed.items);
  return {
    id,
    createdAt: parsed.createdAt,
    items,
    subtotal: items.reduce((total, item) => {
      const product = products.find((candidate) => candidate.id === item.productId);
      if (!product) throw new Error(`Unknown demo order product: ${item.productId}`);
      return total + product.price * item.quantity;
    }, 0),
  };
}
