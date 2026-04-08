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
    <div className="grid gap-4 ">
      <Card>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Delegation Competition</h2>
          <Badge mode="DELEGATION" />
        </div>
        <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
          <p className="text-zinc-300">Current round: <span className="text-zinc-100">{String(round.data ?? "-")}</span></p>
          <p className="text-zinc-300">Time left: <span className="text-zinc-100">{countdown}s</span></p>
          <p className="text-zinc-300">Oracle APY: <span className="text-zinc-100">{formatBps(apy.data)}</span></p>
        </div>
      </Card>

      <Card>
        <h3 className="font-semibold">Last Winner (Round {String(winnerRound)})</h3>
        {!winner.data ? (
          <p className="mt-2 text-sm text-zinc-400">No winner data yet.</p>
        ) : (
          <div className="mt-3 grid gap-2 text-sm">
            <p className="text-zinc-300">Winner: <span className="text-zinc-100">{shorten(winner.data.winner)}</span></p>
            <p className="text-zinc-300">Baker: <span className="text-zinc-100">{winner.data.baker}</span></p>
            <p className="text-zinc-300">Predicted: <span className="text-zinc-100">{formatBps(winner.data.predictedYieldBps)}</span></p>
            <p className="text-zinc-300">Actual: <span className="text-zinc-100">{formatBps(winner.data.actualYieldBps)}</span></p>
            <p className="text-zinc-300">Abs error: <span className="text-zinc-100">{String(winner.data.absError)} bps</span></p>
            <p className="text-zinc-300">Reward: <span className="text-zinc-100">{formatToken(winner.data.reward)} XTZ</span></p>
          </div>
        )}
      </Card>

      <Card>
        <h3 className="font-semibold">Winner Agent Record</h3>
        {!winnerAgent.data ? (
          <p className="mt-2 text-sm text-zinc-400">Waiting for registry data...</p>
        ) : (
          <div className="mt-3 grid gap-2 text-sm">
            <p className="text-zinc-300">Name: <span className="text-zinc-100">{winnerAgent.data.name || "(unnamed)"}</span></p>
            <p className="text-zinc-300">Delegation score: <span className="text-zinc-100">{String(winnerAgent.data.delegationScore)}</span></p>
            <p className="text-zinc-300">Staking score: <span className="text-zinc-100">{String(winnerAgent.data.stakingScore)}</span></p>
            <p className="text-zinc-300">Compliance score: <span className="text-zinc-100">{String(winnerAgent.data.complianceScore)}</span></p>
            <p className="text-zinc-300">Proposals won: <span className="text-zinc-100">{String(winnerAgent.data.proposalsWon)} / {String(winnerAgent.data.totalProposals)}</span></p>
          </div>
        )}
      </Card>
    </div>
  );
}
