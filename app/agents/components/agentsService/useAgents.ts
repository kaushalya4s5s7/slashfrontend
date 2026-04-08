"use client";

import { useMemo } from "react";
import { useReadContract } from "wagmi";
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

  const winnerRound = useMemo(() => {
    const current = round.data;
    if (!current || current === 0n) return 0n;
    return current - 1n;
  }, [round.data]);

  const winner = useReadContract({
    address: ADDRESSES.COMP_D,
    abi: COMP_ABI,
    functionName: "getWinner",
    args: [winnerRound],
    query: { enabled: winnerRound > 0n, refetchInterval: 10_000 },
  });

  const winnerAddress = winner.data?.winner;

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
    winnerRound,
    winner,
    winnerAgent,
  };
}
