"use client";

import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { ADDRESSES } from "@/shared/hooks/useContractAddresses";
import { ERC20_ABI, VAULT_ABI } from "@/shared/lib/abis";

export function usePortfolio() {
  const { address } = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();

  const common = {
    query: { enabled: Boolean(address), refetchInterval: 15_000 },
  } as const;

  const slashD = useReadContract({
    address: ADDRESSES.VAULT_D,
    abi: VAULT_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    ...common,
  });

  const slashS = useReadContract({
    address: ADDRESSES.VAULT_S,
    abi: VAULT_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    ...common,
  });

  const ptD = useReadContract({
    address: ADDRESSES.PT_D,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    ...common,
  });

  const ytD = useReadContract({
    address: ADDRESSES.YT_D,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    ...common,
  });

  const ptS = useReadContract({
    address: ADDRESSES.PT_S,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    ...common,
  });

  const ytS = useReadContract({
    address: ADDRESSES.YT_S,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    ...common,
  });

  const redeem = async (vault: "D" | "S", shares: bigint) => {
    const address = vault === "D" ? ADDRESSES.VAULT_D : ADDRESSES.VAULT_S;
    return writeContractAsync({
      address,
      abi: VAULT_ABI,
      functionName: "redeem",
      args: [shares],
    });
  };

  return {
    address,
    balances: {
      slashD: (slashD.data as bigint | undefined) ?? 0n,
      slashS: (slashS.data as bigint | undefined) ?? 0n,
      ptD: (ptD.data as bigint | undefined) ?? 0n,
      ytD: (ytD.data as bigint | undefined) ?? 0n,
      ptS: (ptS.data as bigint | undefined) ?? 0n,
      ytS: (ytS.data as bigint | undefined) ?? 0n,
    },
    redeem,
    isPending,
  };
}
