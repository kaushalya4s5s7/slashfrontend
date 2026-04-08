import { AgentsPanel } from "@/app/agents/components/agentsUI/AgentsPanel";
import { PageHeader } from "@/shared/components/PageHeader";
import { NetworkGuard } from "@/shared/components/NetworkGuard";

export default function AgentsPage() {
  return (
    <section className="space-y-4">
      <PageHeader title="Agents" subtitle="Read-only leaderboard from AgentCompetition and AgentRegistry." />
      <NetworkGuard>
        <AgentsPanel />
      </NetworkGuard>
    </section>
  );
}
