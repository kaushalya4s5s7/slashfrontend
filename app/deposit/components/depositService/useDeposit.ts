"use client";

import { useMemo } from "react";
import { parseEther } from "viem";
import { useReadContract, useWriteContract } from "wagmi";
import { ADDRESSES } from "@/shared/hooks/useContractAddresses";
import { ORACLE_ABI, VAULT_ABI } from "@/shared/lib/abis";
import { Mode } from "@/shared/types/contracts";

export function useDeposit(mode: Mode, amount: string) {
  const { writeContractAsync, isPending } = useWriteContract();

  const vault = mode === "DELEGATION" ? ADDRESSES.VAULT_D : ADDRESSES.VAULT_S;
  const oracle = mode === "DELEGATION" ? ADDRESSES.ORACLE_D : ADDRESSES.ORACLE_S;

  const parsedAmount = useMemo(() => {
    if (!amount || Number(amount) <= 0) return 0n;
    try {
      return parseEther(amount);
    } catch {
      return 0n;
    }
  }, [amount]);

  const { data: apyBps, isLoading: apyLoading, refetch: refetchApy } = useReadContract({
    address: oracle,
    abi: ORACLE_ABI,
    functionName: "currentAPYBps",
    query: { refetchInterval: 15_000 },
  });

  const deposit = async () => {
    if (parsedAmount <= 0n) throw new Error("Enter a valid amount");
    return writeContractAsync({
      address: vault,
      abi: VAULT_ABI,
      functionName: "deposit",
      value: parsedAmount,
    });
  };

  return {
    vault,
    oracle,
    apyBps,
    apyLoading,
    parsedAmount,
    deposit,
    isPending,
    refetchApy,
  };
}
