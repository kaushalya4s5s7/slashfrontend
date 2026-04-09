import { DepositPanel } from "@/app/deposit/components/depositUI/DepositPanel";
import { PageHeader } from "@/shared/components/PageHeader";
import { NetworkGuard } from "@/shared/components/NetworkGuard";

export default function DepositPage() {
  return (
    <section className="relative h-full overflow-y-auto">
      <div className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(circle_at_20%_10%,rgba(255,94,0,0.22),transparent_34%),radial-gradient(circle_at_80%_85%,rgba(255,255,255,0.08),transparent_30%)]" />
      <div className="relative mx-auto w-full max-w-6xl space-y-8 px-4 py-6 sm:px-6 lg:px-10 lg:py-10 font-urbanist">
        <PageHeader title="Deposit" subtitle="Mint delegation or staking vault shares from native XTZ with a guided, low-friction flow." />
        <NetworkGuard>
          <DepositPanel />
        </NetworkGuard>
      </div>
    </section>
  );
}
