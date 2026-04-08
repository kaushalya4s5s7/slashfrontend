export const ERC20_ABI = [
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "allowance",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

export const VAULT_ABI = [
  {
    type: "function",
    name: "deposit",
    stateMutability: "payable",
    inputs: [],
    outputs: [{ name: "shares", type: "uint256" }],
  },
  {
    type: "function",
    name: "redeem",
    stateMutability: "nonpayable",
    inputs: [{ name: "shares", type: "uint256" }],
    outputs: [{ name: "xtzOut", type: "uint256" }],
  },
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "totalAssets",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

export const SPLITTER_ABI = [
  {
    type: "function",
    name: "deposit",
    stateMutability: "nonpayable",
    inputs: [
      { name: "mode", type: "uint8" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "syncYieldIndex",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  {
    type: "function",
    name: "delegationImpliedAPY",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "stakingImpliedAPY",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

export const AMM_ABI = [
  {
    type: "function",
    name: "impliedRateBps",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "swapPTforSY",
    stateMutability: "nonpayable",
    inputs: [
      { name: "ptIn", type: "uint256" },
      { name: "minSYOut", type: "uint256" },
    ],
    outputs: [{ name: "syOut", type: "uint256" }],
  },
  {
    type: "function",
    name: "swapSYforPT",
    stateMutability: "nonpayable",
    inputs: [
      { name: "syIn", type: "uint256" },
      { name: "minPTOut", type: "uint256" },
    ],
    outputs: [{ name: "ptOut", type: "uint256" }],
  },
  {
    type: "function",
    name: "feeRateBps",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "ptReserve",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "syReserve",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

export const ORACLE_ABI = [
  {
    type: "function",
    name: "currentAPYBps",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "currentYieldIndex",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "lastUpdated",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

export const COMP_ABI = [
  {
    type: "function",
    name: "currentRoundId",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "timeLeftInRound",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "getWinner",
    stateMutability: "view",
    inputs: [{ name: "roundId", type: "uint256" }],
    outputs: [
      {
        type: "tuple",
        components: [
          { name: "roundId", type: "uint256" },
          { name: "winner", type: "address" },
          { name: "baker", type: "string" },
          { name: "predictedYieldBps", type: "uint256" },
          { name: "actualYieldBps", type: "uint256" },
          { name: "absError", type: "uint256" },
          { name: "reasonHash", type: "bytes32" },
          { name: "reasonSummary", type: "string" },
          { name: "reward", type: "uint256" },
          { name: "declaredAt", type: "uint256" },
        ],
      },
    ],
  },
] as const;

export const REGISTRY_ABI = [
  {
    type: "function",
    name: "agentCount",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "agentList",
    stateMutability: "view",
    inputs: [{ name: "index", type: "uint256" }],
    outputs: [{ name: "", type: "address" }],
  },
  {
    type: "function",
    name: "getAgent",
    stateMutability: "view",
    inputs: [{ name: "agent", type: "address" }],
    outputs: [
      {
        type: "tuple",
        components: [
          { name: "name", type: "string" },
          { name: "metadataURI", type: "string" },
          { name: "registeredAt", type: "uint256" },
          { name: "bond", type: "uint256" },
          { name: "delegationScore", type: "uint256" },
          { name: "stakingScore", type: "uint256" },
          { name: "complianceScore", type: "uint256" },
          { name: "totalProposals", type: "uint256" },
          { name: "proposalsWon", type: "uint256" },
          { name: "cumulativeError", type: "uint256" },
          { name: "violations", type: "uint256" },
          { name: "status", type: "uint8" },
          { name: "suspendedUntil", type: "uint256" },
        ],
      },
    ],
  },
] as const;
