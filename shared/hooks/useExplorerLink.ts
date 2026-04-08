import { useMemo } from "react";
import { etherlinkShadownet } from "@/shared/lib/chain";

export function useExplorerLink(hashOrAddress?: string) {
  return useMemo(() => {
    if (!hashOrAddress) return "";
    const base = etherlinkShadownet.blockExplorers.default.url;
    const key = hashOrAddress.length === 42 ? "address" : "tx";
    return `${base}/${key}/${hashOrAddress}`;
  }, [hashOrAddress]);
}
