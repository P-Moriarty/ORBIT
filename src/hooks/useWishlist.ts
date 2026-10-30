"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  getServerWishlistSnapshot,
  getWishlistSnapshot,
  parseWishlist,
  subscribeToWishlist,
  toggleWishlistProduct,
} from "@/data/wishlist";

export function useWishlist() {
  const snapshot = useSyncExternalStore(
    subscribeToWishlist,
    getWishlistSnapshot,
    getServerWishlistSnapshot
  );
  const productIds = useMemo(() => parseWishlist(snapshot), [snapshot]);

  return {
    productIds,
    toggleWishlist: toggleWishlistProduct,
  };
}
