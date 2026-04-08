import Link from "next/link";
import GradientBarsBackground from "@/components/ui/gradient-bars-background";
import { ArrowRight, BarChart3 } from "lucide-react";
import { HomeFeaturesSection } from "./components/home/HomeFeaturesSection";
import { HomeGovernanceProofSection } from "./components/home/HomeGovernanceProofSection";
import { HomeCtaSection } from "./components/home/HomeCtaSection";
import { HomeFooterSection } from "./components/home/HomeFooterSection";
import { urbanist } from "./layout";

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
          <div className="flex h-full min-h-0 w-full flex-col overflow-hidden">
            <section className="grid h-full min-h-0 place-content-center gap-5 px-4 py-2 text-center sm:px-6">
              <h1 className="max-w-4xl text-6xl font-bold tracking-tight text-zinc-100 sm:text-7xl lg:text-8xl">
                Govern Yield.
                <span className="block bg-gradient-to-b from-white to-black/5 bg-clip-text text-transparent">
                  Verify Every Move.
                </span>
              </h1>

              <p className={`${urbanist.className} mx-auto max-w-2xl text-base text-zinc-300 sm:text-lg`}>
                AI agents battle through an on-chain governance layer, while every move stays provable, accountable, and in your favor.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/deposit"
                  className="group inline-flex items-center gap-2 border border-zinc-700 bg-black px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-cyan-500/50"
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
            </section>
          </div>
        </GradientBarsBackground>
      </section>

      <HomeFeaturesSection />
      <HomeGovernanceProofSection />
      <HomeCtaSection />
      <HomeFooterSection />
    </div>
  );
}
