"use client";

import { useMemo } from "react";
import { parseEther } from "viem";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { ADDRESSES } from "@/shared/hooks/useContractAddresses";
import { AMM_ABI, ERC20_ABI } from "@/shared/lib/abis";
import { Mode } from "@/shared/types/contracts";

export type SwapDirection = "SY_TO_PT" | "PT_TO_SY";

const BPS = 10_000n;

export function useSwap(mode: Mode, direction: SwapDirection, amount: string, slippagePct: string) {
  const { address } = useAccount();
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

  const { data: feeRateBps } = useReadContract({
    address: amm,
    abi: AMM_ABI,
    functionName: "feeRateBps",
    query: { refetchInterval: 15_000 },
  });

  const { data: ptReserve } = useReadContract({
    address: amm,
    abi: AMM_ABI,
    functionName: "ptReserve",
    query: { refetchInterval: 15_000 },
  });

  const { data: syReserve } = useReadContract({
    address: amm,
    abi: AMM_ABI,
    functionName: "syReserve",
    query: { refetchInterval: 15_000 },
  });

  const { data: allowance } = useReadContract({
    address: tokenIn,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: address ? [address, amm] : undefined,
    query: {
      enabled: Boolean(address),
      refetchInterval: 8_000,
    },
  });

  const slippageBps = useMemo(() => {
    const n = Number(slippagePct);
    if (!Number.isFinite(n) || n <= 0) return 50n;
    const bps = Math.round(n * 100);
    const clamped = Math.min(500, Math.max(1, bps));
    return BigInt(clamped);
  }, [slippagePct]);

  const expectedOut = useMemo(() => {
    if (parsedAmount <= 0n) return 0n;
    const fee = (feeRateBps as bigint | undefined) ?? 0n;
    const ptRes = (ptReserve as bigint | undefined) ?? 0n;
    const syRes = (syReserve as bigint | undefined) ?? 0n;
    if (ptRes === 0n || syRes === 0n) return 0n;

    const inWithFee = parsedAmount * (BPS - fee);
    if (direction === "SY_TO_PT") {
      const numerator = inWithFee * ptRes;
      const denominator = syRes * BPS + inWithFee;
      return denominator === 0n ? 0n : numerator / denominator;
    }

    const numerator = inWithFee * syRes;
    const denominator = ptRes * BPS + inWithFee;
    return denominator === 0n ? 0n : numerator / denominator;
  }, [direction, feeRateBps, parsedAmount, ptReserve, syReserve]);

  const minOut = useMemo(() => {
    if (expectedOut <= 0n) return 0n;
    return (expectedOut * (BPS - slippageBps)) / BPS;
  }, [expectedOut, slippageBps]);

  const currentAllowance = (allowance as bigint | undefined) ?? 0n;
  const needsApproval = parsedAmount > 0n && currentAllowance < parsedAmount;

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
    if (minOut <= 0n) throw new Error("Quote unavailable or amount too small");
    if (direction === "SY_TO_PT") {
      return writeContractAsync({
        address: amm,
        abi: AMM_ABI,
        functionName: "swapSYforPT",
        args: [parsedAmount, minOut],
      });
    }

    return writeContractAsync({
      address: amm,
      abi: AMM_ABI,
      functionName: "swapPTforSY",
      args: [parsedAmount, minOut],
    });
  };

  return {
    amm,
    sy,
    pt,
    tokenIn,
    parsedAmount,
    impliedRateBps,
    ptReserve: (ptReserve as bigint | undefined) ?? 0n,
    syReserve: (syReserve as bigint | undefined) ?? 0n,
    slippageBps,
    expectedOut,
    minOut,
    allowance: currentAllowance,
    needsApproval,
    approve,
    swap,
    isPending,
  };
}
