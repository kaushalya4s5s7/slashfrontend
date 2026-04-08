"use client";

import { useState } from "react";
import { useWaitForTransactionReceipt } from "wagmi";
import { Card } from "@/shared/components/ui/Card";
import { Button } from "@/shared/components/ui/Button";
import { Badge } from "@/shared/components/ui/Badge";
import { usePortfolio } from "@/app/portfolio/components/portfolioService/usePortfolio";
import { formatToken } from "@/shared/utils/format";
import { RequireSiweAuth } from "@/shared/components/RequireSiweAuth";
import { TxHashLink } from "@/shared/components/ui/TxHashLink";
import { getRedeemPortion } from "@/app/portfolio/hooks/useRedeemFraction";

export function PortfolioPanel() {
  const { address, balances, redeem, isPending } = usePortfolio();
  const [redeemHash, setRedeemHash] = useState<`0x${string}` | undefined>();
  const redeemReceipt = useWaitForTransactionReceipt({ hash: redeemHash, query: { enabled: Boolean(redeemHash) } });

  if (!address) {
    return <Card><p className="text-sm text-zinc-400">Connect wallet to view portfolio.</p></Card>;
  }

  const { slashD, slashS, ptD, ytD, ptS, ytS } = balances;
  const totalDelegation = slashD + ptD + ytD;
  const totalStaking = slashS + ptS + ytS;

  return (
    <div className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="rounded-2xl border-zinc-800/80 bg-zinc-900/55 p-5 backdrop-blur-xl">
          <p className="font-urbanist text-xs uppercase tracking-[0.18em] text-zinc-500">Delegation total</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-100">{formatToken(totalDelegation)}</p>
          <p className="font-urbanist mt-1 text-xs text-zinc-400">slashDXTZ + PT_D + YT_D</p>
        </Card>
        <Card className="rounded-2xl border-zinc-800/80 bg-zinc-900/55 p-5 backdrop-blur-xl">
          <p className="font-urbanist text-xs uppercase tracking-[0.18em] text-zinc-500">Staking total</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-100">{formatToken(totalStaking)}</p>
          <p className="font-urbanist mt-1 text-xs text-zinc-400">slashSXTZ + PT_S + YT_S</p>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="rounded-3xl border-zinc-800/80 bg-zinc-900/60 p-6 backdrop-blur-xl">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold tracking-tight text-zinc-100">Delegation Vault</h3>
            <Badge mode="DELEGATION" />
          </div>
          <dl className="grid gap-2 text-sm">
            <div className="flex justify-between rounded-lg border border-zinc-800/70 bg-black/20 px-3 py-2"><dt className="text-zinc-400">slashDXTZ</dt><dd className="text-zinc-100">{formatToken(slashD)}</dd></div>
            <div className="flex justify-between rounded-lg border border-zinc-800/70 bg-black/20 px-3 py-2"><dt className="text-zinc-400">PT_D</dt><dd className="text-zinc-100">{formatToken(ptD)}</dd></div>
            <div className="flex justify-between rounded-lg border border-zinc-800/70 bg-black/20 px-3 py-2"><dt className="text-zinc-400">YT_D</dt><dd className="text-zinc-100">{formatToken(ytD)}</dd></div>
          </dl>
          <RequireSiweAuth>
            <Button
              className="mt-5 h-11 w-full rounded-xl"
              variant="secondary"
              loading={isPending}
              disabled={slashD <= 0n}
              onClick={async () => {
                const hash = await redeem("D", getRedeemPortion(slashD));
                setRedeemHash(hash);
              }}
            >
              Redeem 10% slashDXTZ
            </Button>
          </RequireSiweAuth>
        </Card>

        <Card className="rounded-3xl border-zinc-800/80 bg-zinc-900/60 p-6 backdrop-blur-xl">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold tracking-tight text-zinc-100">Staking Vault</h3>
            <Badge mode="STAKING" />
          </div>
          <dl className="grid gap-2 text-sm">
            <div className="flex justify-between rounded-lg border border-zinc-800/70 bg-black/20 px-3 py-2"><dt className="text-zinc-400">slashSXTZ</dt><dd className="text-zinc-100">{formatToken(slashS)}</dd></div>
            <div className="flex justify-between rounded-lg border border-zinc-800/70 bg-black/20 px-3 py-2"><dt className="text-zinc-400">PT_S</dt><dd className="text-zinc-100">{formatToken(ptS)}</dd></div>
            <div className="flex justify-between rounded-lg border border-zinc-800/70 bg-black/20 px-3 py-2"><dt className="text-zinc-400">YT_S</dt><dd className="text-zinc-100">{formatToken(ytS)}</dd></div>
          </dl>
          <RequireSiweAuth>
            <Button
              className="mt-5 h-11 w-full rounded-xl"
              variant="secondary"
              loading={isPending}
              disabled={slashS <= 0n}
              onClick={async () => {
                const hash = await redeem("S", getRedeemPortion(slashS));
                setRedeemHash(hash);
              }}
            >
              Redeem 10% slashSXTZ
            </Button>
          </RequireSiweAuth>
        </Card>
      </div>

      {redeemHash ? (
        <p className="font-urbanist text-xs text-zinc-400">
          Redeem tx: <TxHashLink hash={redeemHash} />
        </p>
      ) : null}
      {redeemReceipt.data?.status === "success" ? <p className="font-urbanist text-xs text-emerald-400">Redeem confirmed on-chain.</p> : null}
    </div>
  );
}
