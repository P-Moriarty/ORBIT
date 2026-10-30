"use client";

import { useWishlist } from "@/hooks/useWishlist";
import { useState } from "react";

export default function WishlistButton({
  productId,
  className = "",
}: {
  productId: string;
  className?: string;
}) {
  const { productIds, toggleWishlist } = useWishlist();
  const [notice, setNotice] = useState("");
  const isSaved = productIds.includes(productId);

  return (
    <span className="inline-flex flex-col items-start">
      <button
        type="button"
        aria-pressed={isSaved}
        aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
        onClick={() => {
          try {
            toggleWishlist(productId);
            setNotice("");
          } catch (error) {
            console.error("Could not update the wishlist.", error);
            setNotice("Could not update wishlist storage.");
          }
        }}
        className={`rounded-xl border border-white/15 px-4 py-2.5 text-sm transition hover:border-white/40 hover:bg-white/10 ${className}`}
      >
        {isSaved ? "Saved to wishlist" : "Add to wishlist"}
      </button>
      {notice && (
        <span role="status" className="mt-1 text-xs text-amber-200">
          {notice}
        </span>
      )}
    </span>
  );
}
