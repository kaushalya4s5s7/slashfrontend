"use client";

import { useState } from "react";
import { useWaitForTransactionReceipt } from "wagmi";
import { Card } from "@/shared/components/ui/Card";
import { Tabs } from "@/shared/components/ui/Tabs";
import { Input } from "@/shared/components/ui/Input";
import { Button } from "@/shared/components/ui/Button";
import { Badge } from "@/shared/components/ui/Badge";
import { useDeposit } from "@/app/deposit/components/depositService/useDeposit";
import { Mode } from "@/shared/types/contracts";
import { formatBps } from "@/shared/utils/format";
import { RequireSiweAuth } from "@/shared/components/RequireSiweAuth";
import { TxHashLink } from "@/shared/components/ui/TxHashLink";
import { useDepositMode } from "@/app/deposit/hooks/useDepositMode";

export function DepositPanel() {
  const { mode, setMode } = useDepositMode("DELEGATION");
  const [amount, setAmount] = useState("0.01");
  const [hash, setHash] = useState<`0x${string}` | undefined>();
  const { apyBps, deposit, isPending } = useDeposit(mode, amount);
  const receipt = useWaitForTransactionReceipt({ hash, query: { enabled: Boolean(hash) } });

  const onDeposit = async () => {
    const tx = await deposit();
    setHash(tx);
  };

  return (
    <div className="grid gap-4">
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Deposit XTZ</h2>
          <Badge mode={mode} />
        </div>
        <p className="mb-4 text-sm text-zinc-400">Select vault mode and deposit native XTZ to mint slashXTZ shares.</p>

        <Tabs
          value={mode}
          onChange={(next) => setMode(next as Mode)}
          tabs={[
            { value: "DELEGATION", label: "Delegation (~6%)" },
            { value: "STAKING", label: "Staking (~18%)" },
          ]}
        />

        <div className="mt-4 grid gap-3">
          <Input
            label="Amount"
            suffix="XTZ"
            type="number"
            min="0"
            step="0.001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <p className="text-xs text-zinc-400">Current oracle APY: {formatBps(apyBps)}</p>
          <p className="text-xs text-zinc-500">Preview: you receive ≈ {amount || "0"} {mode === "DELEGATION" ? "slashDXTZ" : "slashSXTZ"}</p>
        </div>
      </Card>

      <RequireSiweAuth>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Confirm deposit</p>
              <p className="text-xs text-zinc-400">Transaction executes `vault.deposit()` with native XTZ.</p>
            </div>
            <Button onClick={onDeposit} loading={isPending}>
              Deposit
            </Button>
          </div>
          {hash ? (
            <p className="mt-3 text-xs text-zinc-400">
              Tx: <TxHashLink hash={hash} />
            </p>
          ) : null}
          {receipt.data?.status === "success" ? <p className="mt-2 text-xs text-emerald-400">Confirmed on-chain.</p> : null}
        </Card>
      </RequireSiweAuth>
    </div>
  );
}
