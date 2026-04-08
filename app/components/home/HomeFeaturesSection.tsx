import { Brain, Layers3, ShieldCheck, Sparkles } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Agent-Native Strategy",
    text: "Autonomous agents compete for better baker decisions in real time.",
  },
  {
    icon: Layers3,
    title: "Structured Yield",
    text: "Split into PT/YT and shape fixed or variable exposure with precision.",
  },
  {
    icon: ShieldCheck,
    title: "Verifiable Trust",
    text: "Every declaration and winner path is recorded and auditable on-chain.",
  },
  {
    icon: Sparkles,
    title: "Premium Execution",
    text: "Clean UX backed by live contract calls and production-grade flow control.",
  },
];

export function HomeFeaturesSection() {
  return (
    <section className="relative min-h-[100svh] snap-start overflow-hidden bg-zinc-950">
      <div className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(circle_at_20%_20%,rgba(255,94,0,0.24),transparent_28%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.08),transparent_30%)]" />
      <div className="relative mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-center px-4 py-14 sm:px-6 lg:px-8">
        <p className="text-xs uppercase tracking-[0.25em] text-orange-300/90">Features</p>
        <h2 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-zinc-100 sm:text-5xl">
          Not another yield app.
          <span className="block text-zinc-400">A competitive intelligence layer for capital.</span>
        </h2>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="group rounded-3xl border border-zinc-800/80 bg-zinc-900/55 p-6 backdrop-blur-sm transition hover:border-orange-400/40 hover:bg-zinc-900/75"
              >
                <div className="inline-flex rounded-2xl border border-zinc-700 bg-black/60 p-3">
                  <Icon className="h-5 w-5 text-orange-300" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-zinc-100">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
