
"use client";

import { useState } from "react";
import type { Product } from "@/data/productsList";

type Props = {
  product: Product;
  selectedFinish: string;
  selectedOptions: Record<string, string>;
  onFinishChange: (finishId: string) => void;
  onOptionChange: (optionId: string, choiceId: string) => void;
  onAddToCart: (quantity: number) => void;
};

export default function ProductConfigurator({
  product,
  selectedFinish,
  selectedOptions,
  onFinishChange,
  onOptionChange,
  onAddToCart,
}: Props) {
  const [quantity, setQuantity] = useState(1);

  const finish = product.finishes.find(
    (item) => item.id === selectedFinish
  ) ?? product.finishes[0];

  return (
    <div className="space-y-7">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-blue-400">
          {product.category}
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          {product.name}
        </h1>
        <p className="mt-4 leading-7 text-gray-400">
          {product.description}
        </p>
        <p className="mt-6 text-3xl font-semibold">
          ${product.price.toFixed(2)}
          <span className="ml-2 text-sm font-normal text-gray-500">
            {product.currency} · Demo price
          </span>
        </p>
        <p className="mt-2 text-sm text-emerald-300">
          Available to configure · No physical stock
        </p>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-medium">Choose finish</span>
          <span className="text-sm text-gray-400">{finish.name}</span>
        </div>

        <div className="flex flex-wrap gap-3">
          {product.finishes.map((item) => {
            const selected = item.id === selectedFinish;

            return (
              <button
                key={item.id}
                type="button"
                aria-label={`Choose ${item.name} finish`}
                aria-pressed={selected}
                onClick={() => onFinishChange(item.id)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                  selected
                    ? "border-white bg-white/10"
                    : "border-white/15 hover:border-white/50"
                }`}
              >
                <span
                  className="h-4 w-4 rounded-full border border-white/20"
                  style={{ backgroundColor: item.color }}
                />
                {item.name}
              </button>
            );
          })}
        </div>
      </div>

      {product.configurationOptions.map((option) => (
        <fieldset key={option.id}>
          <legend className="mb-3 text-sm font-medium">{option.label}</legend>
          <div className="flex flex-wrap gap-2">
            {option.choices.map((choice) => {
              const selected = selectedOptions[option.id] === choice.id;

              return (
                <button
                  key={choice.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onOptionChange(option.id, choice.id)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    selected
                      ? "border-blue-300 bg-blue-400/10 text-white"
                      : "border-white/15 text-gray-300 hover:border-white/50"
                  }`}
                >
                  {choice.label}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}

      <div>
        <p className="mb-3 text-sm font-medium">Quantity</p>
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Decrease quantity"
            disabled={quantity <= 1}
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            className="h-11 w-11 rounded-lg border border-white/15 disabled:cursor-not-allowed disabled:opacity-30"
          >
            −
          </button>

          <span aria-live="polite" className="min-w-5 text-center">
            {quantity}
          </span>

          <button
            type="button"
            aria-label="Increase quantity"
            disabled={quantity >= 10}
            onClick={() => setQuantity((value) => Math.min(10, value + 1))}
            className="h-11 w-11 rounded-lg border border-white/15 disabled:cursor-not-allowed disabled:opacity-30"
          >
            +
          </button>

          <span className="ml-auto text-sm text-gray-400">
            ${(product.price * quantity).toFixed(2)}
          </span>
        </div>
      </div>

      <div className="sticky bottom-2 z-20 rounded-xl border border-white/10 bg-[#090a0f]/95 p-2 shadow-2xl backdrop-blur lg:static lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none">
        <button
          type="button"
          onClick={() => onAddToCart(quantity)}
          className="min-h-12 w-full rounded-xl bg-blue-500 px-6 py-4 font-semibold text-white transition hover:bg-blue-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-300"
        >
          Add to demo cart — ${(product.price * quantity).toFixed(2)}
        </button>
      </div>

      <div className="border-t border-white/10 pt-5">
        <h2 className="mb-4 text-sm font-semibold">Product specifications</h2>
        <dl className="space-y-3">
          {product.specifications.map((spec) => (
            <div
              key={spec.label}
              className="flex justify-between gap-4 text-sm"
            >
              <dt className="text-gray-500">{spec.label}</dt>
              <dd className="text-right text-gray-300">{spec.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
