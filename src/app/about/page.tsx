import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SoundscapeScene from "@/components/SoundscapeScene";
import WaveformScene from "@/components/WaveformScene";

const principles = [
  {
    title: "Make the form legible",
    description:
      "Use material, proportion, and restrained color to make each device easy to read at a glance.",
  },
  {
    title: "Invite exploration",
    description:
      "Let people inspect a product from every angle and understand what can be changed before they choose.",
  },
  {
    title: "Keep the experience honest",
    description:
      "Show concept pricing and illustrative content as such, without suggesting a real purchase or performance claim.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#090a0f] px-4 py-4 text-white sm:px-8 lg:px-12">
      <SiteHeader />
      <section className="mx-auto max-w-7xl py-12 sm:py-20">
        <p className="text-xs uppercase tracking-[0.2em] text-blue-300">
          Design in motion
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
          Sound objects, explored in three dimensions.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-gray-400">
          Orbit is a fictional product-design concept and interactive
          storefront. It brings a small collection of imagined sound devices
          into one place to explore shape, color, and configuration.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/products"
            className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-gray-200"
          >
            Explore the collection
          </Link>
          <Link
            href="/configure"
            className="rounded-xl border border-white/15 px-5 py-3 text-sm hover:bg-white/10"
          >
            Open the configurator
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 border-y border-white/10 py-10 lg:grid-cols-[0.8fr_1.2fr] lg:py-14">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-blue-300">
            How we think
          </p>
          <h2 className="mt-3 text-3xl font-semibold">Designed to be explored</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {principles.map((principle, index) => (
            <article
              key={principle.title}
              className="rounded-2xl border border-white/10 bg-white/2.5 p-5"
            >
              <p className="text-sm text-blue-300">0{index + 1}</p>
              <h3 className="mt-4 font-semibold">{principle.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-400">
                {principle.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl py-10 sm:py-14">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/2.5 p-5 sm:p-7">
            <p className="text-xs uppercase tracking-[0.2em] text-blue-300">
              A living sketch
            </p>
            <h2 className="mt-3 text-2xl font-semibold">Form follows frequency</h2>
            <p className="mt-3 text-sm leading-7 text-gray-400">
              The orbiting forms and waveform below are visual studies—not
              measurements, product specifications, or acoustic simulations.
            </p>
            <div className="mt-5">
              <SoundscapeScene />
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/2.5 p-5 sm:p-7">
            <p className="text-xs uppercase tracking-[0.2em] text-blue-300">
              Interaction study
            </p>
            <h2 className="mt-3 text-2xl font-semibold">
              A little motion, with a reason
            </h2>
            <p className="mt-3 text-sm leading-7 text-gray-400">
              Product motion is designed to support inspection. Animation
              pauses when it is off-screen, and the accessibility controls can
              reduce motion further.
            </p>
            <div className="mt-5">
              <WaveformScene />
            </div>
          </div>
        </div>
      </section>

      <p className="mx-auto max-w-7xl border-t border-white/10 py-6 text-xs text-gray-500">
        Orbit 3D is an educational concept. No products are currently sold or
        shipped.
      </p>
    </main>
  );
}
