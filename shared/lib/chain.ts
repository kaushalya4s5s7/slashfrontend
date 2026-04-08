import { defineChain } from "viem";

export const etherlinkShadownet = defineChain({
  id: 127823,
  name: "Etherlink Shadownet",
  nativeCurrency: {
    name: "XTZ",
    symbol: "XTZ",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://node.shadownet.etherlink.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "Explorer",
      url: "https://explorer.shadownet.etherlink.com",
    },
  },
  testnet: true,
});
