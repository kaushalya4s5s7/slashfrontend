import { Mode } from "@/shared/types/contracts";

export type SwapDirection = "SY_TO_PT" | "PT_TO_SY";

export type SwapForm = {
  mode: Mode;
  direction: SwapDirection;
  amount: string;
};
