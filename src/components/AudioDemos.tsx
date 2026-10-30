"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/data/productsList";

type Preset = {
  id: string;
  label: string;
  frequency: number;
};

const presets: readonly Preset[] = [
  { id: "warm", label: "Warm", frequency: 220 },
  { id: "balanced", label: "Balanced", frequency: 330 },
  { id: "bright", label: "Bright", frequency: 440 },
];

export default function AudioDemos({
  product,
}: {
  product: Product;
}) {
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!activePreset) return;
    const preset = presets.find((item) => item.id === activePreset);
    if (!preset) throw new Error(`Unknown audio preset: ${activePreset}`);

    const AudioContextConstructor = window.AudioContext;
    if (!AudioContextConstructor) return;

    const context = new AudioContextConstructor();
    const oscillator = context.createOscillator();
    const volume = context.createGain();
    let cancelled = false;
    let started = false;
    let ended = false;

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(preset.frequency, context.currentTime);
    oscillator.frequency.linearRampToValueAtTime(
      preset.frequency * 1.5,
      context.currentTime + 1.2
    );
    volume.gain.setValueAtTime(0.0001, context.currentTime);
    volume.gain.exponentialRampToValueAtTime(0.035, context.currentTime + 0.08);
    volume.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 1.5);
    oscillator.connect(volume);
    volume.connect(context.destination);
    oscillator.onended = () => {
      ended = true;
      if (!cancelled) setActivePreset(null);
    };

    void context
      .resume()
      .then(() => {
        if (cancelled) return;
        oscillator.start();
        started = true;
        oscillator.stop(context.currentTime + 1.5);
        setNotice(`${preset.label} synthesized preview playing.`);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        console.error("Could not start the audio preview.", error);
        setNotice("Could not start audio. Check your browser audio settings.");
        setActivePreset(null);
      });

    return () => {
      cancelled = true;
      if (started && !ended) oscillator.stop();
      oscillator.disconnect();
      volume.disconnect();
      void context.close();
    };
  }, [activePreset]);

  return (
    <section
      aria-labelledby="audio-preview-heading"
      className="rounded-2xl border border-white/10 bg-white/2.5 p-5"
    >
      <p className="text-xs uppercase tracking-[0.18em] text-blue-300">
        Listening preview
      </p>
      <h2 id="audio-preview-heading" className="mt-2 text-lg font-semibold">
        Synthesized tone samples
      </h2>
      <p className="mt-2 text-sm leading-6 text-gray-400">
        These short generated tones demonstrate the player only; they are not
        recordings or sound-quality claims for {product.name}.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            aria-pressed={activePreset === preset.id}
            onClick={() => {
              if (!window.AudioContext) {
                setNotice("Audio previews are not supported in this browser.");
                return;
              }
              setNotice("");
              setActivePreset((current) =>
                current === preset.id ? null : preset.id
              );
            }}
            className="rounded-xl border border-white/15 px-4 py-2 text-sm transition hover:bg-white/10"
          >
            {activePreset === preset.id ? "Stop" : "Play"} {preset.label}
          </button>
        ))}
      </div>
      {notice && (
        <p role="status" className="mt-3 text-xs text-gray-400">
          {notice}
        </p>
      )}
    </section>
  );
}
