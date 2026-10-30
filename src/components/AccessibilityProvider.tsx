"use client";

import { useEffect, type ReactNode } from "react";
import { useAccessibilitySettings } from "@/hooks/useAccessibilitySettings";

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const { settings } = useAccessibilitySettings();

  useEffect(() => {
    document.documentElement.dataset.contrast = settings.highContrast
      ? "high"
      : "normal";
    document.documentElement.dataset.reduceMotion = settings.reduceMotion
      ? "true"
      : "false";
  }, [settings.highContrast, settings.reduceMotion]);

  return children;
}
