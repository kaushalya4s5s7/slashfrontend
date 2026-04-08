"use client";

import { useState } from "react";
import { useWaitForTransactionReceipt } from "wagmi";
import { Tabs } from "@/shared/components/ui/Tabs";
import { Card } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";
import { Input } from "@/shared/components/ui/Input";
import { Button } from "@/shared/components/ui/Button";
import { formatBps } from "@/shared/utils/format";
import { Mode } from "@/shared/types/contracts";
import { RequireSiweAuth } from "@/shared/components/RequireSiweAuth";
import { SwapDirection, useSwap } from "@/app/swap/components/swapService/useSwap";
import { TxHashLink } from "@/shared/components/ui/TxHashLink";
import { useSwapState } from "@/app/swap/hooks/useSwapState";

export function SwapPanel() {
  const { mode, setMode, direction, setDirection, amount, setAmount } = useSwapState();
  const [approveHash, setApproveHash] = useState<`0x${string}` | undefined>();
  const [swapHash, setSwapHash] = useState<`0x${string}` | undefined>();

  const { impliedRateBps, approve, swap, isPending } = useSwap(mode, direction, amount);

  const approveReceipt = useWaitForTransactionReceipt({ hash: approveHash, query: { enabled: Boolean(approveHash) } });
  const swapReceipt = useWaitForTransactionReceipt({ hash: swapHash, query: { enabled: Boolean(swapHash) } });

  const tokenIn = direction === "SY_TO_PT" ? (mode === "DELEGATION" ? "slashDXTZ" : "slashSXTZ") : mode === "DELEGATION" ? "PT_D" : "PT_S";

  return (
    <div className="grid gap-4">
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Swap</h2>
          <Badge mode={mode} />
        </div>

        <div className="space-y-3">
          <Tabs
            value={mode}
            onChange={(next) => setMode(next as Mode)}
            tabs={[
              { value: "DELEGATION", label: "Delegation Pool" },
              { value: "STAKING", label: "Staking Pool" },
            ]}
          />

          <Tabs
            value={direction}
            onChange={(next) => setDirection(next as SwapDirection)}
            tabs={[
              { value: "SY_TO_PT", label: "Buy PT (fixed)" },
              { value: "PT_TO_SY", label: "Sell PT (variable)" },
            ]}
          />

          <Input
            label="Amount in"
            suffix={tokenIn}
            type="number"
            min="0"
            step="0.0001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <p className="text-xs text-zinc-400">Implied APY: {formatBps(impliedRateBps)}</p>
          <p className="text-xs text-zinc-500">Slippage protection: `minOut` currently set to 0 for MVP.</p>
        </div>
      </Card>

      <RequireSiweAuth>
        <Card>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              loading={isPending}
              onClick={async () => {
                const hash = await approve();
                setApproveHash(hash);
              }}
            >
              1) Approve tokenIn
            </Button>
            <Button
              loading={isPending}
              disabled={approveReceipt.data?.status !== "success"}
              onClick={async () => {
                const hash = await swap();
                setSwapHash(hash);
              }}
            >
              2) Swap
            </Button>
          </div>
          {approveHash ? (
            <p className="mt-2 text-xs text-zinc-400">
              Approve tx: <TxHashLink hash={approveHash} />
            </p>
          ) : null}
          {swapHash ? (
            <p className="mt-2 text-xs text-zinc-400">
              Swap tx: <TxHashLink hash={swapHash} />
            </p>
          ) : null}
          {swapReceipt.data?.status === "success" ? <p className="mt-2 text-xs text-emerald-400">Swap confirmed on-chain.</p> : null}
        </Card>
      </RequireSiweAuth>
    </div>
  );
}
