"use client";

import { useMemo } from "react";
import { parseEther } from "viem";
import { useReadContract, useWriteContract } from "wagmi";
import { ADDRESSES } from "@/shared/hooks/useContractAddresses";
import { AMM_ABI, ERC20_ABI } from "@/shared/lib/abis";
import { Mode } from "@/shared/types/contracts";

export type SwapDirection = "SY_TO_PT" | "PT_TO_SY";

export function useSwap(mode: Mode, direction: SwapDirection, amount: string) {
  const { writeContractAsync, isPending } = useWriteContract();

  const amm = mode === "DELEGATION" ? ADDRESSES.AMM_D : ADDRESSES.AMM_S;
  const sy = mode === "DELEGATION" ? ADDRESSES.VAULT_D : ADDRESSES.VAULT_S;
  const pt = mode === "DELEGATION" ? ADDRESSES.PT_D : ADDRESSES.PT_S;

  const tokenIn = direction === "SY_TO_PT" ? sy : pt;

  const parsedAmount = useMemo(() => {
    if (!amount || Number(amount) <= 0) return 0n;
    try {
      return parseEther(amount);
    } catch {
      return 0n;
    }
  }, [amount]);

  const { data: impliedRateBps } = useReadContract({
    address: amm,
    abi: AMM_ABI,
    functionName: "impliedRateBps",
    query: { refetchInterval: 15_000 },
  });

  const approve = async () => {
    if (parsedAmount <= 0n) throw new Error("Enter a valid amount");
    return writeContractAsync({
      address: tokenIn,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [amm, parsedAmount],
    });
  };

  const swap = async () => {
    if (parsedAmount <= 0n) throw new Error("Enter a valid amount");
    if (direction === "SY_TO_PT") {
      return writeContractAsync({
        address: amm,
        abi: AMM_ABI,
        functionName: "swapSYforPT",
        args: [parsedAmount, 0n],
      });
    }

    return writeContractAsync({
      address: amm,
      abi: AMM_ABI,
      functionName: "swapPTforSY",
      args: [parsedAmount, 0n],
    });
  };

  return {
    amm,
    sy,
    pt,
    tokenIn,
    parsedAmount,
    impliedRateBps,
    approve,
    swap,
    isPending,
  };
}
