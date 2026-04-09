"use client";

import { useMemo, useState } from "react";
import { formatUnits, parseUnits } from "viem";
import { useWaitForTransactionReceipt } from "wagmi";
import { Card } from "@/shared/components/ui/Card";
import { Button } from "@/shared/components/ui/Button";
import { Badge } from "@/shared/components/ui/Badge";
import { usePortfolio } from "@/app/portfolio/components/portfolioService/usePortfolio";
import { formatBps, formatToken } from "@/shared/utils/format";
import { RequireSiweAuth } from "@/shared/components/RequireSiweAuth";
import { TxHashLink } from "@/shared/components/ui/TxHashLink";
import { Area, AreaChart, ChartTooltip, Grid, XAxis, YAxis } from "@/components/ui/area-chart";

export function PortfolioPanel() {
  const { address, balances, redeem, redeemPrincipal, redeemYield, isPending, metrics, activity, apyDelegation, apyStaking } = usePortfolio();
  const [redeemHash, setRedeemHash] = useState<`0x${string}` | undefined>();
  const [amounts, setAmounts] = useState<Record<string, string>>({
    slashD: "",
    ptD: "",
    ytD: "",
    slashS: "",
    ptS: "",
    ytS: "",
  });
  const redeemReceipt = useWaitForTransactionReceipt({ hash: redeemHash, query: { enabled: Boolean(redeemHash) } });

  if (!address) {
    return <Card><p className="text-sm text-zinc-400">Connect wallet to view portfolio.</p></Card>;
  }

  const { slashD, slashS, ptD, ytD, ptS, ytS } = balances;
  const totalDelegation = slashD + ptD + ytD;
  const totalStaking = slashS + ptS + ytS;
  const totalYt = ytD + ytS;

  const projectionData = useMemo(() => {
    const daily = Number(metrics.dailyYield) / 1e18;
    const start = Number(metrics.total) / 1e18;
    return Array.from({ length: 14 }, (_, i) => ({
      date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000),
      value: Number((start + i * daily).toFixed(4)),
    }));
  }, [metrics.dailyYield, metrics.total]);

  const parseAmountWei = (value: string) => {
    if (!value.trim()) return 0n;
    try {
      return parseUnits(value, 18);
    } catch {
      return 0n;
    }
  };

  const setMax = (key: string, balance: bigint) => {
    setAmounts((prev) => ({ ...prev, [key]: formatUnits(balance, 18) }));
  };

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
          <p className="font-urbanist text-xs uppercase tracking-[0.18em] text-zinc-500">Estimated yield / day</p>
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
            <div className="flex justify-between rounded-lg border border-zinc-800/70 bg-black/20 px-3 py-2"><dt className="text-zinc-400">On-chain YT claimable</dt><dd className="text-emerald-300">{formatToken(metrics.claimableYield, 18, 10)}</dd></div>
            <div className="flex justify-between rounded-lg border border-zinc-800/70 bg-black/20 px-3 py-2"><dt className="text-zinc-400">Estimated daily</dt><dd className="text-emerald-300">{formatToken(metrics.dailyYield, 18, 10)}</dd></div>
            <div className="flex justify-between rounded-lg border border-zinc-800/70 bg-black/20 px-3 py-2"><dt className="text-zinc-400">Estimated monthly</dt><dd className="text-zinc-100">{formatToken(metrics.monthlyYield, 18, 10)}</dd></div>
          </dl>
          {metrics.claimableYield === 0n && totalYt > 0n ? (
            <p className="font-urbanist mt-3 text-xs text-zinc-500">No YT claimable yet. Yield appears after index updates and accrual time.</p>
          ) : null}
          {totalYt === 0n ? (
            <p className="font-urbanist mt-3 text-xs text-zinc-500">YT claimable tracks only YT holdings. Split deposit to mint YT.</p>
          ) : null}
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

          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-zinc-800/70 bg-black/20 p-3">
              <p className="font-urbanist text-xs text-zinc-400">Redeem slashDXTZ → native XTZ</p>
              <div className="mt-2 flex gap-2">
                <input
                  value={amounts.slashD}
                  onChange={(e) => setAmounts((prev) => ({ ...prev, slashD: e.target.value }))}
                  placeholder="0.0"
                  className="h-10 w-full border border-zinc-700 bg-zinc-900/60 px-3 text-sm text-zinc-100 outline-none focus:border-zinc-500"
                />
                <Button type="button" variant="secondary" className="h-10" onClick={() => setMax("slashD", slashD)}>Max</Button>
              </div>
              <RequireSiweAuth>
                <Button
                  className="mt-2 h-10 w-full rounded-xl"
                  variant="secondary"
                  loading={isPending}
                  disabled={(() => {
                    const amount = parseAmountWei(amounts.slashD);
                    return amount <= 0n || amount > slashD;
                  })()}
                  onClick={async () => {
                    const amount = parseAmountWei(amounts.slashD);
                    if (amount <= 0n || amount > slashD) return;
                    const hash = await redeem("D", amount);
                    setRedeemHash(hash);
                  }}
                >
                  Redeem slashDXTZ
                </Button>
              </RequireSiweAuth>
            </div>

            <div className="rounded-xl border border-zinc-800/70 bg-black/20 p-3">
              <p className="font-urbanist text-xs text-zinc-400">Redeem PT_D (after settlement)</p>
              <div className="mt-2 flex gap-2">
                <input
                  value={amounts.ptD}
                  onChange={(e) => setAmounts((prev) => ({ ...prev, ptD: e.target.value }))}
                  placeholder="0.0"
                  className="h-10 w-full border border-zinc-700 bg-zinc-900/60 px-3 text-sm text-zinc-100 outline-none focus:border-zinc-500"
                />
                <Button type="button" variant="secondary" className="h-10" onClick={() => setMax("ptD", ptD)}>Max</Button>
              </div>
              <RequireSiweAuth>
                <Button
                  className="mt-2 h-10 w-full rounded-xl"
                  variant="secondary"
                  loading={isPending}
                  disabled={(() => {
                    const amount = parseAmountWei(amounts.ptD);
                    return amount <= 0n || amount > ptD;
                  })()}
                  onClick={async () => {
                    const amount = parseAmountWei(amounts.ptD);
                    if (amount <= 0n || amount > ptD) return;
                    const hash = await redeemPrincipal(0, amount);
                    setRedeemHash(hash);
                  }}
                >
                  Redeem PT_D
                </Button>
              </RequireSiweAuth>
            </div>

            <div className="rounded-xl border border-zinc-800/70 bg-black/20 p-3">
              <p className="font-urbanist text-xs text-zinc-400">Redeem YT_D (after settlement)</p>
              <div className="mt-2 flex gap-2">
                <input
                  value={amounts.ytD}
                  onChange={(e) => setAmounts((prev) => ({ ...prev, ytD: e.target.value }))}
                  placeholder="0.0"
                  className="h-10 w-full border border-zinc-700 bg-zinc-900/60 px-3 text-sm text-zinc-100 outline-none focus:border-zinc-500"
                />
                <Button type="button" variant="secondary" className="h-10" onClick={() => setMax("ytD", ytD)}>Max</Button>
              </div>
              <RequireSiweAuth>
                <Button
                  className="mt-2 h-10 w-full rounded-xl"
                  variant="secondary"
                  loading={isPending}
                  disabled={(() => {
                    const amount = parseAmountWei(amounts.ytD);
                    return amount <= 0n || amount > ytD;
                  })()}
                  onClick={async () => {
                    const amount = parseAmountWei(amounts.ytD);
                    if (amount <= 0n || amount > ytD) return;
                    const hash = await redeemYield(0, amount);
                    setRedeemHash(hash);
                  }}
                >
                  Redeem YT_D
                </Button>
              </RequireSiweAuth>
            </div>
          </div>
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

          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-zinc-800/70 bg-black/20 p-3">
              <p className="font-urbanist text-xs text-zinc-400">Redeem slashSXTZ → native XTZ</p>
              <div className="mt-2 flex gap-2">
                <input
                  value={amounts.slashS}
                  onChange={(e) => setAmounts((prev) => ({ ...prev, slashS: e.target.value }))}
                  placeholder="0.0"
                  className="h-10 w-full border border-zinc-700 bg-zinc-900/60 px-3 text-sm text-zinc-100 outline-none focus:border-zinc-500"
                />
                <Button type="button" variant="secondary" className="h-10" onClick={() => setMax("slashS", slashS)}>Max</Button>
              </div>
              <RequireSiweAuth>
                <Button
                  className="mt-2 h-10 w-full rounded-xl"
                  variant="secondary"
                  loading={isPending}
                  disabled={(() => {
                    const amount = parseAmountWei(amounts.slashS);
                    return amount <= 0n || amount > slashS;
                  })()}
                  onClick={async () => {
                    const amount = parseAmountWei(amounts.slashS);
                    if (amount <= 0n || amount > slashS) return;
                    const hash = await redeem("S", amount);
                    setRedeemHash(hash);
                  }}
                >
                  Redeem slashSXTZ
                </Button>
              </RequireSiweAuth>
            </div>

            <div className="rounded-xl border border-zinc-800/70 bg-black/20 p-3">
              <p className="font-urbanist text-xs text-zinc-400">Redeem PT_S (after settlement)</p>
              <div className="mt-2 flex gap-2">
                <input
                  value={amounts.ptS}
                  onChange={(e) => setAmounts((prev) => ({ ...prev, ptS: e.target.value }))}
                  placeholder="0.0"
                  className="h-10 w-full border border-zinc-700 bg-zinc-900/60 px-3 text-sm text-zinc-100 outline-none focus:border-zinc-500"
                />
                <Button type="button" variant="secondary" className="h-10" onClick={() => setMax("ptS", ptS)}>Max</Button>
              </div>
              <RequireSiweAuth>
                <Button
                  className="mt-2 h-10 w-full rounded-xl"
                  variant="secondary"
                  loading={isPending}
                  disabled={(() => {
                    const amount = parseAmountWei(amounts.ptS);
                    return amount <= 0n || amount > ptS;
                  })()}
                  onClick={async () => {
                    const amount = parseAmountWei(amounts.ptS);
                    if (amount <= 0n || amount > ptS) return;
                    const hash = await redeemPrincipal(1, amount);
                    setRedeemHash(hash);
                  }}
                >
                  Redeem PT_S
                </Button>
              </RequireSiweAuth>
            </div>

            <div className="rounded-xl border border-zinc-800/70 bg-black/20 p-3">
              <p className="font-urbanist text-xs text-zinc-400">Redeem YT_S (after settlement)</p>
              <div className="mt-2 flex gap-2">
                <input
                  value={amounts.ytS}
                  onChange={(e) => setAmounts((prev) => ({ ...prev, ytS: e.target.value }))}
                  placeholder="0.0"
                  className="h-10 w-full border border-zinc-700 bg-zinc-900/60 px-3 text-sm text-zinc-100 outline-none focus:border-zinc-500"
                />
                <Button type="button" variant="secondary" className="h-10" onClick={() => setMax("ytS", ytS)}>Max</Button>
              </div>
              <RequireSiweAuth>
                <Button
                  className="mt-2 h-10 w-full rounded-xl"
                  variant="secondary"
                  loading={isPending}
                  disabled={(() => {
                    const amount = parseAmountWei(amounts.ytS);
                    return amount <= 0n || amount > ytS;
                  })()}
                  onClick={async () => {
                    const amount = parseAmountWei(amounts.ytS);
                    if (amount <= 0n || amount > ytS) return;
                    const hash = await redeemYield(1, amount);
                    setRedeemHash(hash);
                  }}
                >
                  Redeem YT_S
                </Button>
              </RequireSiweAuth>
            </div>
          </div>
        </Card>
      </div>

      <p className="font-urbanist text-xs text-zinc-500">
        Vault share redemption (`slashDXTZ`/`slashSXTZ`) is anytime. PT/YT redemption becomes claimable after settlement/maturity.
      </p>

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
