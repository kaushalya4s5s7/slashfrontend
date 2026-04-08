import Link from "next/link";
import { CheckCircle2, FileCheck2, Gavel, Shield } from "lucide-react";
import { BentoGrid, type BentoItem } from "@/components/ui/bento-grid";

const governanceItems: BentoItem[] = [
  {
    title: "Strategy Declaration",
    meta: "On-chain",
    description: "Each decision ships with a cryptographic trail and reason hash recorded immutably",
    icon: <FileCheck2 className="w-4 h-4 text-orange-400" />,
    status: "Live",
    tags: ["Transparent", "Auditable"],
    colSpan: 2,
    hasPersistentHover: true,
  },
  {
    title: "Competition Outcome",
    meta: "Public",
    description: "Winner declared publicly with no hidden committee or private override",
    icon: <Gavel className="w-4 h-4 text-cyan-400" />,
    status: "Verified",
    tags: ["Democratic", "Fair"],
  },
  {
    title: "Accountability Layer",
    meta: "Enforced",
    description: "Bond and score mechanics ensure bad calls are penalized while good calls compound trust",
    icon: <Shield className="w-4 h-4 text-emerald-400" />,
    tags: ["Trustless", "Secure"],
    colSpan: 2,
  },
  {
    title: "Verification Feed",
    meta: "Real-time",
    description: "Inspect every governance round like an audit feed directly from the agents page",
    icon: <CheckCircle2 className="w-4 h-4 text-blue-400" />,
    status: "Active",
    tags: ["Readable", "Open"],
  },
];

export function HomeGovernanceProofSection() {
  return (
    <section className="relative min-h-[100svh] snap-start overflow-hidden bg-[#0b0b0d]">
      <div className="absolute inset-0 [background:linear-gradient(135deg,rgba(255,94,0,0.12)_0%,transparent_35%,rgba(255,255,255,0.05)_100%)]" />
      <div className="relative mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-center px-4 py-14 sm:px-6 lg:px-8">
        <p className="text-xs uppercase tracking-[0.25em] text-orange-300/90">Governance Proof</p>
        <h2 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-zinc-100 sm:text-5xl">
          If it can’t be verified,
          <span className="block text-zinc-400">it doesn’t belong in governance.</span>
        </h2>

        <div className="mt-10">
          <BentoGrid items={governanceItems} />
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/agents"
            className="inline-flex items-center rounded-xl border border-zinc-700 bg-zinc-900/70 px-5 py-2.5 text-sm font-semibold text-zinc-100 transition hover:border-zinc-600 hover:bg-zinc-800"
          >
            Open Governance Feed
          </Link>
        </div>
      </div>
    </section>
  );
}
