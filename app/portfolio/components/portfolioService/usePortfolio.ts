"use client";

import { useEffect, useMemo, useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { parseAbiItem } from "viem";
import { ADDRESSES } from "@/shared/hooks/useContractAddresses";
import { ERC20_ABI, ORACLE_ABI, VAULT_ABI, YT_ABI } from "@/shared/lib/abis";
import { usePublicClient } from "wagmi";

export type PortfolioActivity = {
  hash: `0x${string}`;
  token: string;
  direction: "IN" | "OUT";
  amount: bigint;
  timestamp: number;
};

const TRANSFER_EVENT = parseAbiItem(
  "event Transfer(address indexed from, address indexed to, uint256 value)"
);

const TRACKED_TOKENS: Array<{ address: `0x${string}`; symbol: string }> = [
  { address: ADDRESSES.VAULT_D, symbol: "slashDXTZ" },
  { address: ADDRESSES.VAULT_S, symbol: "slashSXTZ" },
  { address: ADDRESSES.PT_D, symbol: "PT_D" },
  { address: ADDRESSES.YT_D, symbol: "YT_D" },
  { address: ADDRESSES.PT_S, symbol: "PT_S" },
  { address: ADDRESSES.YT_S, symbol: "YT_S" },
];

export function usePortfolio() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync, isPending } = useWriteContract();
  const [activity, setActivity] = useState<PortfolioActivity[]>([]);

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

  const apyD = useReadContract({
    address: ADDRESSES.ORACLE_D,
    abi: ORACLE_ABI,
    functionName: "currentAPYBps",
    query: { refetchInterval: 15_000 },
  });

  const apyS = useReadContract({
    address: ADDRESSES.ORACLE_S,
    abi: ORACLE_ABI,
    functionName: "currentAPYBps",
    query: { refetchInterval: 15_000 },
  });

  const claimableYtD = useReadContract({
    address: ADDRESSES.YT_D,
    abi: YT_ABI,
    functionName: "claimableYield",
    args: address ? [address] : undefined,
    ...common,
  });

  const claimableYtS = useReadContract({
    address: ADDRESSES.YT_S,
    abi: YT_ABI,
    functionName: "claimableYield",
    args: address ? [address] : undefined,
    ...common,
  });

  useEffect(() => {
    if (!address || !publicClient) {
      setActivity([]);
      return;
    }

    let cancelled = false;

    const fetchActivity = async () => {
      try {
        const latestBlock = await publicClient.getBlockNumber();
        const fromBlock = latestBlock > 60_000n ? latestBlock - 60_000n : 0n;

        const events: Array<{
          hash: `0x${string}`;
          token: string;
          direction: "IN" | "OUT";
          amount: bigint;
          blockNumber: bigint;
        }> = [];

        for (const token of TRACKED_TOKENS) {
          const [inLogs, outLogs] = await Promise.all([
            publicClient.getLogs({
              address: token.address,
              event: TRANSFER_EVENT,
              args: { to: address },
              fromBlock,
              toBlock: "latest",
            }),
            publicClient.getLogs({
              address: token.address,
              event: TRANSFER_EVENT,
              args: { from: address },
              fromBlock,
              toBlock: "latest",
            }),
          ]);

          for (const log of inLogs) {
            const amount = (log.args.value as bigint | undefined) ?? 0n;
            if (!log.transactionHash || !log.blockNumber || amount <= 0n) {
              continue;
            }
            events.push({
              hash: log.transactionHash,
              token: token.symbol,
              direction: "IN",
              amount,
              blockNumber: log.blockNumber,
            });
          }

          for (const log of outLogs) {
            const amount = (log.args.value as bigint | undefined) ?? 0n;
            if (!log.transactionHash || !log.blockNumber || amount <= 0n) {
              continue;
            }
            events.push({
              hash: log.transactionHash,
              token: token.symbol,
              direction: "OUT",
              amount,
              blockNumber: log.blockNumber,
            });
          }
        }

        const uniqueBlocks = [...new Set(events.map((e) => e.blockNumber.toString()))].map((v) => BigInt(v));
        const blockTimes = new Map<bigint, number>();
        for (const blockNumber of uniqueBlocks) {
          const block = await publicClient.getBlock({ blockNumber });
          blockTimes.set(blockNumber, Number(block.timestamp));
        }

        const formatted = events
          .map((event) => ({
            hash: event.hash,
            token: event.token,
            direction: event.direction,
            amount: event.amount,
            timestamp: blockTimes.get(event.blockNumber) ?? 0,
          }))
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 12);

        if (!cancelled) {
          setActivity(formatted);
        }
      } catch {
        if (!cancelled) {
          setActivity([]);
        }
      }
    };

    fetchActivity();
    const interval = setInterval(fetchActivity, 60_000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [address, publicClient]);

  const balances = useMemo(
    () => ({
      slashD: (slashD.data as bigint | undefined) ?? 0n,
      slashS: (slashS.data as bigint | undefined) ?? 0n,
      ptD: (ptD.data as bigint | undefined) ?? 0n,
      ytD: (ytD.data as bigint | undefined) ?? 0n,
      ptS: (ptS.data as bigint | undefined) ?? 0n,
      ytS: (ytS.data as bigint | undefined) ?? 0n,
    }),
    [slashD.data, slashS.data, ptD.data, ytD.data, ptS.data, ytS.data]
  );

  const apyDelegation = (apyD.data as bigint | undefined) ?? 0n;
  const apyStaking = (apyS.data as bigint | undefined) ?? 0n;

  const metrics = useMemo(() => {
    const BPS = 10_000n;
    const DAYS = 365n;

    const available = balances.slashD + balances.slashS;
    const locked = balances.ptD + balances.ytD + balances.ptS + balances.ytS;

    // Approximate underlying exposure per mode:
    // - direct slash balance contributes 1:1
    // - split position contributes roughly one notional leg (PT or YT), not both
    const delegationNotional =
      balances.slashD + (balances.ptD > balances.ytD ? balances.ptD : balances.ytD);
    const stakingNotional =
      balances.slashS + (balances.ptS > balances.ytS ? balances.ptS : balances.ytS);

    const dailyYield =
      ((delegationNotional * apyDelegation + stakingNotional * apyStaking) / BPS) /
      DAYS;

    const monthlyYield = dailyYield * 30n;
    const claimableYield =
      ((claimableYtD.data as bigint | undefined) ?? 0n) +
      ((claimableYtS.data as bigint | undefined) ?? 0n);

    return {
      available,
      locked,
      dailyYield,
      monthlyYield,
      claimableYield,
      delegationNotional,
      stakingNotional,
      total: available + locked,
    };
  }, [balances, apyDelegation, apyStaking, claimableYtD.data, claimableYtS.data]);

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
    balances,
    activity,
    apyDelegation,
    apyStaking,
    metrics,
    redeem,
    isPending,
  };
}
