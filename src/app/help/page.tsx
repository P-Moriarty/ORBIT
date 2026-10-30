import Link from "next/link";
import HelpContactForm from "@/components/HelpContactForm";
import SiteHeader from "@/components/SiteHeader";

const faqs = [
  {
    question: "Can I place a real order?",
    answer:
      "No. Orbit is a concept storefront. Cart totals and the demo checkout are for exploration only; no payment is collected and nothing is shipped.",
  },
  {
    question: "What are the shipping and warranty terms?",
    answer:
      "There are no shipping, returns, or warranty terms because Orbit products are concepts and are not sold or delivered.",
  },
  {
    question: "Are the reviews or audio samples real?",
    answer:
      "No. Reviews are clearly labeled fictional examples, and the audio player generates simple tones in your browser rather than playing product recordings.",
  },
  {
    question: "Where are my saved products and configurations stored?",
    answer:
      "Wishlist items, saved configurations, cart contents, and preferences are stored in this browser. Clearing site data removes them.",
  },
  {
    question: "How do I share a product configuration?",
    answer:
      "Use the share action on a product or copy the share link from the configurator. Configurator links include the selected product, finish, and options.",
  },
  {
    question: "Can I change animation and contrast settings?",
    answer:
      "Yes. Open Accessibility in the main menu to enable reduced motion or high contrast. The site also respects your operating system's reduced-motion preference.",
  },
];

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-[#090a0f] px-4 py-4 text-white sm:px-8 lg:px-12">
      <SiteHeader />
      <section className="mx-auto max-w-4xl py-12 sm:py-16">
        <p className="text-xs uppercase tracking-[0.2em] text-blue-300">
          Help center
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Questions, answered
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-400">
          Find help with the Orbit 3D concept experience. This demo is not
          connected to customer support, order fulfillment, or a payment
          provider.
        </p>

        <div className="mt-8 space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl border border-white/10 bg-white/2.5 p-5"
            >
              <summary className="cursor-pointer list-none pr-6 font-medium marker:hidden">
                {faq.question}
                <span
                  aria-hidden="true"
                  className="float-right text-blue-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-400">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>

        <aside className="mt-8 rounded-2xl border border-blue-300/20 bg-blue-300/6 p-5">
          <h2 className="font-semibold">Need help with the demo?</h2>
          <p className="mt-2 text-sm leading-6 text-gray-300">
            No support mailbox is configured for this concept site. For a
            technical issue, use the project repository or ask the person who
            shared this preview.
          </p>
        </aside>
        <HelpContactForm />
        <Link
          href="/products"
          className="mt-7 inline-flex min-h-11 items-center rounded-xl bg-white px-5 text-sm font-semibold text-black hover:bg-gray-200"
        >
          Return to products
        </Link>
      </section>
    </main>
  );
}
