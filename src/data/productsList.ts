export type ProductFinish = {
  id: string;
  name: string;
  color: string;
};

export type ProductSpecification = {
  label: string;
  value: string;
};

export type ProductConfigurationOption = {
  id: string;
  label: string;
  choices: readonly {
    id: string;
    label: string;
  }[];
};

export type Product = {
  id: string;
  name: string;
  deviceType: "portable-speaker" | "studio-monitor" | "turntable" | "headphones";
  category: string;
  price: number;
  currency: string;
  description: string;
  finishes: readonly ProductFinish[];
  configurationOptions: readonly ProductConfigurationOption[];
  specifications: readonly ProductSpecification[];
};

export const products: readonly Product[] = [
  {
    id: "orbit-headphones",
    name: "Orbit Pulse",
    deviceType: "portable-speaker",
    category: "Portable Bluetooth speaker",
    price: 129.99,
    currency: "USD",
    description:
      "A compact wireless speaker concept with room-filling sound and a clean, sculptural silhouette.",
    finishes: [
      { id: "midnight", name: "Midnight", color: "#555c70" },
      { id: "blue", name: "Electric Blue", color: "#4169e1" },
      { id: "copper", name: "Copper", color: "#c77b51" },
    ],
    configurationOptions: [
      {
        id: "grille",
        label: "Grille style",
        choices: [
          { id: "woven", label: "Woven fabric" },
          { id: "precision", label: "Precision metal" },
        ],
      },
    ],
    specifications: [
      { label: "Connectivity", value: "Bluetooth concept" },
      { label: "Form", value: "Portable, full-range speaker" },
      { label: "Finish options", value: "3" },
      { label: "Model", value: "Orbit Pulse — concept" },
    ],
  },
  {
    id: "orbit-studio",
    name: "Orbit Monitor",
    deviceType: "studio-monitor",
    category: "Studio monitor speaker",
    price: 189.99,
    currency: "USD",
    description:
      "A precision near-field monitor concept designed for balanced sound and focused creative work.",
    finishes: [
      { id: "studio-graphite", name: "Graphite", color: "#343943" },
      { id: "studio-silver", name: "Silver", color: "#aeb8c8" },
      { id: "studio-violet", name: "Violet", color: "#7969ad" },
    ],
    configurationOptions: [
      {
        id: "orientation",
        label: "Cabinet orientation",
        choices: [
          { id: "upright", label: "Upright" },
          { id: "landscape", label: "Landscape" },
        ],
      },
    ],
    specifications: [
      { label: "Connectivity", value: "Balanced audio concept" },
      { label: "Form", value: "Two-way active monitor" },
      { label: "Finish options", value: "3" },
      { label: "Model", value: "Orbit Monitor — concept" },
    ],
  },
  {
    id: "orbit-flex",
    name: "Orbit Vinyl",
    deviceType: "turntable",
    category: "Wireless turntable",
    price: 99.99,
    currency: "USD",
    description:
      "A modern turntable concept that pairs tactile vinyl playback with a minimal, wireless-ready design.",
    finishes: [
      { id: "flex-black", name: "Carbon", color: "#292d35" },
      { id: "flex-lime", name: "Volt", color: "#a4c639" },
      { id: "flex-coral", name: "Coral", color: "#e47770" },
    ],
    configurationOptions: [
      {
        id: "platter-mat",
        label: "Platter mat",
        choices: [
          { id: "felt", label: "Felt" },
          { id: "rubber", label: "Rubber" },
        ],
      },
    ],
    specifications: [
      { label: "Connectivity", value: "Wireless output concept" },
      { label: "Form", value: "Belt-drive turntable" },
      { label: "Finish options", value: "3" },
      { label: "Model", value: "Orbit Vinyl — concept" },
    ],
  },
  {
    id: "orbit-one",
    name: "Orbit One",
    deviceType: "headphones",
    category: "Wireless over-ear headphones",
    price: 149.99,
    currency: "USD",
    description:
      "A comfortable over-ear headphone concept with immersive wireless sound and refined everyday styling.",
    finishes: [
      { id: "one-midnight", name: "Midnight", color: "#555c70" },
      { id: "one-blue", name: "Electric Blue", color: "#4169e1" },
      { id: "one-copper", name: "Copper", color: "#c77b51" },
    ],
    configurationOptions: [
      {
        id: "cushions",
        label: "Cushion material",
        choices: [
          { id: "leather", label: "Soft-touch leather" },
          { id: "velour", label: "Breathable velour" },
        ],
      },
    ],
    specifications: [
      { label: "Connectivity", value: "Bluetooth concept" },
      { label: "Form", value: "Over-ear, closed-back" },
      { label: "Finish options", value: "3" },
      { label: "Model", value: "Orbit One — concept" },
    ],
  },
];

export const product = products[0];
