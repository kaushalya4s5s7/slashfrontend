"use client";

import { useEffect, useMemo, useState } from "react";
import { useWaitForTransactionReceipt } from "wagmi";
import { ArrowDown } from "lucide-react";
import { Tabs } from "@/shared/components/ui/Tabs";
import { Button } from "@/shared/components/ui/Button";
import { formatBps, formatToken } from "@/shared/utils/format";
import { Mode } from "@/shared/types/contracts";
import { SwapDirection, useSwap } from "@/app/swap/components/swapService/useSwap";
import { TxHashLink } from "@/shared/components/ui/TxHashLink";
import { useSwapState } from "@/app/swap/hooks/useSwapState";
import { useSiweAuth } from "@/shared/context/siwe-auth-context";
import { Area, AreaChart, ChartTooltip, Grid, XAxis, YAxis } from "@/components/ui/area-chart";

type LiquidityPoint = {
  date: Date;
  sy: number;
  pt: number;
  total: number;
};

export function SwapPanel() {
  const { mode, setMode, direction, setDirection, amount, setAmount } = useSwapState();
  const [slippage, setSlippage] = useState("0.5");
  const [showLiquidity, setShowLiquidity] = useState(false);
  const [liquiditySeries, setLiquiditySeries] = useState<LiquidityPoint[]>([]);
  const [approveHash, setApproveHash] = useState<`0x${string}` | undefined>();
  const [swapHash, setSwapHash] = useState<`0x${string}` | undefined>();
  const [actionError, setActionError] = useState<string | null>(null);

  const { isAuthenticated } = useSiweAuth();

  const { impliedRateBps, expectedOut, minOut, approve, swap, isPending, needsApproval, ptReserve, syReserve } = useSwap(mode, direction, amount, slippage);

  const swapReceipt = useWaitForTransactionReceipt({ hash: swapHash, query: { enabled: Boolean(swapHash) } });

  const sellToken = direction === "SY_TO_PT" ? (mode === "DELEGATION" ? "slashDXTZ" : "slashSXTZ") : mode === "DELEGATION" ? "PT_D" : "PT_S";
  const buyToken = direction === "SY_TO_PT" ? (mode === "DELEGATION" ? "PT_D" : "PT_S") : mode === "DELEGATION" ? "slashDXTZ" : "slashSXTZ";

  const onToggleDirection = () => {
    setDirection(direction === "SY_TO_PT" ? "PT_TO_SY" : "SY_TO_PT");
  };

  const onAction = async () => {
    setActionError(null);
    try {
      if (needsApproval) {
        const hash = await approve();
        setApproveHash(hash);
        return;
      }
      const hash = await swap();
      setSwapHash(hash);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Transaction failed");
    }
  };

  useEffect(() => {
    const sy = Number(syReserve) / 1e18;
    const pt = Number(ptReserve) / 1e18;
    const total = sy + pt;

    setLiquiditySeries((prev) => {
      const next: LiquidityPoint = { date: new Date(), sy, pt, total };
      const deduped = prev.filter((entry) => entry.date.getTime() !== next.date.getTime());
      return [...deduped, next].slice(-24);
    });
  }, [syReserve, ptReserve, mode]);

  const latestLiquidity = useMemo(() => {
    if (liquiditySeries.length === 0) {
      return { sy: 0, pt: 0, total: 0 };
    }
    return liquiditySeries[liquiditySeries.length - 1] ?? { sy: 0, pt: 0, total: 0 };
  }, [liquiditySeries]);

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="rounded-[2rem] border border-zinc-800/80 bg-zinc-900/60 p-5 shadow-[0_30px_80px_-35px_rgba(0,0,0,0.95)] backdrop-blur-xl sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-zinc-100">Swap exposure</h2>
            <p className="font-urbanist text-sm text-zinc-400">Shift between fixed and variable yield positions.</p>
          </div>
          <div className="rounded-full border border-zinc-700/80 bg-black/25 px-3 py-1 text-xs text-zinc-300">
            Implied APY: <span className="text-zinc-100">{formatBps(impliedRateBps)}</span>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Tabs
            value={mode}
            onChange={(next) => setMode(next as Mode)}
            tabs={[
              { value: "DELEGATION", label: "Delegation" },
              { value: "STAKING", label: "Staking" },
            ]}
          />
          <label className="font-urbanist inline-flex items-center gap-2 text-xs text-zinc-400">
            Slippage
            <input
              className="w-16 rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-right text-xs text-zinc-100 outline-none"
              type="number"
              min="0.1"
              max="5"
              step="0.1"
              value={slippage}
              onChange={(e) => setSlippage(e.target.value)}
            />
            %
          </label>
        </div>

        <div className="relative space-y-3">
          <div className="rounded-[1.6rem] border border-zinc-800/80 bg-zinc-950/85 p-5">
            <p className="font-urbanist mb-3 text-xs uppercase tracking-[0.16em] text-zinc-500">Sell</p>
            <div className="flex items-end justify-between gap-3">
              <input
                className="w-full bg-transparent text-4xl leading-none text-zinc-200 outline-none placeholder:text-zinc-600 sm:text-5xl"
                type="number"
                min="0"
                step="0.0001"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
              />
              <button
                type="button"
                onClick={onToggleDirection}
                className="rounded-full border border-zinc-700/80 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-200"
              >
                {sellToken}
              </button>
            </div>
          </div>

          <div className="absolute left-1/2 top-[calc(50%-20px)] z-10 -translate-x-1/2 -translate-y-1/2">
            <button
              type="button"
              onClick={onToggleDirection}
              className="rounded-2xl border border-zinc-700 bg-zinc-900 p-3 text-zinc-100 shadow-lg"
            >
              <ArrowDown className="h-5 w-5" />
            </button>
          </div>

          <div className="rounded-[1.6rem] border border-zinc-800/80 bg-zinc-900/65 p-5 pt-7">
            <p className="font-urbanist mb-3 text-xs uppercase tracking-[0.16em] text-zinc-500">Buy</p>
            <div className="flex items-end justify-between gap-3">
              <div className="text-4xl leading-none text-zinc-200 sm:text-5xl">{formatToken(expectedOut, 18, 4)}</div>
              <button
                type="button"
                onClick={onToggleDirection}
                className="rounded-full border border-zinc-700/80 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-200"
              >
                {buyToken}
              </button>
            </div>
          </div>
        </div>

        <Button
          className="mt-5 h-12 w-full  text-base font-semibold text-zinc-950"
          onClick={onAction}
          loading={isPending}
          disabled={!isAuthenticated}
        >
          {!isAuthenticated ? "Sign in to continue" : needsApproval ? `Approve ${sellToken}` : "Execute swap"}
        </Button>

        <div className="font-urbanist mt-4 space-y-1.5 text-xs text-zinc-400">
          <p>Route: {direction === "SY_TO_PT" ? "Lock fixed yield (SY → PT)" : "Go variable yield (PT → SY)"}</p>
          <p>Min received: {formatToken(minOut)} {buyToken}</p>
          {approveHash ? <p>Approve tx: <TxHashLink hash={approveHash} /></p> : null}
          {swapHash ? <p>Swap tx: <TxHashLink hash={swapHash} /></p> : null}
          {actionError ? <p className="text-red-400">{actionError}</p> : null}
          {swapReceipt.data?.status === "success" ? <p className="text-emerald-400">Swap confirmed on-chain.</p> : null}
        </div>

        <button
          type="button"
          className="mt-5 text-sm font-medium text-zinc-300 underline-offset-4 hover:text-zinc-100 hover:underline"
          onClick={() => setShowLiquidity((prev) => !prev)}
        >
          View liquidity
        </button>

        {showLiquidity ? (
          <div className="mt-4 rounded-2xl border border-zinc-800/80 bg-black/20 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-zinc-100">AMM Liquidity</p>
              <p className="font-urbanist text-xs text-zinc-400">{mode} pool</p>
            </div>
            <AreaChart data={liquiditySeries.length > 1 ? liquiditySeries : [{ date: new Date(Date.now() - 60_000), sy: latestLiquidity.sy, pt: latestLiquidity.pt, total: latestLiquidity.total }, { date: new Date(), sy: latestLiquidity.sy, pt: latestLiquidity.pt, total: latestLiquidity.total }]} margin={{ left: 46, right: 16, top: 18, bottom: 32 }} aspectRatio="2.4 / 1">
              <Grid horizontal />
              <Area dataKey="total" fill="var(--chart-line-primary)" stroke="var(--chart-line-primary)" fillOpacity={0.2} strokeWidth={2} />
              <Area dataKey="sy" fill="var(--chart-line-secondary)" stroke="var(--chart-line-secondary)" fillOpacity={0.15} strokeWidth={1.6} />
              <YAxis formatValue={(value) => `${value.toFixed(2)}`} />
              <XAxis numTicks={4} />
              <ChartTooltip />
            </AreaChart>

            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/60 px-3 py-2 text-xs text-zinc-300">SY reserve: <span className="text-zinc-100">{latestLiquidity.sy.toFixed(4)}</span></div>
              <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/60 px-3 py-2 text-xs text-zinc-300">PT reserve: <span className="text-zinc-100">{latestLiquidity.pt.toFixed(4)}</span></div>
              <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/60 px-3 py-2 text-xs text-zinc-300">Total liquidity: <span className="text-zinc-100">{latestLiquidity.total.toFixed(4)}</span></div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
