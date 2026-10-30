export type AccessibilitySettings = {
  reduceMotion: boolean;
  highContrast: boolean;
};

const STORAGE_KEY = "orbit-3d-accessibility";
const UPDATED_EVENT = "orbit-accessibility-updated";
const DEFAULT_SNAPSHOT = '{"reduceMotion":false,"highContrast":false}';

export function subscribeToAccessibilitySettings(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(UPDATED_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(UPDATED_EVENT, onChange);
  };
}

export function getAccessibilitySnapshot() {
  return window.localStorage.getItem(STORAGE_KEY) ?? DEFAULT_SNAPSHOT;
}

export function getServerAccessibilitySnapshot() {
  return DEFAULT_SNAPSHOT;
}

export function parseAccessibilitySettings(
  snapshot: string
): AccessibilitySettings {
  const parsed: unknown = JSON.parse(snapshot);
  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !("reduceMotion" in parsed) ||
    typeof parsed.reduceMotion !== "boolean" ||
    !("highContrast" in parsed) ||
    typeof parsed.highContrast !== "boolean"
  ) {
    throw new Error("Saved accessibility settings have an invalid format.");
  }
  return {
    reduceMotion: parsed.reduceMotion,
    highContrast: parsed.highContrast,
  };
}

export function updateAccessibilitySettings(
  update: Partial<AccessibilitySettings>
) {
  const current = parseAccessibilitySettings(getAccessibilitySnapshot());
  const next = { ...current, ...update };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(UPDATED_EVENT));
}
