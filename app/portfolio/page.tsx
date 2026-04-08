import { PortfolioPanel } from "@/app/portfolio/components/portfolioUI/PortfolioPanel";
import { PageHeader } from "@/shared/components/PageHeader";
import { NetworkGuard } from "@/shared/components/NetworkGuard";

export default function PortfolioPage() {
  return (
    <section className="space-y-4">
      <PageHeader title="Portfolio" subtitle="Read all vault, PT, and YT balances from on-chain contracts." />
      <NetworkGuard>
        <PortfolioPanel />
      </NetworkGuard>
    </section>
  );
}
