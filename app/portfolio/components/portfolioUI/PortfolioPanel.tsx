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

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold">Delegation</h3>
            <Badge mode="DELEGATION" />
          </div>
          <dl className="grid gap-2 text-sm">
            <div className="flex justify-between"><dt className="text-zinc-400">slashDXTZ</dt><dd>{formatToken(slashD)}</dd></div>
            <div className="flex justify-between"><dt className="text-zinc-400">PT_D</dt><dd>{formatToken(ptD)}</dd></div>
            <div className="flex justify-between"><dt className="text-zinc-400">YT_D</dt><dd>{formatToken(ytD)}</dd></div>
          </dl>
          <RequireSiweAuth>
            <Button
              className="mt-4"
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

        <Card>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold">Staking</h3>
            <Badge mode="STAKING" />
          </div>
          <dl className="grid gap-2 text-sm">
            <div className="flex justify-between"><dt className="text-zinc-400">slashSXTZ</dt><dd>{formatToken(slashS)}</dd></div>
            <div className="flex justify-between"><dt className="text-zinc-400">PT_S</dt><dd>{formatToken(ptS)}</dd></div>
            <div className="flex justify-between"><dt className="text-zinc-400">YT_S</dt><dd>{formatToken(ytS)}</dd></div>
          </dl>
          <RequireSiweAuth>
            <Button
              className="mt-4"
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
        <p className="text-xs text-zinc-400">
          Redeem tx: <TxHashLink hash={redeemHash} />
        </p>
      ) : null}
      {redeemReceipt.data?.status === "success" ? <p className="text-xs text-emerald-400">Redeem confirmed on-chain.</p> : null}
    </div>
  );
}
