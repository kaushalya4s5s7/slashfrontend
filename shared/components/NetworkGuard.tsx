"use client";

import { useEtherlinkChain } from "@/shared/hooks/useEtherlinkChain";
import { Card } from "@/shared/components/ui/Card";

export function NetworkGuard({ children }: { children: React.ReactNode }) {
  const { isEtherlinkShadownet, expectedChainId, chainId } = useEtherlinkChain();

  if (!isEtherlinkShadownet) {
    return (
      <Card>
        <p className="text-sm text-amber-300">
          Wrong network. Switch wallet chain to Etherlink Shadownet (chainId {expectedChainId}). Current: {chainId || "unknown"}.
        </p>
      </Card>
    );
  }

  return <>{children}</>;
}
