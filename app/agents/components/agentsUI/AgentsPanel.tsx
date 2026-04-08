"use client";

import { Card } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";
import { formatBps, formatToken, shorten } from "@/shared/utils/format";
import { useAgents } from "@/app/agents/components/agentsService/useAgents";
import { useRoundCountdown } from "@/app/agents/hooks/useRoundCountdown";

export function AgentsPanel() {
  const { round, timeLeft, apy, winnerRound, winner, winnerAgent } = useAgents();
  const countdown = useRoundCountdown(timeLeft.data);

  return (
    <div className="grid gap-5">
      <Card className="rounded-3xl border-zinc-800/80 bg-zinc-900/60 p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-zinc-100">Delegation Competition</h2>
          <Badge mode="DELEGATION" />
        </div>
        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-800/70 bg-black/20 px-4 py-3">
            <p className="font-urbanist text-xs uppercase tracking-[0.14em] text-zinc-500">Current round</p>
            <p className="mt-1 text-lg font-semibold text-zinc-100">{String(round.data ?? "-")}</p>
          </div>
          <div className="rounded-xl border border-zinc-800/70 bg-black/20 px-4 py-3">
            <p className="font-urbanist text-xs uppercase tracking-[0.14em] text-zinc-500">Time left</p>
            <p className="mt-1 text-lg font-semibold text-zinc-100">{countdown}s</p>
          </div>
          <div className="rounded-xl border border-zinc-800/70 bg-black/20 px-4 py-3">
            <p className="font-urbanist text-xs uppercase tracking-[0.14em] text-zinc-500">Oracle APY</p>
            <p className="mt-1 text-lg font-semibold text-zinc-100">{formatBps(apy.data)}</p>
          </div>
        </div>
      </Card>

      <Card className="rounded-3xl border-zinc-800/80 bg-zinc-900/60 p-6 backdrop-blur-xl">
        <h3 className="text-lg font-semibold tracking-tight text-zinc-100">Last Winner (Round {String(winnerRound)})</h3>
        {!winner.data ? (
          <p className="font-urbanist mt-3 text-sm text-zinc-400">No winner data yet.</p>
        ) : (
          <div className="mt-4 grid gap-2 text-sm">
            <p className="rounded-lg border border-zinc-800/70 bg-black/20 px-3 py-2 text-zinc-300">Winner: <span className="text-zinc-100">{shorten(winner.data.winner)}</span></p>
            <p className="rounded-lg border border-zinc-800/70 bg-black/20 px-3 py-2 text-zinc-300">Baker: <span className="text-zinc-100">{winner.data.baker}</span></p>
            <p className="rounded-lg border border-zinc-800/70 bg-black/20 px-3 py-2 text-zinc-300">Predicted: <span className="text-zinc-100">{formatBps(winner.data.predictedYieldBps)}</span></p>
            <p className="rounded-lg border border-zinc-800/70 bg-black/20 px-3 py-2 text-zinc-300">Actual: <span className="text-zinc-100">{formatBps(winner.data.actualYieldBps)}</span></p>
            <p className="rounded-lg border border-zinc-800/70 bg-black/20 px-3 py-2 text-zinc-300">Abs error: <span className="text-zinc-100">{String(winner.data.absError)} bps</span></p>
            <p className="rounded-lg border border-zinc-800/70 bg-black/20 px-3 py-2 text-zinc-300">Reward: <span className="text-zinc-100">{formatToken(winner.data.reward)} XTZ</span></p>
          </div>
        )}
      </Card>

      <Card className="rounded-3xl border-zinc-800/80 bg-zinc-900/60 p-6 backdrop-blur-xl">
        <h3 className="text-lg font-semibold tracking-tight text-zinc-100">Winner Agent Record</h3>
        {!winnerAgent.data ? (
          <p className="font-urbanist mt-3 text-sm text-zinc-400">Waiting for registry data...</p>
        ) : (
          <div className="mt-4 grid gap-2 text-sm">
            <p className="rounded-lg border border-zinc-800/70 bg-black/20 px-3 py-2 text-zinc-300">Name: <span className="text-zinc-100">{winnerAgent.data.name || "(unnamed)"}</span></p>
            <p className="rounded-lg border border-zinc-800/70 bg-black/20 px-3 py-2 text-zinc-300">Delegation score: <span className="text-zinc-100">{String(winnerAgent.data.delegationScore)}</span></p>
            <p className="rounded-lg border border-zinc-800/70 bg-black/20 px-3 py-2 text-zinc-300">Staking score: <span className="text-zinc-100">{String(winnerAgent.data.stakingScore)}</span></p>
            <p className="rounded-lg border border-zinc-800/70 bg-black/20 px-3 py-2 text-zinc-300">Compliance score: <span className="text-zinc-100">{String(winnerAgent.data.complianceScore)}</span></p>
            <p className="rounded-lg border border-zinc-800/70 bg-black/20 px-3 py-2 text-zinc-300">Proposals won: <span className="text-zinc-100">{String(winnerAgent.data.proposalsWon)} / {String(winnerAgent.data.totalProposals)}</span></p>
          </div>
        )}
      </Card>
    </div>
  );
}
