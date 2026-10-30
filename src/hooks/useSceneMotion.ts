"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  getAccessibilitySnapshot,
  getServerAccessibilitySnapshot,
  parseAccessibilitySettings,
  subscribeToAccessibilitySettings,
} from "@/data/accessibilitySettings";

function subscribeToMotionPreference(onChange: () => void) {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
}

function getMotionPreference() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerMotionPreference() {
  return true;
}

function subscribeToVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

function getVisibility() {
  return document.visibilityState === "visible";
}

function getServerVisibility() {
  return true;
}

export function useSceneMotion() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(true);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToMotionPreference,
    getMotionPreference,
    getServerMotionPreference
  );
  const isDocumentVisible = useSyncExternalStore(
    subscribeToVisibility,
    getVisibility,
    getServerVisibility
  );
  const accessibilitySnapshot = useSyncExternalStore(
    subscribeToAccessibilitySettings,
    getAccessibilitySnapshot,
    getServerAccessibilitySnapshot
  );
  const userRequestsReducedMotion =
    parseAccessibilitySettings(accessibilitySnapshot).reduceMotion;

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.01 }
    );
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return {
    containerRef,
    shouldAnimate:
      isInView &&
      isDocumentVisible &&
      !prefersReducedMotion &&
      !userRequestsReducedMotion,
  };
}
