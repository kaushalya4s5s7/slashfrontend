"use client";

import { useState } from "react";
import { Card } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";
import { formatBps, formatToken, shorten } from "@/shared/utils/format";
import { useAgents } from "@/app/agents/components/agentsService/useAgents";
import { useRoundCountdown } from "@/app/agents/hooks/useRoundCountdown";

export function AgentsPanel() {
  const { round, timeLeft, apy, winnerRound, winner, winnerReads, winnerAgent, platformAgents, platformAgentsLoading } = useAgents();
  const countdown = useRoundCountdown(timeLeft.data);
  const [agentsOpen, setAgentsOpen] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const statusLabel = (status: number) => {
    if (status === 1) return "Suspended";
    if (status === 2) return "Banned";
    return "Active";
  };

  const onCopyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(address);
      setTimeout(() => setCopiedAddress((prev) => (prev === address ? null : prev)), 1200);
    } catch {
      setCopiedAddress(null);
    }
  };

  return (
    <div className="grid gap-5">
      <Card className="relative z-30 overflow-visible rounded-3xl border-zinc-800/80 bg-zinc-900/60 p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-zinc-100">Delegation Competition</h2>
          <div className="flex items-center gap-2">
            <div className="relative z-40">
              <button
                type="button"
                onClick={() => setAgentsOpen((prev) => !prev)}
                className="font-urbanist rounded-lg border border-zinc-700 bg-zinc-900/80 px-3 py-1.5 text-xs text-zinc-200 cursor-pointer hover:bg-zinc/10"
              >
                Agents
              </button>

              {agentsOpen ? (
                <div className="absolute right-0 top-10 z-50 w-72 rounded-lg border border-zinc-800/80 bg-zinc-950/95 p-2 shadow-2xl">
                  <p className="font-urbanist px-2 pb-1 text-[11px] uppercase tracking-[0.16em] text-zinc-500">Platform agents</p>

                  {platformAgentsLoading ? (
                    <p className="font-urbanist px-2 py-2 text-xs text-zinc-400">Loading...</p>
                  ) : platformAgents.length === 0 ? (
                    <p className="font-urbanist px-2 py-2 text-xs text-zinc-400">No agents found.</p>
                  ) : (
                    <div className="max-h-[52vh] space-y-1 overflow-y-auto overscroll-contain pr-1">
                      {platformAgents.map((agent) => (
                        <div key={agent.address} className="rounded-md border border-zinc-800 bg-black/25 px-2 py-2">
                          <p className="text-xs font-medium text-zinc-100">{agent.name} <span className="text-zinc-400">• {statusLabel(agent.status)}</span></p>
                          <div className="mt-1 flex items-center justify-between gap-2">
                            <p className="font-mono text-xs text-zinc-300">{shorten(agent.address)}</p>
                            <button
                              type="button"
                              onClick={() => onCopyAddress(agent.address)}
                              className="font-urbanist rounded border border-zinc-700 px-2 py-0.5 text-[11px] text-zinc-200 cursor-pointer"
                            >
                              {copiedAddress === agent.address ? "Copied" : "Copy"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            <Badge mode="DELEGATION" />
          </div>
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
        <h3 className="text-lg font-semibold tracking-tight text-zinc-100">
          Last Winner{winnerRound > 0n ? ` (Round ${String(winnerRound)})` : ""}
        </h3>
        {winnerReads.isLoading ? (
          <p className="font-urbanist mt-3 text-sm text-zinc-400">Loading winner data...</p>
        ) : !winner ? (
          <p className="font-urbanist mt-3 text-sm text-zinc-400">No settled winner found in recent rounds.</p>
        ) : (
          <div className="mt-4 grid gap-2 text-sm">
            <p className="rounded-lg border border-zinc-800/70 bg-black/20 px-3 py-2 text-zinc-300">Winner: <span className="text-zinc-100">{shorten(winner.winner)}</span></p>
            <p className="rounded-lg border border-zinc-800/70 bg-black/20 px-3 py-2 text-zinc-300">Baker: <span className="text-zinc-100">{winner.baker}</span></p>
            <p className="rounded-lg border border-zinc-800/70 bg-black/20 px-3 py-2 text-zinc-300">Predicted: <span className="text-zinc-100">{formatBps(winner.predictedYieldBps)}</span></p>
            <p className="rounded-lg border border-zinc-800/70 bg-black/20 px-3 py-2 text-zinc-300">Actual: <span className="text-zinc-100">{formatBps(winner.actualYieldBps)}</span></p>
            <p className="rounded-lg border border-zinc-800/70 bg-black/20 px-3 py-2 text-zinc-300">Abs error: <span className="text-zinc-100">{String(winner.absError)} bps</span></p>
            <p className="rounded-lg border border-zinc-800/70 bg-black/20 px-3 py-2 text-zinc-300">Reward: <span className="text-zinc-100">{formatToken(winner.reward)} XTZ</span></p>
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
