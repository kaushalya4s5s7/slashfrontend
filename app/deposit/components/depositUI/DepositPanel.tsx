"use client";

import { useEffect, useMemo, useState } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { Tabs } from "@/shared/components/ui/Tabs";
import { Button } from "@/shared/components/ui/Button";
import { Badge } from "@/shared/components/ui/Badge";
import { useDeposit } from "@/app/deposit/components/depositService/useDeposit";
import { Mode } from "@/shared/types/contracts";
import { formatBps } from "@/shared/utils/format";
import { RequireSiweAuth } from "@/shared/components/RequireSiweAuth";
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
    <div className="mx-auto w-full max-w-2xl">
      <div className="rounded-[2rem] border border-zinc-800/80 bg-zinc-900/60 p-5 shadow-[0_30px_80px_-35px_rgba(0,0,0,0.95)] backdrop-blur-xl sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-zinc-100">Deposit native XTZ</h2>
            <p className="font-urbanist mt-1 text-sm text-zinc-400">Mint slashXTZ shares in delegation or staking mode.</p>
          </div>
          <Badge mode={mode} />
        </div>

        <Tabs
          value={mode}
          onChange={(next) => setMode(next as Mode)}
          tabs={[
            { value: "DELEGATION", label: "Delegation" },
            { value: "STAKING", label: "Staking" },
          ]}
        />

        <div className="mt-5 space-y-3">
          <div className="rounded-[1.6rem] border border-zinc-800/80 bg-zinc-950/85 p-5">
            <p className="font-urbanist mb-3 text-xs uppercase tracking-[0.16em] text-zinc-500">Deposit</p>
            <div className="flex items-end justify-between gap-3">
              <input
                className="w-full bg-transparent text-4xl leading-none text-zinc-200 outline-none placeholder:text-zinc-600 sm:text-5xl"
                type="number"
                min="0"
                step="0.001"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
              />
              <span className="rounded-full border border-zinc-700/80 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-200">XTZ</span>
            </div>
          </div>

          <div className="grid gap-2 rounded-[1.4rem] border border-zinc-800/80 bg-zinc-900/65 p-4 text-sm text-zinc-300 sm:grid-cols-2">
            <p>Oracle APY: <span className="text-zinc-100">{formatBps(apyBps)}</span></p>
            <p>Preview minted: <span className="text-zinc-100">≈ {amount || "0"} {mode === "DELEGATION" ? "slashDXTZ" : "slashSXTZ"}</span></p>
          </div>

          <label className="font-urbanist inline-flex items-center gap-2 text-xs text-zinc-300">
            <input
              type="checkbox"
              checked={autoSplitEnabled}
              onChange={(e) => setAutoSplitEnabled(e.target.checked)}
            />
            Auto-split after deposit (approve + splitter flow)
          </label>
        </div>

        <RequireSiweAuth>
          <div className="mt-5 space-y-2">
            <Button onClick={onDeposit} loading={isBusy} className="h-12 w-full text-base font-semibold text-zinc-950">
            Deposit
            </Button>
            {flowStatus ? <p className="font-urbanist text-xs text-zinc-400">{flowStatus}</p> : null}
            {flowError ? <p className="font-urbanist text-xs text-red-400">{flowError}</p> : null}
            {depositReceipt.data?.status === "success" && !autoSplitEnabled ? (
              <p className="font-urbanist text-xs text-emerald-400">Deposit confirmed.</p>
            ) : null}
          </div>
        </RequireSiweAuth>
      </div>
    </div>
  );
}
