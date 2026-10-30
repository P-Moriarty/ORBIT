"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { products } from "@/data/productsList";

export type CartItem = {
  productId: string;
  finishId: string;
  configuration: Record<string, string>;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  addItem: (item: CartItem) => void;
  setItemQuantity: (item: CartItem, quantity: number) => void;
  removeItem: (item: CartItem) => void;
  clearCart: () => void;
};

const STORAGE_KEY = "orbit-3d-cart";
const CART_UPDATED_EVENT = "orbit-cart-updated";
const CartContext = createContext<CartContextValue | null>(null);

function subscribeToCart(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CART_UPDATED_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CART_UPDATED_EVENT, onChange);
  };
}

function getCartSnapshot() {
  return window.localStorage.getItem(STORAGE_KEY) ?? "[]";
}

function getServerCartSnapshot() {
  return "[]";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function defaultConfiguration(productId: string) {
  const product = products.find((item) => item.id === productId);
  if (!product) throw new Error(`Unknown product: ${productId}`);

  return Object.fromEntries(
    product.configurationOptions.map((option) => [
      option.id,
      option.choices[0].id,
    ])
  );
}

function isConfiguration(value: unknown, productId: string): value is Record<string, string> {
  if (!isRecord(value)) return false;
  const product = products.find((item) => item.id === productId);
  if (!product || Object.keys(value).length !== product.configurationOptions.length) {
    return false;
  }

  return product.configurationOptions.every((option) => {
    const choiceId = value[option.id];
    return (
      typeof choiceId === "string" &&
      option.choices.some((choice) => choice.id === choiceId)
    );
  });
}

function parseCart(snapshot: string): CartItem[] {
  const parsed: unknown = JSON.parse(snapshot);
  if (!Array.isArray(parsed)) throw new Error("Saved cart data has an invalid format.");

  return parsed.map((entry) => {
    if (!isRecord(entry)) {
      throw new Error("Saved cart data has an invalid format.");
    }

    const quantity = entry.quantity;
    const finishId = entry.finishId;
    if (
      typeof quantity !== "number" ||
      !Number.isInteger(quantity) ||
      quantity <= 0 ||
      typeof finishId !== "string"
    ) {
      throw new Error("Saved cart data has an invalid format.");
    }

    const productId =
      typeof entry.productId === "string"
        ? entry.productId
        : products.find((item) =>
            item.finishes.some((finish) => finish.id === finishId)
          )?.id;
    const product = products.find((item) => item.id === productId);
    if (
      !product ||
      !product.finishes.some((finish) => finish.id === finishId)
    ) {
      throw new Error("Saved cart data has an invalid product or finish.");
    }

    const configuration =
      entry.configuration === undefined
        ? defaultConfiguration(product.id)
        : entry.configuration;
    if (!isConfiguration(configuration, product.id)) {
      throw new Error("Saved cart data has an invalid configuration.");
    }

    return {
      productId: product.id,
      finishId,
      configuration,
      quantity,
    };
  });
}

function configurationKey(configuration: Record<string, string>) {
  return JSON.stringify(
    Object.fromEntries(
      Object.entries(configuration).sort(([first], [second]) =>
        first.localeCompare(second)
      )
    )
  );
}

function sameCartLine(first: CartItem, second: CartItem) {
  return (
    first.productId === second.productId &&
    first.finishId === second.finishId &&
    configurationKey(first.configuration) ===
      configurationKey(second.configuration)
  );
}

function saveCart(items: CartItem[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(
    subscribeToCart,
    getCartSnapshot,
    getServerCartSnapshot
  );
  const items = useMemo(() => parseCart(snapshot), [snapshot]);

  const addItem = useCallback((newItem: CartItem) => {
      const currentItems = parseCart(getCartSnapshot());
      const existing = currentItems.find((item) => sameCartLine(item, newItem));
      const updatedItems = existing
        ? currentItems.map((item) =>
            sameCartLine(item, newItem)
              ? { ...item, quantity: item.quantity + newItem.quantity }
              : item
          )
        : [...currentItems, newItem];
      saveCart(updatedItems);
    }, []);

  const setItemQuantity = useCallback(
    (targetItem: CartItem, quantity: number) => {
      const currentItems = parseCart(getCartSnapshot());
      const updatedItems =
        quantity <= 0
          ? currentItems.filter((item) => !sameCartLine(item, targetItem))
          : currentItems.map((item) =>
              sameCartLine(item, targetItem)
                ? { ...item, quantity }
                : item
            );
      saveCart(updatedItems);
    },
    []
  );

  const removeItem = useCallback((targetItem: CartItem) => {
    const currentItems = parseCart(getCartSnapshot());
    saveCart(currentItems.filter((item) => !sameCartLine(item, targetItem)));
  }, []);

  const clearCart = useCallback(() => {
    saveCart([]);
  }, []);

  const value = useMemo(
    () => ({
      items,
      itemCount: items.reduce((count, item) => count + item.quantity, 0),
      addItem,
      setItemQuantity,
      removeItem,
      clearCart,
    }),
    [items, addItem, setItemQuantity, removeItem, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider.");
  }
  return context;
}
