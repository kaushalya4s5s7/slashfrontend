import { Brain, Layers3, ShieldCheck, Sparkles } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Agent-Native Strategy",
    text: "Autonomous agents continuously evaluate validator quality and compete on prediction accuracy, not marketing noise.",
    badge: "Decision Engine",
    glow: "from-orange-400/30 via-amber-300/10 to-transparent",
  },
  {
    icon: Layers3,
    title: "Structured Yield",
    text: "Slice vault exposure into PT and YT to shape fixed or variable risk with intent-grade precision.",
    badge: "Composable",
    glow: "from-cyan-400/30 via-sky-300/10 to-transparent",
  },
  {
    icon: ShieldCheck,
    title: "Verifiable Trust",
    text: "Every submission, score, and winner declaration is recorded on-chain and inspectable in seconds.",
    badge: "Auditable",
    glow: "from-emerald-400/30 via-teal-300/10 to-transparent",
  },
  {
    icon: Sparkles,
    title: "Premium Execution",
    text: "Elegant UX is backed by contract-native flows, deterministic state handling, and battle-ready transaction rails.",
    badge: "Production Grade",
    glow: "from-fuchsia-400/30 via-violet-300/10 to-transparent",
  },
];

export function HomeFeaturesSection() {
  return (
    <section className="relative min-h-[320svh] snap-start overflow-clip bg-zinc-950 font-urbanist">
      <div className="pointer-events-none absolute inset-0 opacity-50 [background:radial-gradient(circle_at_15%_15%,rgba(255,94,0,0.22),transparent_34%),radial-gradient(circle_at_82%_18%,rgba(168,85,247,0.16),transparent_30%),radial-gradient(circle_at_75%_82%,rgba(255,255,255,0.08),transparent_35%)]" />
      <div className="relative mx-auto grid min-h-[320svh] w-full max-w-7xl grid-cols-1 gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-10">
        <div className="lg:sticky lg:top-24 lg:h-fit">
          <p className="text-xs uppercase tracking-[0.3em] text-orange-300/90">Features</p>
          <h2 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight text-zinc-100 sm:text-5xl">
            SlashMarket flow.
            <span className="block text-zinc-400">Agent intelligence, structured yield, and on-chain proof.</span>
          </h2>
          <p className="font-urbanist mt-5 max-w-md text-sm leading-relaxed text-zinc-400 sm:text-base">
            Move from strategy decisions to PT/YT structuring and verifiable settlement in one native product narrative.
            Every layer maps directly to real contracts, real rounds, and real user outcomes.
          </p>

          <div className="mt-7 flex flex-wrap gap-2 font-urbanist">
            <span className="rounded-full border border-zinc-700/80 bg-zinc-900/80 px-3 py-1 text-xs text-zinc-300">Agent Governance</span>
            <span className="rounded-full border border-zinc-700/80 bg-zinc-900/80 px-3 py-1 text-xs text-zinc-300">PT/YT Markets</span>
            <span className="rounded-full border border-zinc-700/80 bg-zinc-900/80 px-3 py-1 text-xs text-zinc-300">On-Chain Proof</span>
          </div>
        </div>

        <div className="relative space-y-8 lg:space-y-12">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                style={{ top: `${92 + index * 24}px` }}
                className="group sticky"
              >
                <div className="relative overflow-hidden  border border-white/10 bg-gradient-to-b from-zinc-900/90 to-zinc-950/95 p-7 shadow-[0_30px_80px_-35px_rgba(0,0,0,0.95)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-orange-300/40 sm:p-8">
                  <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${item.glow} opacity-90`} />
                  <div className="pointer-events-none absolute inset-0  ring-1 ring-inset ring-white/10" />

                  <div className="relative flex items-start justify-between gap-4">
                    <div className="inline-flex  border border-white/15 bg-black/35 p-3.5 shadow-lg shadow-black/40">
                      <Icon className="h-5 w-5 text-orange-200" />
                    </div>
                    <span className="font-urbanist rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-zinc-300">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="mt-6 text-2xl font-semibold tracking-tight text-zinc-100 sm:text-[1.75rem]">{item.title}</h3>
                  <p className="font-urbanist mt-3 max-w-xl text-sm leading-relaxed text-zinc-300 sm:text-base">{item.text}</p>

                  <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
