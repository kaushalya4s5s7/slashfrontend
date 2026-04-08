"use client";

import { useExplorerLink } from "@/shared/hooks/useExplorerLink";

export function TxHashLink({ hash }: { hash?: `0x${string}` }) {
  const href = useExplorerLink(hash);
  if (!hash) return null;

  return (
    <a className="break-all text-xs text-cyan-300 underline-offset-2 hover:underline" href={href} target="_blank" rel="noreferrer">
      {hash}
    </a>
  );
}
