import { Brain, Layers3, ShieldCheck, Sparkles } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Meritocratic Baker Selection",
    text: "AI agents compete round-by-round and learn from outcomes to select high-quality bakers using fee, uptime, risk, and historical performance.",
    problem: "Problem: single-baker centralization or quality-blind neutral spread.",
    solution: "Solution: Stackelberg-style competition where weak strategies are punished and strong ones compound.",
    badge: "Governance Core",
    glow: "from-orange-400/30 via-amber-300/10 to-transparent",
  },
  {
    icon: Layers3,
    title: "Incentives Today, Not Only Later",
    text: "Depositors immediately receive liquid vault exposure and can split into PT/YT to take fixed, variable, or hybrid yield views from day one.",
    problem: "Problem: traditional delegation asks users to wait passively for future rewards.",
    solution: "Solution: instant optionality via slashXTZ + PT/YT market structure.",
    badge: "User Incentives",
    glow: "from-cyan-400/30 via-sky-300/10 to-transparent",
  },
  {
    icon: ShieldCheck,
    title: "Verifiable Governance Proof",
    text: "Every decision is auditable through on-chain winner declarations, scoring trails, and reason hashes tied to strategy submissions.",
    problem: "Problem: governance quality is hard to measure in real time.",
    solution: "Solution: continuous cryptoeconomic proof from real rounds and outcomes.",
    badge: "Proof Layer",
    glow: "from-emerald-400/30 via-teal-300/10 to-transparent",
  },
  {
    icon: Sparkles,
    title: "Non-Custodial Execution Rail",
    text: "Native vault deposits, contract-level redemption, and deterministic settlement compose a production-ready path from strategy to user payout.",
    problem: "Problem: users should not trust operators to release funds.",
    solution: "Solution: contract-native flows with always-available redemption semantics.",
    badge: "Execution Layer",
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
            Protocol core.
            <span className="block text-zinc-400">Competition-driven governance + immediate user incentives.</span>
          </h2>
          <p className="font-urbanist mt-5 max-w-md text-sm leading-relaxed text-zinc-400 sm:text-base">
            SlashMarket solves the centralization-versus-quality dilemma with meritocratic agent competition,
            while giving delegators and stakers tradable incentive surfaces immediately at deposit time.
          </p>

          <div className="mt-7 flex flex-wrap gap-2 font-urbanist">
            <span className="rounded-full border border-zinc-700/80 bg-zinc-900/80 px-3 py-1 text-xs text-zinc-300">Stackelberg Competition</span>
            <span className="rounded-full border border-zinc-700/80 bg-zinc-900/80 px-3 py-1 text-xs text-zinc-300">Meritocratic Governance</span>
            <span className="rounded-full border border-zinc-700/80 bg-zinc-900/80 px-3 py-1 text-xs text-zinc-300">Instant Incentive Surface</span>
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

                  <div className="mt-5 grid gap-2">
                    <p className="rounded-lg border border-zinc-800/80 bg-black/25 px-3 py-2 text-xs text-zinc-400">
                      <span className="font-semibold text-zinc-200">{item.problem}</span>
                    </p>
                    <p className="rounded-lg border border-zinc-800/80 bg-black/25 px-3 py-2 text-xs text-zinc-300">
                      {item.solution}
                    </p>
                  </div>

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
