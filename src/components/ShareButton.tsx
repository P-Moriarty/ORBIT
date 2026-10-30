"use client";

import { useState } from "react";

export default function ShareButton({
  title,
  url: sharePath,
  className = "",
}: {
  title: string;
  url?: string;
  className?: string;
}) {
  const [notice, setNotice] = useState("");

  async function share() {
    const url = sharePath
      ? new URL(sharePath, window.location.origin).toString()
      : window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        setNotice("Share sheet opened.");
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setNotice("Product link copied.");
      } else {
        throw new Error("Sharing and clipboard access are unavailable.");
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      console.error("Could not share this product.", error);
      setNotice("Could not share. Copy the address from your browser.");
    }
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={share}
        className="rounded-xl border border-white/15 px-4 py-2.5 text-sm transition hover:border-white/40 hover:bg-white/10"
      >
        Share product
      </button>
      {notice && (
        <p role="status" className="mt-2 text-xs text-gray-400">
          {notice}
        </p>
      )}
    </div>
  );
}
