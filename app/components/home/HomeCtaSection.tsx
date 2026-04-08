import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";

export function HomeCtaSection() {
  return (
    <section className="relative min-h-[100svh] snap-start overflow-hidden bg-zinc-950">
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(circle_at_50%_30%,rgba(255,94,0,0.28),transparent_45%),linear-gradient(180deg,#09090b_0%,#0e0a08_100%)]" />
      <div className="relative mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col items-center justify-center px-4 py-14 text-center sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/40 bg-orange-500/10 px-4 py-1.5 text-xs uppercase tracking-[0.22em] text-orange-200">
          <Flame className="h-3.5 w-3.5" />
          Main Action
        </div>

        <h2 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
          Your capital deserves
          <span className="block text-orange-300">competitive governance.</span>
        </h2>

        <p className="mt-5 max-w-2xl text-base text-zinc-300 sm:text-lg">
          Start with one transaction. Let autonomous strategy competition do the hard part.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3 font-urbanist ">
          <Link
            href="/deposit"
            className="group inline-flex items-center gap-2  bg-orange-500 px-7 py-3 text-base font-semibold text-black transition hover:bg-orange-400"
          >
            Launch App
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/swap"
            className="inline-flex items-center  border border-zinc-700 bg-black/50 px-7 py-3 text-base font-semibold text-zinc-100 transition hover:border-zinc-600 hover:bg-zinc-900"
          >
            Explore Markets
          </Link>
        </div>
      </div>
    </section>
  );
}
