"use client";

import { useState } from "react";
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

export function SwapPanel() {
  const { mode, setMode, direction, setDirection, amount, setAmount } = useSwapState();
  const [slippage, setSlippage] = useState("0.5");
  const [approveHash, setApproveHash] = useState<`0x${string}` | undefined>();
  const [swapHash, setSwapHash] = useState<`0x${string}` | undefined>();
  const [actionError, setActionError] = useState<string | null>(null);

  const { isAuthenticated } = useSiweAuth();

  const { impliedRateBps, expectedOut, minOut, approve, swap, isPending, needsApproval } = useSwap(mode, direction, amount, slippage);

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

  return (
    <div className="mx-auto w-full max-w-2xl mt-10 px-4">
      <div className="rounded-[32px] border border-zinc-800 bg-black/80 p-4 shadow-[0_0_40px_rgba(0,0,0,0.4)] backdrop-blur-sm sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-zinc-100">Swap</h2>
          <div className="text-xs text-zinc-400">Implied APY: {formatBps(impliedRateBps)}</div>
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Tabs
            value={mode}
            onChange={(next) => setMode(next as Mode)}
            tabs={[
              { value: "DELEGATION", label: "Delegation" },
              { value: "STAKING", label: "Staking" },
            ]}
          />
          <label className="inline-flex items-center gap-2 text-xs text-zinc-400">
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

        <div className="relative space-y-2">
          <div className="rounded-[28px] border border-zinc-800 bg-zinc-950/90 p-5">
            <p className="mb-3 text-sm text-zinc-400">Sell</p>
            <div className="flex items-end justify-between gap-3">
              <input
                className="w-full bg-transparent text-5xl leading-none text-zinc-200 outline-none placeholder:text-zinc-600"
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
                className="rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-200"
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
              <ArrowDown className="h-6 w-6" />
            </button>
          </div>

          <div className="rounded-[28px] border border-zinc-800 bg-zinc-900/60 p-5 pt-7">
            <p className="mb-3 text-sm text-zinc-400">Buy</p>
            <div className="flex items-end justify-between gap-3">
              <div className="text-5xl leading-none text-zinc-300">{formatToken(expectedOut, 18, 4)}</div>
              <button
                type="button"
                onClick={onToggleDirection}
                className="rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-200"
              >
                {buyToken}
              </button>
            </div>
          </div>
        </div>

        <Button
          className="mt-4 h-14 w-full rounded-2xl bg-gradient-to-r from-orange-600 to-orange-500 text-xl font-semibold text-white"
          onClick={onAction}
          loading={isPending}
          disabled={!isAuthenticated}
        >
          {!isAuthenticated ? "Sign in to continue" : needsApproval ? `Approve ${sellToken}` : "Get started"}
        </Button>

        <div className="mt-3 space-y-1 text-xs text-zinc-400">
          <p>Route: {direction === "SY_TO_PT" ? "Lock fixed yield (SY → PT)" : "Go variable yield (PT → SY)"}</p>
          <p>Min received: {formatToken(minOut)} {buyToken}</p>
          {approveHash ? <p>Approve tx: <TxHashLink hash={approveHash} /></p> : null}
          {swapHash ? <p>Swap tx: <TxHashLink hash={swapHash} /></p> : null}
          {actionError ? <p className="text-red-400">{actionError}</p> : null}
          {swapReceipt.data?.status === "success" ? <p className="text-emerald-400">Swap confirmed on-chain.</p> : null}
        </div>
      </div>
    </div>
  );
}
