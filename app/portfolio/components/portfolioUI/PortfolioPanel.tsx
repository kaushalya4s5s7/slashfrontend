"use client";

import { useMemo, useState } from "react";
import { useWaitForTransactionReceipt } from "wagmi";
import { Card } from "@/shared/components/ui/Card";
import { Button } from "@/shared/components/ui/Button";
import { Badge } from "@/shared/components/ui/Badge";
import { usePortfolio } from "@/app/portfolio/components/portfolioService/usePortfolio";
import { formatBps, formatToken } from "@/shared/utils/format";
import { RequireSiweAuth } from "@/shared/components/RequireSiweAuth";
import { TxHashLink } from "@/shared/components/ui/TxHashLink";
import { getRedeemPortion } from "@/app/portfolio/hooks/useRedeemFraction";
import { Area, AreaChart, ChartTooltip, Grid, XAxis, YAxis } from "@/components/ui/area-chart";

export function PortfolioPanel() {
  const { address, balances, redeem, isPending, metrics, activity, apyDelegation, apyStaking } = usePortfolio();
  const [redeemHash, setRedeemHash] = useState<`0x${string}` | undefined>();
  const redeemReceipt = useWaitForTransactionReceipt({ hash: redeemHash, query: { enabled: Boolean(redeemHash) } });

  if (!address) {
    return <Card><p className="text-sm text-zinc-400">Connect wallet to view portfolio.</p></Card>;
  }

  const { slashD, slashS, ptD, ytD, ptS, ytS } = balances;
  const totalDelegation = slashD + ptD + ytD;
  const totalStaking = slashS + ptS + ytS;

  const projectionData = useMemo(() => {
    const daily = Number(metrics.dailyYield) / 1e18;
    const start = Number(metrics.total) / 1e18;
    return Array.from({ length: 14 }, (_, i) => ({
      date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000),
      value: Number((start + i * daily).toFixed(4)),
    }));
  }, [metrics.dailyYield, metrics.total]);

  return (
    <div className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-2xl border-zinc-800/80 bg-zinc-900/55 p-5 backdrop-blur-xl">
          <p className="font-urbanist text-xs uppercase tracking-[0.18em] text-zinc-500">Total balance</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-100">{formatToken(metrics.total)}</p>
          <p className="font-urbanist mt-1 text-xs text-zinc-400">All slashXTZ + PT + YT</p>
        </Card>
        <Card className="rounded-2xl border-zinc-800/80 bg-zinc-900/55 p-5 backdrop-blur-xl">
          <p className="font-urbanist text-xs uppercase tracking-[0.18em] text-zinc-500">Available balance</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-100">{formatToken(metrics.available)}</p>
          <p className="font-urbanist mt-1 text-xs text-zinc-400">slashDXTZ + slashSXTZ</p>
        </Card>
        <Card className="rounded-2xl border-zinc-800/80 bg-zinc-900/55 p-5 backdrop-blur-xl">
          <p className="font-urbanist text-xs uppercase tracking-[0.18em] text-zinc-500">Locked tokens</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-100">{formatToken(metrics.locked)}</p>
          <p className="font-urbanist mt-1 text-xs text-zinc-400">PT + YT positions</p>
        </Card>
        <Card className="rounded-2xl border-zinc-800/80 bg-zinc-900/55 p-5 backdrop-blur-xl">
          <p className="font-urbanist text-xs uppercase tracking-[0.18em] text-zinc-500">Yield accrued / day</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-emerald-300">{formatToken(metrics.dailyYield)}</p>
          <p className="font-urbanist mt-1 text-xs text-zinc-400">~{formatToken(metrics.monthlyYield)} / month</p>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-3xl border-zinc-800/80 bg-zinc-900/60 p-6 backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold tracking-tight text-zinc-100">Portfolio trend</h3>
            <p className="font-urbanist text-xs text-zinc-400">Estimated from current APY</p>
          </div>
          <AreaChart data={projectionData} margin={{ left: 50, right: 20, bottom: 30, top: 20 }}>
            <Grid horizontal />
            <Area dataKey="value" fillOpacity={0.2} strokeWidth={2} />
            <YAxis formatValue={(value) => `${value.toFixed(2)}`} />
            <XAxis />
            <ChartTooltip />
          </AreaChart>
        </Card>

        <Card className="rounded-3xl border-zinc-800/80 bg-zinc-900/60 p-6 backdrop-blur-xl">
          <h3 className="text-lg font-semibold tracking-tight text-zinc-100">Yield details</h3>
          <dl className="mt-4 grid gap-2 text-sm">
            <div className="flex justify-between rounded-lg border border-zinc-800/70 bg-black/20 px-3 py-2"><dt className="text-zinc-400">Delegation APY</dt><dd className="text-zinc-100">{formatBps(apyDelegation)}</dd></div>
            <div className="flex justify-between rounded-lg border border-zinc-800/70 bg-black/20 px-3 py-2"><dt className="text-zinc-400">Staking APY</dt><dd className="text-zinc-100">{formatBps(apyStaking)}</dd></div>
            <div className="flex justify-between rounded-lg border border-zinc-800/70 bg-black/20 px-3 py-2"><dt className="text-zinc-400">Estimated daily</dt><dd className="text-emerald-300">{formatToken(metrics.dailyYield)}</dd></div>
            <div className="flex justify-between rounded-lg border border-zinc-800/70 bg-black/20 px-3 py-2"><dt className="text-zinc-400">Estimated monthly</dt><dd className="text-zinc-100">{formatToken(metrics.monthlyYield)}</dd></div>
          </dl>
        </Card>
      </div>

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

      <Card className="rounded-3xl border-zinc-800/80 bg-zinc-900/60 p-6 backdrop-blur-xl">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold tracking-tight text-zinc-100">Transaction history</h3>
          <p className="font-urbanist text-xs text-zinc-400">Latest wallet transfers</p>
        </div>
        <div className="space-y-2">
          {activity.length === 0 ? (
            <p className="font-urbanist text-sm text-zinc-400">No recent activity found for tracked protocol tokens.</p>
          ) : (
            activity.map((tx) => (
              <div key={`${tx.hash}-${tx.token}-${tx.direction}`} className="flex items-center justify-between rounded-xl border border-zinc-800/70 bg-black/20 px-3 py-2 text-sm">
                <div>
                  <p className="text-zinc-100">{tx.direction === "IN" ? "Received" : "Sent"} {tx.token}</p>
                  <p className="font-urbanist text-xs text-zinc-400">{new Date(tx.timestamp * 1000).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className={tx.direction === "IN" ? "text-emerald-300" : "text-zinc-100"}>{tx.direction === "IN" ? "+" : "-"}{formatToken(tx.amount)}</p>
                  <p className="font-urbanist text-xs text-zinc-400"><TxHashLink hash={tx.hash} /></p>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {redeemHash ? (
        <p className="font-urbanist text-xs text-zinc-400">
          Redeem tx: <TxHashLink hash={redeemHash} />
        </p>
      ) : null}
      {redeemReceipt.data?.status === "success" ? <p className="font-urbanist text-xs text-emerald-400">Redeem confirmed on-chain.</p> : null}
    </div>
  );
}
