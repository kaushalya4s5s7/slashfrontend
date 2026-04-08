"use client";

import { useMemo } from "react";
import { useReadContract, useReadContracts } from "wagmi";
import { zeroAddress } from "viem";
import { ADDRESSES } from "@/shared/hooks/useContractAddresses";
import { COMP_ABI, ORACLE_ABI, REGISTRY_ABI } from "@/shared/lib/abis";

export type PlatformAgent = {
  address: `0x${string}`;
  name: string;
  status: number;
  delegationScore: bigint;
  stakingScore: bigint;
};

export function useAgents() {
  const round = useReadContract({
    address: ADDRESSES.COMP_D,
    abi: COMP_ABI,
    functionName: "currentRoundId",
    query: { refetchInterval: 10_000 },
  });

  const timeLeft = useReadContract({
    address: ADDRESSES.COMP_D,
    abi: COMP_ABI,
    functionName: "timeLeftInRound",
    query: { refetchInterval: 3_000 },
  });

  const apy = useReadContract({
    address: ADDRESSES.ORACLE_D,
    abi: ORACLE_ABI,
    functionName: "currentAPYBps",
    query: { refetchInterval: 15_000 },
  });

  const winnerRounds = useMemo(() => {
    const current = round.data;
    if (!current || current <= 1n) return [] as bigint[];

    const from = current - 1n;
    const lookback = 12n;
    const to = from > lookback ? from - lookback + 1n : 1n;

    const rounds: bigint[] = [];
    for (let r = from; r >= to; r--) {
      rounds.push(r);
      if (r === 1n) break;
    }
    return rounds;
  }, [round.data]);

  const winnerReads = useReadContracts({
    contracts: winnerRounds.map((r) => ({
      address: ADDRESSES.COMP_D,
      abi: COMP_ABI,
      functionName: "getWinner",
      args: [r],
    })),
    query: { enabled: winnerRounds.length > 0, refetchInterval: 10_000 },
  });

  const latestWinner = useMemo(() => {
    const data = winnerReads.data;
    if (!data?.length) return null;

    for (let i = 0; i < data.length; i++) {
      const entry = data[i] as
        | { result?: { winner?: `0x${string}`; declaredAt?: bigint } }
        | { winner?: `0x${string}`; declaredAt?: bigint }
        | undefined;

      const result =
        entry && typeof entry === "object" && "result" in entry
          ? entry.result
          : (entry as { winner?: `0x${string}`; declaredAt?: bigint } | undefined);

      if (!result) continue;
      if (!result.winner || result.winner === zeroAddress) continue;
      if ((result.declaredAt ?? 0n) === 0n) continue;

      return {
        round: winnerRounds[i],
        winner: result as NonNullable<typeof result>,
      };
    }

    return null;
  }, [winnerReads.data, winnerRounds]);

  const winnerAddress = latestWinner?.winner.winner;

  const winnerAgent = useReadContract({
    address: ADDRESSES.REGISTRY,
    abi: REGISTRY_ABI,
    functionName: "getAgent",
    args: winnerAddress ? [winnerAddress] : undefined,
    query: { enabled: Boolean(winnerAddress), refetchInterval: 10_000 },
  });

  const agentCount = useReadContract({
    address: ADDRESSES.REGISTRY,
    abi: REGISTRY_ABI,
    functionName: "agentCount",
    query: { refetchInterval: 15_000 },
  });

  const agentIndexes = useMemo(() => {
    const count = Number(agentCount.data ?? 0n);
    const capped = Number.isFinite(count) ? Math.max(0, Math.min(count, 50)) : 0;
    return Array.from({ length: capped }, (_, i) => BigInt(i));
  }, [agentCount.data]);

  const agentAddressReads = useReadContracts({
    contracts: agentIndexes.map((index) => ({
      address: ADDRESSES.REGISTRY,
      abi: REGISTRY_ABI,
      functionName: "agentList",
      args: [index],
    })),
    query: { enabled: agentIndexes.length > 0, refetchInterval: 15_000 },
  });

  const platformAddresses = useMemo(() => {
    if (!agentAddressReads.data?.length) return [] as `0x${string}`[];

    return agentAddressReads.data
      .map((entry) => {
        if (entry && typeof entry === "object" && "result" in entry) {
          const result = entry.result;
          return typeof result === "string" ? (result as `0x${string}`) : undefined;
        }
        return typeof entry === "string" ? (entry as `0x${string}`) : undefined;
      })
      .filter((addr): addr is `0x${string}` => Boolean(addr));
  }, [agentAddressReads.data]);

  const platformAgentReads = useReadContracts({
    contracts: platformAddresses.map((address) => ({
      address: ADDRESSES.REGISTRY,
      abi: REGISTRY_ABI,
      functionName: "getAgent",
      args: [address],
    })),
    query: { enabled: platformAddresses.length > 0, refetchInterval: 15_000 },
  });

  const platformAgents = useMemo(() => {
    if (!platformAgentReads.data?.length) return [] as PlatformAgent[];

    return platformAgentReads.data
      .map((entry, index) => {
        const address = platformAddresses[index];
        if (!address) return null;

        const record =
          entry && typeof entry === "object" && "result" in entry
            ? entry.result
            : entry;

        if (!record || typeof record !== "object") return null;

        const parsed = record as unknown as {
          name?: string;
          status?: bigint;
          delegationScore?: bigint;
          stakingScore?: bigint;
        };

        return {
          address,
          name: parsed.name || "(unnamed)",
          status: Number(parsed.status ?? 0n),
          delegationScore: parsed.delegationScore ?? 0n,
          stakingScore: parsed.stakingScore ?? 0n,
        } satisfies PlatformAgent;
      })
      .filter((agent): agent is PlatformAgent => Boolean(agent));
  }, [platformAgentReads.data, platformAddresses]);

  return {
    round,
    timeLeft,
    apy,
    winnerRound: latestWinner?.round ?? 0n,
    winner: latestWinner?.winner ?? null,
    winnerReads,
    winnerAgent,
    platformAgents,
    platformAgentsLoading:
      agentCount.isLoading || agentAddressReads.isLoading || platformAgentReads.isLoading,
  };
}
