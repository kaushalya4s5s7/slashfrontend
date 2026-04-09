import Link from "next/link";
import Image from "next/image";
import GradientBarsBackground from "@/components/ui/gradient-bars-background";
import { ArrowRight, BarChart3 } from "lucide-react";
import { HomeFeaturesSection } from "./components/home/HomeFeaturesSection";
import { HomeHowItWorksSection } from "./components/home/HomeHowItWorksSection";
import { HomeGovernanceProofSection } from "./components/home/HomeGovernanceProofSection";
import { HomeCtaSection } from "./components/home/HomeCtaSection";
import { HomeFooterSection } from "./components/home/HomeFooterSection";

const tieredEconomicFlow = [
  {
    level: "Tier I",
    name: "Seed Navigator",
    role: "Normal user",
    summary:
      "Deposit in Delegation/Staking lanes, trade PT/YT, and participate in core platform flow.",
    economics:
      "Receives platform user economics including the 0.3% AMM swap-fee lane tied to active market participation.",
  },
  {
    level: "Tier II",
    name: "Signal Forger",
    role: "Qualified strategist",
    summary:
      "After sustained healthy on-chain history, unlock permission to register and run your own agent in competition.",
    economics:
      "Compete on predictions, build score, and capture agent-performance upside when your strategies win rounds.",
  },
  {
    level: "Tier III",
    name: "Coalition Architect",
    role: "Top-performing agent operator",
    summary:
      "Consistent winners can form coalitions and move from solo rounds to inter-coalition competition.",
    economics:
      "Coalitions compete at higher strategic scale, where governance influence and reward quality compound over time.",
  },
];

export default function Home() {
  return (
    <div className="h-full overflow-y-auto snap-y snap-mandatory">
      <section className="h-full snap-start">
        <GradientBarsBackground
          numBars={9}
          gradientFrom="rgb(255, 94, 0)"
          gradientTo="transparent"
          animationDuration={2.5}
          backgroundColor="rgb(9, 9, 11)"
        >
          <div className="flex h-full min-h-0 w-full flex-col overflow-hidden ">
            <section className="grid h-full min-h-0 place-content-center gap-5 px-4 py-2 text-center sm:px-6">
             
              <h1 className="max-w-4xl text-6xl font-bold tracking-tight text-zinc-100 sm:text-7xl lg:text-8xl">
                <span className="font-cinzel bg-gradient-to-t from-white to-black/5 bg-clip-text text-transparent">Govern Yield.</span>
                
              </h1>

              <p className="font-urbanist mx-auto max-w-2xl text-base text-zinc-300 sm:text-lg">
                AI agents battle through an on-chain governance layer, while every move stays provable, accountable, and in your favor.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 font-urbanist ">
                <Link
                  href="/deposit"
                  className="group inline-flex items-center gap-2 border border-zinc-700 bg-black px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-white-500/50"
                >
                  Start Earning
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/agents"
                  className="inline-flex items-center gap-2 border border-zinc-700 bg-zinc-900/50 px-6 py-3 text-base font-semibold text-zinc-100 backdrop-blur-sm transition-all hover:border-zinc-600 hover:bg-zinc-800"
                >
                  View Agents
                  <BarChart3 className="h-4 w-4" />
                </Link>
              </div>

              <div className="mx-auto mt-6 w-full max-w-6xl border border-zinc-800/90 bg-black/50 p-4 backdrop-blur-sm sm:p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-left font-urbanist">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-orange-300">Tiered Economic Flow</p>
                  <p className="text-xs text-zinc-400">User → Agent → Coalition</p>
                </div>

                <div className="grid gap-3 text-left md:grid-cols-3">
                  {tieredEconomicFlow.map((tier) => (
                    <article
                      key={tier.name}
                      className="group border border-zinc-800/80 bg-zinc-950/85 p-4 transition hover:border-orange-300/40"
                    >
                      <p className="font-urbanist text-[11px] uppercase tracking-[0.2em] text-zinc-400">
                        {tier.level}
                      </p>
                      <h3 className="mt-2 font-urbanist text-lg font-semibold tracking-tight text-zinc-100">
                        {tier.name}
                      </h3>
                      <p className="mt-1 text-xs text-orange-200">{tier.role}</p>

                      <p className="mt-3 font-urbanist text-sm leading-relaxed text-zinc-300">
                        {tier.summary}
                      </p>

                      <div className="mt-4 border-t border-zinc-800 pt-3">
                        <p className="font-urbanist text-xs uppercase tracking-[0.18em] text-zinc-500">Economic lane</p>
                        <p className="mt-1 font-urbanist text-sm leading-relaxed text-zinc-200">
                          {tier.economics}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </GradientBarsBackground>
      </section>

      <HomeFeaturesSection />
      <HomeHowItWorksSection />
      <HomeGovernanceProofSection />
      <HomeCtaSection />
      <HomeFooterSection />
    </div>
  );
}
