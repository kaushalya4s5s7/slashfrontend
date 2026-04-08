import { DepositPanel } from "@/app/deposit/components/depositUI/DepositPanel";
import { PageHeader } from "@/shared/components/PageHeader";
import { NetworkGuard } from "@/shared/components/NetworkGuard";

export default function DepositPage() {
  return (
    <section className="space-y-4 p-8">
      <PageHeader title="Deposit" subtitle="Entry point: deposit native XTZ into delegation/staking vaults." />
      <NetworkGuard>
        <DepositPanel />
      </NetworkGuard>
    </section>
  );
}
