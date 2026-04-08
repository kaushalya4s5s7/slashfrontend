"use client";

import { useState } from "react";
import { Mode } from "@/shared/types/contracts";
import { SwapDirection } from "@/app/swap/components/swapService/useSwap";

export function useSwapState() {
  const [mode, setMode] = useState<Mode>("DELEGATION");
  const [direction, setDirection] = useState<SwapDirection>("SY_TO_PT");
  const [amount, setAmount] = useState("0.001");

  return { mode, setMode, direction, setDirection, amount, setAmount };
}
