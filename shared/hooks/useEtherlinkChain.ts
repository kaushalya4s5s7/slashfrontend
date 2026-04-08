import { useChainId } from "wagmi";
import { etherlinkShadownet } from "@/shared/lib/chain";

export function useEtherlinkChain() {
  const chainId = useChainId();
  return {
    chainId,
    expectedChainId: etherlinkShadownet.id,
    isEtherlinkShadownet: chainId === etherlinkShadownet.id,
  };
}
