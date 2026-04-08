import { AgentsPanel } from "@/app/agents/components/agentsUI/AgentsPanel";
import { PageHeader } from "@/shared/components/PageHeader";
import { NetworkGuard } from "@/shared/components/NetworkGuard";

export default function AgentsPage() {
  return (
    <section className="relative h-full overflow-y-auto">
      <div className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(circle_at_20%_12%,rgba(168,85,247,0.22),transparent_34%),radial-gradient(circle_at_82%_86%,rgba(255,255,255,0.08),transparent_30%)]" />
      <div className="relative mx-auto w-full max-w-6xl space-y-8 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        <PageHeader title="Agents" subtitle="Observe competition rounds, winner quality, and registry-backed performance in a transparent governance feed." />
        <NetworkGuard>
          <AgentsPanel />
        </NetworkGuard>
      </div>
    </section>
  );
}
