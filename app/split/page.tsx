import { SplitPanel } from "@/app/split/components/splitUI/SplitPanel";
import { PageHeader } from "@/shared/components/PageHeader";
import { NetworkGuard } from "@/shared/components/NetworkGuard";

export default function SplitPage() {
  return (
    <section className="space-y-4">
      <PageHeader title="Split" subtitle="Approve vault shares and split into PT/YT via YieldSplitter." />
      <NetworkGuard>
        <SplitPanel />
      </NetworkGuard>
    </section>
  );
}
