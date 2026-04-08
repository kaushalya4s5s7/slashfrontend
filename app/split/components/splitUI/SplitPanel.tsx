"use client";

import { useState } from "react";
import { useWaitForTransactionReceipt } from "wagmi";
import { Card } from "@/shared/components/ui/Card";
import { Tabs } from "@/shared/components/ui/Tabs";
import { Input } from "@/shared/components/ui/Input";
import { Button } from "@/shared/components/ui/Button";
import { Badge } from "@/shared/components/ui/Badge";
import { useSplit } from "@/app/split/components/splitService/useSplit";
import { Mode } from "@/shared/types/contracts";
import { RequireSiweAuth } from "@/shared/components/RequireSiweAuth";
import { TxHashLink } from "@/shared/components/ui/TxHashLink";
import { useSplitMode } from "@/app/split/hooks/useSplitMode";

export function SplitPanel() {
  const { mode, setMode } = useSplitMode("DELEGATION");
  const [amount, setAmount] = useState("0.005");
  const [approveHash, setApproveHash] = useState<`0x${string}` | undefined>();
  const [splitHash, setSplitHash] = useState<`0x${string}` | undefined>();

  const { approve, split, isPending } = useSplit(mode, amount);
  const approveReceipt = useWaitForTransactionReceipt({ hash: approveHash, query: { enabled: Boolean(approveHash) } });
  const splitReceipt = useWaitForTransactionReceipt({ hash: splitHash, query: { enabled: Boolean(splitHash) } });

  const canSplit = approveReceipt.data?.status === "success";

  return (
    <div className="grid gap-4">
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Split slashXTZ into PT + YT</h2>
          <Badge mode={mode} />
        </div>

        <Tabs
          value={mode}
          onChange={(next) => setMode(next as Mode)}
          tabs={[
            { value: "DELEGATION", label: "slashDXTZ" },
            { value: "STAKING", label: "slashSXTZ" },
          ]}
        />

        <div className="mt-4 grid gap-3">
          <Input
            label="Amount"
            suffix={mode === "DELEGATION" ? "slashDXTZ" : "slashSXTZ"}
            type="number"
            min="0"
            step="0.001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <p className="text-xs text-zinc-500">Preview: receive ≈ {amount || "0"} PT + {amount || "0"} YT</p>
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
              1) Approve
            </Button>
            <Button
              loading={isPending}
              disabled={!canSplit}
              onClick={async () => {
                const hash = await split();
                setSplitHash(hash);
              }}
            >
              2) Split
            </Button>
          </div>
          {approveHash ? (
            <p className="mt-2 text-xs text-zinc-400">
              Approve tx: <TxHashLink hash={approveHash} />
            </p>
          ) : null}
          {splitHash ? (
            <p className="mt-2 text-xs text-zinc-400">
              Split tx: <TxHashLink hash={splitHash} />
            </p>
          ) : null}
          {splitReceipt.data?.status === "success" ? <p className="mt-2 text-xs text-emerald-400">Split confirmed on-chain.</p> : null}
        </Card>
      </RequireSiweAuth>
    </div>
  );
}
