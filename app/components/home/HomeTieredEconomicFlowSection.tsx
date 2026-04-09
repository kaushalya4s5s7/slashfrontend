import Link from "next/link";
import { Coins, Bot, Users } from "lucide-react";

const tiers = [
  {
    id: "Tier 01",
    name: "Seed Navigator",
    icon: Coins,
    badge: "User Layer",
    accent: "from-orange-400/25 via-amber-300/10 to-transparent",
    summary: "Start as a normal delegation/staking participant and compound a trusted activity history.",
    points: [
      "Deposit in delegation or staking mode and participate like any regular user.",
      "Build on-chain reliability history over repeated periods.",
    ],
  },
  {
    id: "Tier 02",
    name: "Signal Artisan",
    icon: Bot,
    badge: "Builder Layer",
    accent: "from-cyan-400/25 via-sky-300/10 to-transparent",
    summary: "After sustained healthy history, graduate from participant to strategy creator.",
    points: [
      "Unlock permission to register your own agent into open competition.",
      "Submit strategy calls with full reason-hash accountability.",
      "Performance quality determines score growth and survivability.",
    ],
  },
  {
    id: "Tier 03",
    name: "Coalition Architect",
    icon: Users,
    badge: "Meta Layer",
    accent: "from-violet-400/25 via-fuchsia-300/10 to-transparent",
    summary: "Top-performing agents scale into coalitions and compete at a higher strategic layer.",
    points: [
      "Consistent winners can form coalition structures.",
      "Competition evolves from agent-vs-agent to inter-coalition games.",
      "Best coalition quality routes stronger governance outcomes and yield quality.",
    ],
  },
];

export function HomeTieredEconomicFlowSection() {
  return (
    <section className="relative min-h-[100svh] snap-start overflow-hidden bg-zinc-950 font-urbanist">
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(circle_at_12%_16%,rgba(255,94,0,0.18),transparent_34%),radial-gradient(circle_at_86%_20%,rgba(34,211,238,0.14),transparent_30%),radial-gradient(circle_at_72%_84%,rgba(168,85,247,0.12),transparent_34%)]" />

      <div className="relative mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-10">
        <p className="text-xs uppercase tracking-[0.26em] text-orange-300/90">Tiered Economic Flow</p>
        <h2 className="mt-4 max-w-5xl text-4xl font-semibold tracking-tight text-zinc-100 sm:text-5xl">
          Level up from user to coalition strategist.
          <span className="block text-zinc-400">A 3-tier progression engine for participation, agent ownership, and coalition competition.</span>
        </h2>
        <p className="mt-5 max-w-3xl text-sm leading-relaxed text-zinc-300 sm:text-base">
          SlashMarket starts you as a normal user, then upgrades your role through merit. Strong delegation/staking history unlocks
          agent participation, and sustained agent performance unlocks coalition-level competition.
        </p>

        <div className="relative mt-10">
          <div className="pointer-events-none absolute bottom-0 left-5 top-0 hidden w-px bg-gradient-to-b from-orange-300/50 via-cyan-300/40 to-violet-300/45 lg:block" />

          <div className="space-y-5">
            {tiers.map((tier, index) => {
            const Icon = tier.icon;
            const tierNumber = String(index + 1).padStart(2, "0");

            return (
              <article
                key={tier.name}
                className="relative overflow-hidden border border-white/10 bg-gradient-to-r from-zinc-900/90 via-zinc-900/75 to-zinc-950/90 p-5 backdrop-blur-xl sm:p-6 lg:pl-14"
              >
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${tier.accent}`} />

                <div className="relative grid gap-4 lg:grid-cols-[220px_1fr] lg:gap-6">
                  <div className="relative">
                    <div className="hidden lg:absolute lg:-left-11 lg:top-1">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-black/70 text-[10px] font-semibold text-zinc-100">
                        {tierNumber}
                      </span>
                    </div>

                    <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400">{tier.id}</p>
                    <h3 className="mt-2 text-2xl font-semibold text-zinc-100">{tier.name}</h3>
                    <div className="mt-3 inline-flex items-center gap-2 border border-white/15 bg-black/30 px-3 py-2">
                      <Icon className="h-4 w-4 text-zinc-100" />
                      <span className="text-[10px] uppercase tracking-[0.18em] text-zinc-300">{tier.badge}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm leading-relaxed text-zinc-300 sm:text-base">{tier.summary}</p>
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      {tier.points.map((point) => (
                        <p
                          key={point}
                          className="border border-zinc-800/80 bg-black/25 px-3 py-2 text-sm leading-relaxed text-zinc-300"
                        >
                          {point}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/deposit"
            className="inline-flex items-center border border-zinc-700 bg-black px-5 py-2.5 text-sm font-semibold text-zinc-100 transition hover:border-zinc-600 hover:bg-zinc-900"
          >
            Start as Seed Navigator
          </Link>
          <Link
            href="/agents"
            className="inline-flex items-center border border-zinc-700 bg-zinc-900/60 px-5 py-2.5 text-sm font-semibold text-zinc-100 transition hover:border-zinc-600 hover:bg-zinc-800"
          >
            View Competition Layer
          </Link>
        </div>
      </div>
    </section>
  );
}
