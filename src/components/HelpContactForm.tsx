"use client";

import { useState, type FormEvent } from "react";

export default function HelpContactForm() {
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState("");

  function prepareRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const details = String(formData.get("details") ?? "").trim();
    if (!name || !email || !details) {
      setMessage("Complete all fields before preparing your request.");
      return;
    }

    setPreview(`From: ${name} <${email}>\n\n${details}`);
    setMessage(
      "Request prepared in this page only. Nothing was sent or saved; copy the preview to share it with the project maintainer."
    );
  }

  async function copyPreview() {
    try {
      await navigator.clipboard.writeText(preview);
      setMessage("Request copied. Nothing was sent.");
    } catch (error) {
      console.error("Could not copy the contact request.", error);
      setMessage(
        "Could not copy automatically. Select and copy the request preview below."
      );
    }
  }

  return (
    <section className="mt-8 rounded-2xl border border-white/10 bg-white/2.5 p-5 sm:p-6">
      <h2 className="text-xl font-semibold">Prepare a contact request</h2>
      <p className="mt-2 text-sm leading-6 text-gray-400">
        This demo has no support inbox. The form only creates a local preview;
        it does not transmit or store your information.
      </p>
      <form onSubmit={prepareRequest} className="mt-5 grid gap-4">
        <label className="grid gap-2 text-sm text-gray-300">
          Your name
          <input
            name="name"
            autoComplete="name"
            required
            className="min-h-11 rounded-xl border border-white/15 bg-black/20 px-3 text-white"
          />
        </label>
        <label className="grid gap-2 text-sm text-gray-300">
          Email address
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            className="min-h-11 rounded-xl border border-white/15 bg-black/20 px-3 text-white"
          />
        </label>
        <label className="grid gap-2 text-sm text-gray-300">
          How can we help?
          <textarea
            name="details"
            required
            rows={4}
            className="rounded-xl border border-white/15 bg-black/20 p-3 text-white"
          />
        </label>
        <button
          type="submit"
          className="min-h-11 w-fit rounded-xl bg-white px-5 text-sm font-semibold text-black hover:bg-gray-200"
        >
          Prepare request preview
        </button>
      </form>
      {message && (
        <p role="status" className="mt-4 text-sm text-blue-200">
          {message}
        </p>
      )}
      {preview && (
        <div className="mt-4 rounded-xl border border-white/10 p-4">
          <pre className="whitespace-pre-wrap wrap-break-word font-sans text-sm leading-6 text-gray-300">
            {preview}
          </pre>
          <button
            type="button"
            onClick={copyPreview}
            className="mt-4 min-h-10 rounded-lg border border-white/15 px-4 text-sm hover:bg-white/10"
          >
            Copy request
          </button>
        </div>
      )}
    </section>
  );
}
