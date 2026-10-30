"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  getAccessibilitySnapshot,
  getServerAccessibilitySnapshot,
  parseAccessibilitySettings,
  subscribeToAccessibilitySettings,
  updateAccessibilitySettings,
} from "@/data/accessibilitySettings";

export function useAccessibilitySettings() {
  const snapshot = useSyncExternalStore(
    subscribeToAccessibilitySettings,
    getAccessibilitySnapshot,
    getServerAccessibilitySnapshot
  );
  const settings = useMemo(
    () => parseAccessibilitySettings(snapshot),
    [snapshot]
  );

  return { settings, updateSettings: updateAccessibilitySettings };
}
