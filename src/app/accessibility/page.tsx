"use client";

import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import { useAccessibilitySettings } from "@/hooks/useAccessibilitySettings";

export default function AccessibilityPage() {
  const { settings, updateSettings } = useAccessibilitySettings();
  const [notice, setNotice] = useState("");

  function update(
    setting: "reduceMotion" | "highContrast",
    value: boolean
  ) {
    try {
      updateSettings({ [setting]: value });
      setNotice("Accessibility preference saved on this device.");
    } catch (error) {
      console.error("Could not save accessibility preference.", error);
      setNotice("Could not save this preference. Check browser storage settings.");
    }
  }

  return (
    <main className="min-h-screen bg-[#090a0f] px-4 py-4 text-white sm:px-8 lg:px-12">
      <SiteHeader />
      <section className="mx-auto max-w-3xl py-12 sm:py-16">
        <p className="text-xs uppercase tracking-[0.2em] text-blue-300">
          Your experience
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Accessibility settings
        </h1>
        <p className="mt-4 text-sm leading-7 text-gray-400">
          These preferences are saved in this browser. Reduced motion also
          respects your operating system setting.
        </p>

        <div className="mt-8 space-y-4">
          <label className="flex items-start justify-between gap-5 rounded-2xl border border-white/10 bg-white/2.5 p-5">
            <span>
              <span className="block font-medium">Reduce animation</span>
              <span className="mt-2 block text-sm leading-6 text-gray-400">
                Pause decorative and product motion while this setting is on.
              </span>
            </span>
            <input
              type="checkbox"
              checked={settings.reduceMotion}
              onChange={(event) => update("reduceMotion", event.target.checked)}
              className="mt-1 h-5 w-5 accent-blue-400"
            />
          </label>

          <label className="flex items-start justify-between gap-5 rounded-2xl border border-white/10 bg-white/2.5 p-5">
            <span>
              <span className="block font-medium">High contrast</span>
              <span className="mt-2 block text-sm leading-6 text-gray-400">
                Increase text and border contrast across the experience.
              </span>
            </span>
            <input
              type="checkbox"
              checked={settings.highContrast}
              onChange={(event) => update("highContrast", event.target.checked)}
              className="mt-1 h-5 w-5 accent-blue-400"
            />
          </label>
        </div>

        {notice && (
          <p role="status" className="mt-4 text-sm text-blue-200">
            {notice}
          </p>
        )}
      </section>
    </main>
  );
}
