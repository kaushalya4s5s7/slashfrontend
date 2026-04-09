"use client";

import { useState } from "react";
import { Card } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";
import { formatBps, formatToken, shorten } from "@/shared/utils/format";
import { useAgents } from "@/app/agents/components/agentsService/useAgents";
import { useRoundCountdown } from "@/app/agents/hooks/useRoundCountdown";
import { PixelatedCanvas } from "@/shared/components/ui/pixeleted-canvas";

export function AgentsPanel() {
  const { round, timeLeft, apy, winnerRound, winner, winnerReads, winnerAgent, platformAgents, platformAgentsLoading } = useAgents();
  const countdown = useRoundCountdown(timeLeft.data);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const winnerDetails = (winner ?? null) as
    | {
        winner?: `0x${string}`;
        baker?: string;
        predictedYieldBps?: bigint;
        actualYieldBps?: bigint;
        absError?: bigint;
        reward?: bigint;
        reasonSummary?: string;
        reasonHash?: `0x${string}`;
      }
    | null;

  const statusLabel = (status: number) => {
    if (status === 1) return "Suspended";
    if (status === 2) return "Banned";
    return "Active";
  };

  const scoreTone = (score: bigint) => {
    if (score >= 850n) return "text-emerald-300";
    if (score >= 650n) return "text-zinc-100";
    return "text-amber-300";
  };

  const decisionConfidence = winnerDetails?.absError ? Math.max(0, 100 - Number(winnerDetails.absError)) : 0;

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

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="overflow-hidden rounded-3xl border-zinc-800/80 bg-zinc-900/60 p-6 backdrop-blur-xl">
          <p className="font-urbanist text-xs uppercase tracking-[0.16em] text-zinc-500">Agent identity card</p>
          <h3 className="mt-2 text-lg font-semibold tracking-tight text-zinc-100">Autonomous Decision Engine</h3>
          <p className="font-urbanist mt-1 text-sm text-zinc-400">Human-like competitive agents continuously evaluate baker quality, risk, and expected yield.</p>

          <div className="mt-4 flex justify-center">
            <PixelatedCanvas
              src="/agentMonkey.png"
              width={400}
              height={500}
              cellSize={3}
              dotScale={0.9}
              shape="square"
              backgroundColor="#000000"
              dropoutStrength={0.4}
              interactive
              distortionStrength={3}
              distortionRadius={80}
              distortionMode="swirl"
              followSpeed={0.2}
              jitterStrength={4}
              jitterSpeed={4}
              sampleAverage
              tintColor="#FFFFFF"
              tintStrength={0.2}
              className="rounded-xl border border-neutral-800 shadow-lg"
            />
          </div>

          <div className="mt-4 grid gap-2 text-sm">
            <p className="rounded-lg border border-zinc-800/70 bg-black/20 px-3 py-2 text-zinc-300">Capability: <span className="text-zinc-100">Multi-baker optimization</span></p>
            <p className="rounded-lg border border-zinc-800/70 bg-black/20 px-3 py-2 text-zinc-300">Signals: <span className="text-zinc-100">fee, uptime, risk, history</span></p>
            <p className="rounded-lg border border-zinc-800/70 bg-black/20 px-3 py-2 text-zinc-300">Objective: <span className="text-zinc-100">maximize sustainable delegation quality</span></p>
          </div>
        </Card>

        <Card className="rounded-3xl border-zinc-800/80 bg-zinc-900/60 p-6 backdrop-blur-xl">
          <h3 className="text-lg font-semibold tracking-tight text-zinc-100">
            Live Decision Feed{winnerRound > 0n ? ` · Round ${String(winnerRound)}` : ""}
          </h3>
          {winnerReads.isLoading ? (
            <p className="font-urbanist mt-3 text-sm text-zinc-400">Loading winner decision...</p>
          ) : !winnerDetails ? (
            <p className="font-urbanist mt-3 text-sm text-zinc-400">No settled winner found in recent rounds.</p>
          ) : (
            <div className="mt-4 grid gap-2 text-sm">
              <p className="rounded-lg border border-zinc-800/70 bg-black/20 px-3 py-2 text-zinc-300">Winning agent: <span className="text-zinc-100">{shorten(winnerDetails.winner)}</span></p>
              <p className="rounded-lg border border-zinc-800/70 bg-black/20 px-3 py-2 text-zinc-300">Selected baker: <span className="text-zinc-100">{winnerDetails.baker || "-"}</span></p>
              <p className="rounded-lg border border-zinc-800/70 bg-black/20 px-3 py-2 text-zinc-300">Predicted APY: <span className="text-zinc-100">{formatBps(winnerDetails.predictedYieldBps)}</span></p>
              <p className="rounded-lg border border-zinc-800/70 bg-black/20 px-3 py-2 text-zinc-300">Realized APY: <span className="text-zinc-100">{formatBps(winnerDetails.actualYieldBps)}</span></p>
              <p className="rounded-lg border border-zinc-800/70 bg-black/20 px-3 py-2 text-zinc-300">Abs error: <span className="text-zinc-100">{String(winnerDetails.absError ?? 0n)} bps</span></p>
              <p className="rounded-lg border border-zinc-800/70 bg-black/20 px-3 py-2 text-zinc-300">Decision confidence: <span className="text-zinc-100">{decisionConfidence}%</span></p>
              <p className="rounded-lg border border-zinc-800/70 bg-black/20 px-3 py-2 text-zinc-300">Round reward: <span className="text-zinc-100">{formatToken(winnerDetails.reward)} XTZ</span></p>
              <p className="rounded-lg border border-zinc-800/70 bg-black/20 px-3 py-2 text-zinc-300">Reason summary: <span className="text-zinc-100">{winnerDetails.reasonSummary || "No summary"}</span></p>
              <p className="rounded-lg border border-zinc-800/70 bg-black/20 px-3 py-2 text-zinc-300">Reason hash: <span className="font-mono text-zinc-100">{shorten(winnerDetails.reasonHash)}</span></p>
            </div>
          )}
        </Card>
      </div>

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

      <Card className="rounded-3xl border-zinc-800/80 bg-zinc-900/60 p-6 backdrop-blur-xl">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold tracking-tight text-zinc-100">Competing Agent Network</h3>
          <p className="font-urbanist text-xs text-zinc-400">Platform-registered decision makers</p>
        </div>

        {platformAgentsLoading ? (
          <p className="font-urbanist text-sm text-zinc-400">Loading registered agents...</p>
        ) : platformAgents.length === 0 ? (
          <p className="font-urbanist text-sm text-zinc-400">No registered agents found.</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {platformAgents.map((agent) => (
              <div key={agent.address} className="rounded-2xl border border-zinc-800/70 bg-black/25 p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-zinc-100">{agent.name}</p>
                  <span className="font-urbanist rounded-full border border-zinc-700 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-zinc-300">
                    {statusLabel(agent.status)}
                  </span>
                </div>
                <p className="font-mono mt-2 text-xs text-zinc-400">{shorten(agent.address)}</p>

                <div className="mt-3 grid gap-1 text-xs">
                  <p className="text-zinc-400">Delegation score: <span className={scoreTone(agent.delegationScore)}>{String(agent.delegationScore)}</span></p>
                  <p className="text-zinc-400">Staking score: <span className={scoreTone(agent.stakingScore)}>{String(agent.stakingScore)}</span></p>
                </div>

                <button
                  type="button"
                  onClick={() => onCopyAddress(agent.address)}
                  className="font-urbanist mt-3 rounded-md border border-zinc-700 px-2.5 py-1 text-[11px] text-zinc-200 cursor-pointer"
                >
                  {copiedAddress === agent.address ? "Copied" : "Copy address"}
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
