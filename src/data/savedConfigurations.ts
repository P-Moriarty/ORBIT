import { products } from "@/data/productsList";

export type SavedConfiguration = {
  id: string;
  productId: string;
  finishId: string;
  options: Record<string, string>;
  createdAt: string;
};

const STORAGE_KEY = "orbit-3d-saved-configurations";
const UPDATED_EVENT = "orbit-saved-configurations-updated";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validOptions(value: unknown, productId: string): value is Record<string, string> {
  if (!isRecord(value)) return false;
  const product = products.find((item) => item.id === productId);
  if (!product || Object.keys(value).length !== product.configurationOptions.length) {
    return false;
  }

  return product.configurationOptions.every((option) => {
    const choiceId = value[option.id];
    return (
      typeof choiceId === "string" &&
      option.choices.some((choice) => choice.id === choiceId)
    );
  });
}

export function parseSavedConfigurations(snapshot: string): SavedConfiguration[] {
  const value: unknown = JSON.parse(snapshot);
  if (!Array.isArray(value)) {
    throw new Error("Saved configurations have an invalid format.");
  }

  return value.map((entry) => {
    if (
      !isRecord(entry) ||
      typeof entry.id !== "string" ||
      typeof entry.productId !== "string" ||
      typeof entry.finishId !== "string" ||
      typeof entry.createdAt !== "string" ||
      !validOptions(entry.options, entry.productId)
    ) {
      throw new Error("A saved configuration has invalid data.");
    }

    const product = products.find((item) => item.id === entry.productId);
    if (!product?.finishes.some((finish) => finish.id === entry.finishId)) {
      throw new Error("A saved configuration references an unknown finish.");
    }

    return {
      id: entry.id,
      productId: entry.productId,
      finishId: entry.finishId,
      options: entry.options,
      createdAt: entry.createdAt,
    };
  });
}

export function subscribeToSavedConfigurations(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(UPDATED_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(UPDATED_EVENT, onChange);
  };
}

export function getSavedConfigurationsSnapshot() {
  return window.localStorage.getItem(STORAGE_KEY) ?? "[]";
}

export function getServerSavedConfigurationsSnapshot() {
  return "[]";
}

export function saveConfiguration(configuration: SavedConfiguration) {
  const current = parseSavedConfigurations(getSavedConfigurationsSnapshot());
  const next = [configuration, ...current];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(UPDATED_EVENT));
}

export function deleteSavedConfiguration(id: string) {
  const current = parseSavedConfigurations(getSavedConfigurationsSnapshot());
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(current.filter((item) => item.id !== id))
  );
  window.dispatchEvent(new Event(UPDATED_EVENT));
}
