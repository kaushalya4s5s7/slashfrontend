import { PortfolioPanel } from "@/app/portfolio/components/portfolioUI/PortfolioPanel";
import { PageHeader } from "@/shared/components/PageHeader";
import { NetworkGuard } from "@/shared/components/NetworkGuard";

export default function PortfolioPage() {
  return (
    <section className="relative h-full overflow-y-auto">
      <div className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(circle_at_14%_10%,rgba(16,185,129,0.2),transparent_34%),radial-gradient(circle_at_82%_86%,rgba(255,255,255,0.08),transparent_30%)]" />
      <div className="relative mx-auto w-full max-w-6xl space-y-8 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        <PageHeader title="Portfolio" subtitle="Track slashXTZ, PT, and YT balances across delegation and staking modes in one clean on-chain view." />
        <NetworkGuard>
          <PortfolioPanel />
        </NetworkGuard>
      </div>
    </section>
  );
}
