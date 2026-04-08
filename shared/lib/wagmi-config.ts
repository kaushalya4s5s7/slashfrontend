import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { etherlinkShadownet } from "@/shared/lib/chain";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_ID || "WALLETCONNECT_ID_REQUIRED";

export const wagmiConfig = getDefaultConfig({
  appName: "SlashMarket",
  projectId,
  chains: [etherlinkShadownet],
  transports: {
    [etherlinkShadownet.id]: http(),
  },
  ssr: false,
});
