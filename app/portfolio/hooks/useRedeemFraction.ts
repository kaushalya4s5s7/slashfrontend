"use client";

export function getRedeemPortion(balance: bigint, numerator = 1n, denominator = 10n) {
  if (balance <= 0n) return 0n;
  const portion = (balance * numerator) / denominator;
  return portion > 0n ? portion : balance;
}
