import Link from "next/link";
import GradientBarsBackground from "@/components/ui/gradient-bars-background";
import { ArrowRight, Zap, Shield, TrendingUp, Coins, Split, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <GradientBarsBackground
      numBars={9}
      gradientFrom="rgb(0, 194, 255)"
      gradientTo="transparent"
      animationDuration={2.5}
      backgroundColor="rgb(9, 9, 11)"
    >
      <div className="flex min-h-screen w-full flex-col">
        {/* Hero Section */}
        <section className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-500/10 px-4 py-1.5 text-sm font-medium text-cyan-300 backdrop-blur-sm">
            <Zap className="h-3.5 w-3.5" />
            Etherlink Shadownet · Non-custodial Yield
          </div>
          
          <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-zinc-100 sm:text-6xl lg:text-7xl">
            Trade the Future of
            <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Fixed Yield Markets
            </span>
          </h1>
          
          <p className="max-w-2xl text-lg text-zinc-300 sm:text-xl">
            Deposit XTZ, split into Principal & Yield Tokens, trade fixed-vs-variable yield, 
            and track agent competition decisions—all on-chain.
          </p>
          
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/deposit"
              className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:shadow-cyan-500/50 hover:scale-105"
            >
              Start Earning
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/agents"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900/50 px-6 py-3 text-base font-semibold text-zinc-100 backdrop-blur-sm transition-all hover:bg-zinc-800 hover:border-zinc-600"
            >
              View Agents
              <BarChart3 className="h-4 w-4" />
            </Link>
          </div>

          {/* Stats Section */}
          <div className="mt-16 grid w-full max-w-5xl grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 p-6 backdrop-blur-sm transition-all hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10">
                  <Coins className="h-6 w-6 text-cyan-400" />
                </div>
                <p className="text-sm font-medium text-zinc-400">Vaults</p>
                <p className="mt-2 text-xl font-bold text-zinc-100">slashDXTZ / slashSXTZ</p>
                <p className="mt-1 text-xs text-zinc-500">Dual strategy yield optimization</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 p-6 backdrop-blur-sm transition-all hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10">
                  <Split className="h-6 w-6 text-cyan-400" />
                </div>
                <p className="text-sm font-medium text-zinc-400">Splitter</p>
                <p className="mt-2 text-xl font-bold text-zinc-100">Mint PT + YT 1:1</p>
                <p className="mt-1 text-xs text-zinc-500">Separate principal from yield</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 p-6 backdrop-blur-sm transition-all hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10">
                  <TrendingUp className="h-6 w-6 text-cyan-400" />
                </div>
                <p className="text-sm font-medium text-zinc-400">AMM</p>
                <p className="mt-2 text-xl font-bold text-zinc-100">Fixed vs Variable</p>
                <p className="mt-1 text-xs text-zinc-500">Trade yield exposure seamlessly</p>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-20 w-full max-w-5xl">
            <h2 className="text-center text-3xl font-bold text-zinc-100 sm:text-4xl">
              Why SlashMarket?
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">
                  <Shield className="h-5 w-5 text-cyan-400" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-zinc-100">Non-Custodial</h3>
                <p className="text-zinc-400">
                  Your assets remain in your wallet. Smart contracts handle everything transparently on-chain.
                </p>
              </div>
              
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">
                  <Zap className="h-5 w-5 text-cyan-400" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-zinc-100">Efficient Trading</h3>
                <p className="text-zinc-400">
                  Optimized AMM for yield tokens with minimal slippage and maximum capital efficiency.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </GradientBarsBackground>
  );
}
