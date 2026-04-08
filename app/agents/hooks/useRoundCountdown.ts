"use client";

import { useEffect, useState } from "react";

export function useRoundCountdown(timeLeft?: bigint) {
  const [seconds, setSeconds] = useState<number>(Number(timeLeft ?? 0n));

  useEffect(() => {
    setSeconds(Number(timeLeft ?? 0n));
  }, [timeLeft]);

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return seconds;
}
