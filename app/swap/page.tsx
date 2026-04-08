import { SwapPanel } from "@/app/swap/components/swapUI/SwapPanel";
import { PageHeader } from "@/shared/components/PageHeader";
import { NetworkGuard } from "@/shared/components/NetworkGuard";

export default function SwapPage() {
  return (
    <section className="space-y-4">
      <PageHeader title="Swap" subtitle="Trade PT against slashXTZ using time-decay AMM pools." />
      <NetworkGuard>
        <SwapPanel />
      </NetworkGuard>
    </section>
  );
}
