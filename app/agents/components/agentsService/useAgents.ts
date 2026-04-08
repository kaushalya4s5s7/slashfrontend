"use client";

import { useMemo } from "react";
import { useReadContract, useReadContracts } from "wagmi";
import { zeroAddress } from "viem";
import { ADDRESSES } from "@/shared/hooks/useContractAddresses";
import { COMP_ABI, ORACLE_ABI, REGISTRY_ABI } from "@/shared/lib/abis";

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

  return {
    round,
    timeLeft,
    apy,
    winnerRound: latestWinner?.round ?? 0n,
    winner: latestWinner?.winner ?? null,
    winnerReads,
    winnerAgent,
  };
}
