import Link from "next/link";

export default function Home() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center gap-6 text-center">
      <div className="inline-flex items-center rounded-full border border-cyan-400/40 bg-cyan-500/10 px-4 py-1 text-xs font-medium text-cyan-300">
        Etherlink Shadownet · Non-custodial Yield
      </div>
      <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-zinc-100 sm:text-5xl">
        SlashMarket Frontend
      </h1>
      <p className="max-w-2xl text-zinc-400">
        Deposit XTZ, split into PT/YT, trade fixed-vs-variable yield, and track agent competition decisions on-chain.
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/deposit"
          className="rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-medium text-zinc-950 transition hover:bg-cyan-400"
        >
          Start Deposit
        </Link>
        <Link
          href="/agents"
          className="rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-200 transition hover:bg-zinc-900"
        >
          View Agent Leaderboard
        </Link>
      </div>
      <div className="grid w-full max-w-3xl grid-cols-1 gap-3 pt-8 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-left">
          <p className="text-xs text-zinc-500">Vaults</p>
          <p className="mt-1 text-sm text-zinc-200">slashDXTZ / slashSXTZ</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-left">
          <p className="text-xs text-zinc-500">Splitter</p>
          <p className="mt-1 text-sm text-zinc-200">Mint PT + YT 1:1</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-left">
          <p className="text-xs text-zinc-500">AMM</p>
          <p className="mt-1 text-sm text-zinc-200">Trade fixed vs variable</p>
        </div>
      </div>
    </section>
  );
}
