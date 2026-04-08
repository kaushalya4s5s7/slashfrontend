export type Mode = "DELEGATION" | "STAKING";

export type PoolMode = {
  mode: Mode;
  label: string;
};

export type WinnerDeclaration = {
  roundId: bigint;
  winner: `0x${string}`;
  baker: string;
  predictedYieldBps: bigint;
  actualYieldBps: bigint;
  absError: bigint;
  reasonHash: `0x${string}`;
  reasonSummary: string;
  reward: bigint;
  declaredAt: bigint;
};
