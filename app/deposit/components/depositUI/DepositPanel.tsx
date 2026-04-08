"use client";

import { useEffect, useMemo, useState } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
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
import { ADDRESSES } from "@/shared/hooks/useContractAddresses";
import { ERC20_ABI, SPLITTER_ABI } from "@/shared/lib/abis";

export function DepositPanel() {
  const { mode, setMode } = useDepositMode("DELEGATION");
  const [amount, setAmount] = useState("0.01");
  const [depositHash, setDepositHash] = useState<`0x${string}` | undefined>();
  const [approveHash, setApproveHash] = useState<`0x${string}` | undefined>();
  const [splitHash, setSplitHash] = useState<`0x${string}` | undefined>();
  const [autoSplitEnabled, setAutoSplitEnabled] = useState(true);
  const [flowMode, setFlowMode] = useState<Mode>("DELEGATION");
  const [flowAmount, setFlowAmount] = useState<bigint>(0n);
  const [autoFlowStarted, setAutoFlowStarted] = useState(false);
  const [flowStatus, setFlowStatus] = useState<string | null>(null);
  const [flowError, setFlowError] = useState<string | null>(null);

  const { apyBps, deposit, isPending, parsedAmount } = useDeposit(mode, amount);
  const { writeContractAsync, isPending: isAutoWritePending } = useWriteContract();

  const depositReceipt = useWaitForTransactionReceipt({ hash: depositHash, query: { enabled: Boolean(depositHash) } });
  const approveReceipt = useWaitForTransactionReceipt({ hash: approveHash, query: { enabled: Boolean(approveHash) } });
  const splitReceipt = useWaitForTransactionReceipt({ hash: splitHash, query: { enabled: Boolean(splitHash) } });

  const flowToken = useMemo(
    () => (flowMode === "DELEGATION" ? ADDRESSES.VAULT_D : ADDRESSES.VAULT_S),
    [flowMode]
  );
  const flowModeValue = flowMode === "DELEGATION" ? 0 : 1;

  const onDeposit = async () => {
    setFlowError(null);
    setFlowStatus(null);
    setApproveHash(undefined);
    setSplitHash(undefined);
    setAutoFlowStarted(false);
    setFlowMode(mode);
    setFlowAmount(parsedAmount);

    const tx = await deposit();
    setDepositHash(tx);
    setFlowStatus("Deposit submitted. Waiting for confirmation...");
  };

  useEffect(() => {
    const runApprove = async () => {
      if (!depositReceipt.data || depositReceipt.data.status !== "success") return;
      if (!autoSplitEnabled || autoFlowStarted || flowAmount <= 0n) return;

      try {
        setAutoFlowStarted(true);
        setFlowStatus("Deposit confirmed. Await wallet signature for split approval...");
        const tx = await writeContractAsync({
          address: flowToken,
          abi: ERC20_ABI,
          functionName: "approve",
          args: [ADDRESSES.SPLITTER, flowAmount],
        });
        setApproveHash(tx);
        setFlowStatus("Approval submitted. Waiting for confirmation...");
      } catch (err) {
        setFlowError(err instanceof Error ? err.message : "Auto split approval failed");
      }
    };

    runApprove();
  }, [
    autoFlowStarted,
    autoSplitEnabled,
    depositReceipt.data,
    flowAmount,
    flowToken,
    writeContractAsync,
  ]);

  useEffect(() => {
    const runSplit = async () => {
      if (!autoSplitEnabled || !autoFlowStarted) return;
      if (!approveReceipt.data || approveReceipt.data.status !== "success") return;
      if (splitHash) return;

      try {
        setFlowStatus("Approval confirmed. Await wallet signature for splitter deposit...");
        const tx = await writeContractAsync({
          address: ADDRESSES.SPLITTER,
          abi: SPLITTER_ABI,
          functionName: "deposit",
          args: [flowModeValue, flowAmount],
        });
        setSplitHash(tx);
        setFlowStatus("Split submitted. Waiting for confirmation...");
      } catch (err) {
        setFlowError(err instanceof Error ? err.message : "Auto split failed");
      }
    };

    runSplit();
  }, [
    approveReceipt.data,
    autoFlowStarted,
    autoSplitEnabled,
    flowAmount,
    flowModeValue,
    splitHash,
    writeContractAsync,
  ]);

  useEffect(() => {
    if (splitReceipt.data?.status === "success") {
      setFlowStatus("Deposit + split completed on-chain.");
    }
  }, [splitReceipt.data]);

  const isBusy = isPending || isAutoWritePending;

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
          <label className="mt-1 inline-flex items-center gap-2 text-xs text-zinc-300">
            <input
              type="checkbox"
              checked={autoSplitEnabled}
              onChange={(e) => setAutoSplitEnabled(e.target.checked)}
            />
            Auto-split after deposit (runs approve + splitter deposit with wallet prompts)
          </label>
        </div>
      </Card>

      <RequireSiweAuth>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Confirm deposit</p>
              <p className="text-xs text-zinc-400">Transaction executes `vault.deposit()` with native XTZ.</p>
            </div>
            <Button onClick={onDeposit} loading={isBusy}>
              Deposit
            </Button>
          </div>
          {depositHash ? (
            <p className="mt-3 text-xs text-zinc-400">
              Deposit tx: <TxHashLink hash={depositHash} />
            </p>
          ) : null}
          {approveHash ? (
            <p className="mt-1 text-xs text-zinc-400">
              Approve tx: <TxHashLink hash={approveHash} />
            </p>
          ) : null}
          {splitHash ? (
            <p className="mt-1 text-xs text-zinc-400">
              Split tx: <TxHashLink hash={splitHash} />
            </p>
          ) : null}

          {flowStatus ? <p className="mt-2 text-xs text-white-300">{flowStatus}</p> : null}
          {flowError ? <p className="mt-2 text-xs text-red-400">{flowError}</p> : null}

          {depositReceipt.data?.status === "success" && !autoSplitEnabled ? (
            <p className="mt-2 text-xs text-emerald-400">Deposit confirmed on-chain.</p>
          ) : null}
        </Card>
      </RequireSiweAuth>
    </div>
  );
}
