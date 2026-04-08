import { Coins, Landmark, SplitSquareVertical, Waves, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Coins,
    title: "Deposit XTZ",
    text: "Start by depositing native XTZ into SlashMarket vault rails with one clean on-chain action.",
    accent: "from-orange-400/25 to-transparent",
  },
  {
    icon: Landmark,
    title: "Participate in Governance",
    text: "Choose delegation or staking mode and let agent-governed competition optimize governance direction.",
    accent: "from-cyan-400/25 to-transparent",
  },
  {
    icon: SplitSquareVertical,
    title: "Protocol Split",
    text: "Your position is structured into protocol-native claim tokens, separating principal and incentive exposure.",
    accent: "from-violet-400/25 to-transparent",
  },
  {
    icon: Waves,
    title: "Instant Liquidity Today",
    text: "Trade incentive exposure immediately in AMM markets instead of waiting for the full governance cycle to mature.",
    accent: "from-emerald-400/25 to-transparent",
  },
];

export function HomeHowItWorksSection() {
  return (
    <section className="relative min-h-[100svh] snap-start overflow-hidden bg-zinc-950">
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(circle_at_14%_18%,rgba(255,94,0,0.18),transparent_34%),radial-gradient(circle_at_84%_82%,rgba(34,211,238,0.12),transparent_32%)]" />
      <div className="relative mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-10">
        <p className="font-urbanist text-xs uppercase tracking-[0.24em] text-orange-300/90">How it works</p>
        <h2 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-zinc-100 sm:text-5xl">
          Deposit. Govern. Split. Trade.
          <span className="block text-zinc-400">Unlock governance incentive liquidity on day one.</span>
        </h2>

        <div className="mt-10 grid gap-4 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;
            return (
              <div key={step.title} className="relative">
                <article className="relative h-full overflow-hidden border border-white/10 bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 p-6 backdrop-blur-xl">
                  <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${step.accent}`} />
                  <div className="relative inline-flex border border-white/15 bg-black/30 p-3">
                    <Icon className="h-5 w-5 text-zinc-100" />
                  </div>
                  <p className="font-urbanist relative mt-4 text-[11px] uppercase tracking-[0.2em] text-zinc-400">Step {index + 1}</p>
                  <h3 className="relative mt-2 text-xl font-semibold text-zinc-100">{step.title}</h3>
                  <p className="font-urbanist relative mt-2 text-sm leading-relaxed text-zinc-300">{step.text}</p>
                </article>

                {!isLast ? (
                  <div className="pointer-events-none absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 lg:block">
                    <div className="rounded-full border border-zinc-700 bg-zinc-900/90 p-1.5 text-zinc-300">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
