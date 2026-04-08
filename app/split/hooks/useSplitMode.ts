"use client";

import { useState } from "react";
import { Mode } from "@/shared/types/contracts";

export function useSplitMode(defaultMode: Mode = "DELEGATION") {
  const [mode, setMode] = useState<Mode>(defaultMode);
  return { mode, setMode };
}
