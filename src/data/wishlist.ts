import { products } from "@/data/productsList";

const STORAGE_KEY = "orbit-3d-wishlist";
const UPDATED_EVENT = "orbit-wishlist-updated";

export function subscribeToWishlist(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(UPDATED_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(UPDATED_EVENT, onChange);
  };
}

export function getWishlistSnapshot() {
  return window.localStorage.getItem(STORAGE_KEY) ?? "[]";
}

export function getServerWishlistSnapshot() {
  return "[]";
}

export function parseWishlist(snapshot: string): string[] {
  const parsed: unknown = JSON.parse(snapshot);
  if (
    !Array.isArray(parsed) ||
    !parsed.every(
      (id): id is string =>
        typeof id === "string" && products.some((product) => product.id === id)
    )
  ) {
    throw new Error("Saved wishlist data has an invalid format.");
  }
  if (new Set(parsed).size !== parsed.length) {
    throw new Error("Saved wishlist data contains duplicate products.");
  }
  return parsed;
}

export function toggleWishlistProduct(productId: string) {
  if (!products.some((product) => product.id === productId)) {
    throw new Error(`Unknown wishlist product: ${productId}`);
  }
  const current = parseWishlist(getWishlistSnapshot());
  const next = current.includes(productId)
    ? current.filter((id) => id !== productId)
    : [...current, productId];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(UPDATED_EVENT));
}
