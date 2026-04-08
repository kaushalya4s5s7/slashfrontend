import { formatUnits } from "viem";

export function formatToken(value: bigint | undefined, decimals = 18, precision = 6) {
  if (value === undefined) return "-";
  const num = Number(formatUnits(value, decimals));
  if (!Number.isFinite(num)) return "-";
  return num.toFixed(precision).replace(/\.0+$/, "").replace(/(\.\d+?)0+$/, "$1");
}

export function formatBps(value: bigint | undefined) {
  if (value === undefined) return "-";
  return `${(Number(value) / 100).toFixed(2)}%`;
}

export function shorten(addr: string | undefined) {
  if (!addr) return "-";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}
