"use client";

import { useMemo } from "react";
import { parseEther } from "viem";
import { useWriteContract } from "wagmi";
import { ADDRESSES } from "@/shared/hooks/useContractAddresses";
import { ERC20_ABI, SPLITTER_ABI } from "@/shared/lib/abis";
import { Mode } from "@/shared/types/contracts";

export function useSplit(mode: Mode, amount: string) {
  const { writeContractAsync, isPending } = useWriteContract();

  const token = mode === "DELEGATION" ? ADDRESSES.VAULT_D : ADDRESSES.VAULT_S;
  const modeValue = mode === "DELEGATION" ? 0 : 1;

  const parsedAmount = useMemo(() => {
    if (!amount || Number(amount) <= 0) return 0n;
    try {
      return parseEther(amount);
    } catch {
      return 0n;
    }
  }, [amount]);

  const approve = async () => {
    if (parsedAmount <= 0n) throw new Error("Enter a valid amount");
    return writeContractAsync({
      address: token,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [ADDRESSES.SPLITTER, parsedAmount],
    });
  };

  const split = async () => {
    if (parsedAmount <= 0n) throw new Error("Enter a valid amount");
    return writeContractAsync({
      address: ADDRESSES.SPLITTER,
      abi: SPLITTER_ABI,
      functionName: "deposit",
      args: [modeValue, parsedAmount],
    });
  };

  return {
    modeValue,
    token,
    parsedAmount,
    approve,
    split,
    isPending,
  };
}
