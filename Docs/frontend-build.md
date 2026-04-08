# SlashMarket Frontend — Build Specification

## Why this doc exists

The frontend is a Next.js 16 App Router app (TailwindCSS v4, React 19, TypeScript strict). This document defines what to build, in what order, and exactly how each page connects to the deployed contracts on Etherlink Shadownet (chainId 127823).

---

## Deployed Contracts (Etherlink Shadownet — chainId 127823)

```
RPC:        https://node.shadownet.etherlink.com
Explorer:   https://explorer.shadownet.etherlink.com

# Tokens
VAULT_D     = 0x050098C082Ef99DdB09c03c0e1547CfeA4BBCcB9   // slashDXTZ (delegation vault)
VAULT_S     = 0x9F5B8F20751317B18d914D215633Da4e4C83D2C6   // slashSXTZ (staking vault)

# PT/YT — minted by YieldSplitter
PT_D        = 0x94893714e6e50bcf354ab2a6db1d9b14778cf086   // PT-slashDXTZ
YT_D        = 0x6482a0c93df981330602909bc89bae08b87c1823   // YT-slashDXTZ
PT_S        = 0x922e9707a1943ce2ef0c5f8d88bc17820781fecc   // PT-slashSXTZ
YT_S        = 0x09c950707ec81be8c44a7bab63b2fa1dc8976062   // YT-slashSXTZ

# Protocol
SPLITTER    = 0x06CF2F2dF0748D4CBA9B751bBDbadFB88d0e14B4   // YieldSplitter
AMM_D       = 0x49b053EbF4594c52E6f0Aa23E01387F1905047C2   // Pool: PT-slashDXTZ/slashDXTZ
AMM_S       = 0xfF9D6C4268498598c37Ecc4807914D31958Fb3a7   // Pool: PT-slashSXTZ/slashSXTZ

# Oracle + Agents
ORACLE_D    = 0x36e7e1c0E6f529e991F0928B9e5Bbfc68FE8235E   // YieldOracle (delegation)
ORACLE_S    = 0x19696E129286b1b2ad636472a224acF70D42d1B6   // YieldOracle (staking)
COMP_D      = 0x8D1580D0F2FcA1aCf8C8EC76c53cF091B3d5194c   // AgentCompetition (delegation)
COMP_S      = 0xfFb4649998E9A12c32C2858F0dC9598F6A14288c   // AgentCompetition (staking)
REGISTRY    = 0x5764774c9Cd2eC1971249D709A861585aEEE61B0   // AgentRegistry
```

---

## Package Installs (run once)

```bash
pnpm add wagmi viem @tanstack/react-query
pnpm add @rainbow-me/rainbowkit
```

**Why wagmi/viem:** typed contract calls, wallet abstraction, React hooks for on-chain reads. No need to hand-roll ethers.js in the browser.

---

## Directory Structure (feature-first per frontend-DIR.md)

```
app/
  layout.tsx                  ← root layout: wallet provider, query client
  page.tsx                    ← redirect to /deposit

  deposit/
    page.tsx                  ← entry
    components/
      depositUI/              ← form, mode toggle, amount input, confirm button
      depositService/         ← useDeposit hook (calls vault.deposit)
    hooks/
    context/
    context.md

  split/
    page.tsx
    components/
      splitUI/                ← input slashXTZ amount → PT + YT output preview
      splitService/           ← useSplit hook (calls splitter.deposit)
    context.md

  swap/
    page.tsx
    components/
      swapUI/                 ← token pair selector, amount in/out, slippage
      swapService/            ← useSwap hook (calls amm.swap)
    context.md

  portfolio/
    page.tsx
    components/
      portfolioUI/            ← balances: slashDXTZ, slashSXTZ, PT-D, YT-D, PT-S, YT-S
      portfolioService/       ← usePortfolio hook (multicall reads)
    context.md

  agents/
    page.tsx
    components/
      agentsUI/               ← leaderboard table: agent, score, last baker, round
      agentsService/          ← useAgents hook (reads AgentCompetition + AgentRegistry)
    context.md

shared/
  components/
    ui/                       ← Button, Input, Card, Badge, Tabs, Spinner
  hooks/
    useContractAddresses.ts   ← exports all addresses as typed const
    useEtherlinkChain.ts      ← chain definition for wagmi
  lib/
    abis.ts                   ← minimal ABIs for each contract
    chain.ts                  ← Etherlink Shadownet chain config
  types/
    contracts.ts
```

---

## Step 1 — Chain + Provider Setup

### `shared/lib/chain.ts`

```ts
import { defineChain } from 'viem'

export const etherlinkShadownet = defineChain({
  id: 127823,
  name: 'Etherlink Shadownet',
  nativeCurrency: { name: 'XTZ', symbol: 'XTZ', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://node.shadownet.etherlink.com'] },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://explorer.shadownet.etherlink.com' },
  },
})
```

### `shared/lib/abis.ts`

Keep ABIs minimal — only the functions the UI calls.

```ts
// NativeBakerVault (VAULT_D / VAULT_S)
export const VAULT_ABI = [
  'function deposit() external payable returns (uint256 shares)',
  'function redeem(uint256 shares) external returns (uint256 xtzOut)',
  'function balanceOf(address) view returns (uint256)',
  'function totalSupply() view returns (uint256)',
  'function mode() view returns (string)',
] as const

// YieldSplitter
export const SPLITTER_ABI = [
  'function deposit(address vault, uint256 amount) external returns (uint256 pt, uint256 yt)',
  'function redeem(address vault, uint256 ptAmount) external returns (uint256)',
] as const

// SlashMarketAMM
export const AMM_ABI = [
  'function swap(address tokenIn, uint256 amountIn, uint256 minAmountOut) external returns (uint256)',
  'function getAmountOut(address tokenIn, uint256 amountIn) view returns (uint256)',
  'function impliedRate() view returns (uint256)',
] as const

// YieldOracle
export const ORACLE_ABI = [
  'function currentAPYBps() view returns (uint256)',
  'function currentYieldIndex() view returns (uint256)',
  'function lastUpdated() view returns (uint256)',
] as const

// AgentCompetition
export const COMP_ABI = [
  'function currentRoundId() view returns (uint256)',
  'function timeLeftInRound() view returns (uint256)',
  'function getWinner(uint256 roundId) view returns (tuple(uint256 roundId, address winner, string baker, uint256 predictedYieldBps, uint256 actualYieldBps, uint256 absError, bytes32 reasonHash, string reasonSummary, uint256 reward, uint256 declaredAt))',
  'function getStrategy(uint256 roundId, address agent) view returns (tuple(string baker, uint256 predictedUptime, uint256 predictedFee, uint256 accusationRisk, uint256 predictedYieldBps, bytes32 reasonHash, string reasonSummary, bool submitted))',
] as const

// AgentRegistry
export const REGISTRY_ABI = [
  'function getAgent(address) view returns (tuple(string name, string metadataURI, uint256 registeredAt, uint256 bond, uint256 delegationScore, uint256 stakingScore, uint256 complianceScore, uint256 totalProposals, uint256 proposalsWon, uint256 cumulativeError, uint256 violations, uint8 status, uint256 suspendedUntil))',
  'function isRegistered(address) view returns (bool)',
  'function MIN_BOND() view returns (uint256)',
] as const
```

### `shared/hooks/useContractAddresses.ts`

```ts
export const ADDRESSES = {
  VAULT_D:  '0x050098C082Ef99DdB09c03c0e1547CfeA4BBCcB9',
  VAULT_S:  '0x9F5B8F20751317B18d914D215633Da4e4C83D2C6',
  PT_D:     '0x94893714e6e50bcf354ab2a6db1d9b14778cf086',
  YT_D:     '0x6482a0c93df981330602909bc89bae08b87c1823',
  PT_S:     '0x922e9707a1943ce2ef0c5f8d88bc17820781fecc',
  YT_S:     '0x09c950707ec81be8c44a7bab63b2fa1dc8976062',
  SPLITTER: '0x06CF2F2dF0748D4CBA9B751bBDbadFB88d0e14B4',
  AMM_D:    '0x49b053EbF4594c52E6f0Aa23E01387F1905047C2',
  AMM_S:    '0xfF9D6C4268498598c37Ecc4807914D31958Fb3a7',
  ORACLE_D: '0x36e7e1c0E6f529e991F0928B9e5Bbfc68FE8235E',
  ORACLE_S: '0x19696E129286b1b2ad636472a224acF70D42d1B6',
  COMP_D:   '0x8D1580D0F2FcA1aCf8C8EC76c53cF091B3d5194c',
  COMP_S:   '0xfFb4649998E9A12c32C2858F0dC9598F6A14288c',
  REGISTRY: '0x5764774c9Cd2eC1971249D709A861585aEEE61B0',
} as const
```

### `app/layout.tsx` (root layout — providers)

```tsx
'use client'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit'
import { etherlinkShadownet } from '@/shared/lib/chain'
import '@rainbow-me/rainbowkit/styles.css'
import './globals.css'

const config = getDefaultConfig({
  appName: 'SlashMarket',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID!,
  chains: [etherlinkShadownet],
  transports: { [etherlinkShadownet.id]: http() },
})

const queryClient = new QueryClient()

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
              {children}
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  )
}
```

**WalletConnect project ID:** get free one at cloud.walletconnect.com → add to `.env.local` as `NEXT_PUBLIC_WALLETCONNECT_ID`.

---

## Step 2 — Deposit Page

**User flow:** Connect wallet → pick mode (Delegation / Staking) → enter XTZ amount → deposit → receive slashDXTZ or slashSXTZ

### Contract call

```ts
// NativeBakerVault.deposit() is payable — send XTZ as msg.value
// No approve needed — this is native XTZ, not ERC-20
import { useWriteContract, useSimulateContract } from 'wagmi'
import { parseEther } from 'viem'
import { VAULT_ABI } from '@/shared/lib/abis'
import { ADDRESSES } from '@/shared/hooks/useContractAddresses'

// mode = 'DELEGATION' | 'STAKING'
const vault = mode === 'DELEGATION' ? ADDRESSES.VAULT_D : ADDRESSES.VAULT_S

const { data } = useSimulateContract({
  address: vault,
  abi: VAULT_ABI,
  functionName: 'deposit',
  value: parseEther(amount),    // XTZ amount the user typed
})

const { writeContract } = useWriteContract()
// on button click: writeContract(data!.request)
```

**What the UI shows:**
- Mode toggle: `Delegation (~6% APY)` | `Staking (~18% APY, 4d lock)`
- Amount input in XTZ
- Preview: `You receive ≈ {amount} slashDXTZ` (1:1 on first deposit)
- Current oracle APY: read from `ORACLE_D.currentAPYBps()` → divide by 100 → show as `%`
- Connect Wallet button (RainbowKit `<ConnectButton />`)

---

## Step 3 — Split Page

**User flow:** User holds slashDXTZ/slashSXTZ → approve splitter → deposit to YieldSplitter → receive equal PT + YT

### Contract calls

```ts
// Step 1: ERC-20 approve (slashDXTZ → SPLITTER)
import { useWriteContract } from 'wagmi'

// approve
writeContract({
  address: vault,           // slashDXTZ or slashSXTZ address
  abi: ERC20_ABI,           // standard ERC20 approve
  functionName: 'approve',
  args: [ADDRESSES.SPLITTER, amount],
})

// Step 2: YieldSplitter.deposit(vault, amount)
writeContract({
  address: ADDRESSES.SPLITTER,
  abi: SPLITTER_ABI,
  functionName: 'deposit',
  args: [vault, amount],
})
```

**What the UI shows:**
- Token selector: slashDXTZ | slashSXTZ
- Amount input
- Preview: `You receive {amount} PT + {amount} YT` (1:1 split)
- Two-step UI: Approve → Split (disable Split until approve confirmed)

---

## Step 4 — Swap Page (AMM)

**User flow:** Select pool (Delegation / Staking) → pick direction (PT→slashXTZ or slashXTZ→PT) → enter amount → get quote → swap

### Contract calls

```ts
// Read quote first
const { data: amountOut } = useReadContract({
  address: amm,         // AMM_D or AMM_S
  abi: AMM_ABI,
  functionName: 'getAmountOut',
  args: [tokenIn, amountIn],
})

// Read implied rate (implied fixed APY)
const { data: impliedRateBps } = useReadContract({
  address: amm,
  abi: AMM_ABI,
  functionName: 'impliedRate',
})

// Execute swap with 0.5% slippage
const minOut = amountOut * 995n / 1000n
writeContract({
  address: amm,
  abi: AMM_ABI,
  functionName: 'swap',
  args: [tokenIn, amountIn, minOut],
})
```

**What the UI shows:**
- Pool selector: Delegation Pool | Staking Pool
- Direction toggle: Buy PT (fix your yield) | Sell PT (go variable)
- Amount in → Amount out (live quote, debounced 500ms)
- Implied APY: `{impliedRateBps / 100}%` — tells users the fixed rate they lock in
- Slippage: default 0.5%

---

## Step 5 — Portfolio Page

**User flow:** View all token balances in one place.

### Contract calls (read-only, no transactions)

```ts
import { useReadContracts } from 'wagmi'

const { data } = useReadContracts({
  contracts: [
    { address: ADDRESSES.VAULT_D, abi: VAULT_ABI, functionName: 'balanceOf', args: [address] },
    { address: ADDRESSES.VAULT_S, abi: VAULT_ABI, functionName: 'balanceOf', args: [address] },
    { address: ADDRESSES.PT_D, abi: ERC20_ABI, functionName: 'balanceOf', args: [address] },
    { address: ADDRESSES.YT_D, abi: ERC20_ABI, functionName: 'balanceOf', args: [address] },
    { address: ADDRESSES.PT_S, abi: ERC20_ABI, functionName: 'balanceOf', args: [address] },
    { address: ADDRESSES.YT_S, abi: ERC20_ABI, functionName: 'balanceOf', args: [address] },
  ],
})
```

**What the UI shows:**
- Card per token: name, balance, mode badge
- Delegation group: slashDXTZ | PT-slashDXTZ | YT-slashDXTZ
- Staking group: slashSXTZ | PT-slashSXTZ | YT-slashSXTZ
- Redeem button per vault (calls `vault.redeem(shares)`)

---

## Step 6 — Agents Page (leaderboard)

**User flow:** Read-only. See which agents competed, who won last round, current APY.

### Contract calls

```ts
// Current round state
const { data: roundId } = useReadContract({ address: COMP_D, abi: COMP_ABI, functionName: 'currentRoundId' })
const { data: timeLeft } = useReadContract({ address: COMP_D, abi: COMP_ABI, functionName: 'timeLeftInRound' })

// Oracle APY
const { data: apyBps } = useReadContract({ address: ORACLE_D, abi: ORACLE_ABI, functionName: 'currentAPYBps' })

// Winner of last round
const { data: winner } = useReadContract({
  address: COMP_D, abi: COMP_ABI,
  functionName: 'getWinner',
  args: [roundId - 1n],
})
```

**What the UI shows:**
- Current oracle APY: `{apyBps / 100}%`
- Round timer: countdown from `timeLeft`
- Last winner card: agent address, baker picked, predicted vs actual yield, error margin
- No write transactions — purely informational

---

## Minimal UI Design Principles

**Palette:** Zinc scale (gray-900 bg, zinc-100 text, white cards). One accent: `#00C2FF` (Tezos blue).

**Components to build in `shared/components/ui/`:**

| Component | Usage |
|---|---|
| `Button` | primary (filled), secondary (outline), loading state |
| `Input` | number input with token label on right |
| `Card` | white bg, rounded-xl, shadow-sm |
| `Badge` | `DELEGATION` (blue) / `STAKING` (purple) |
| `Tabs` | Delegation | Staking mode switcher |
| `Spinner` | tx pending state |

**Nav:** Simple horizontal bar. Links: Deposit | Split | Swap | Portfolio | Agents. `<ConnectButton />` on right.

**No animations, no gradients, no charts.** Just data + actions. Minimal.

---

## Build Order

1. Install packages (`wagmi`, `viem`, `@tanstack/react-query`, `rainbowkit`)
2. `shared/lib/chain.ts` + `shared/lib/abis.ts` + `shared/hooks/useContractAddresses.ts`
3. `app/layout.tsx` — wallet providers
4. `shared/components/ui/` — Button, Input, Card, Badge, Tabs, Spinner
5. Shared Nav component
6. **Deposit page** — first functional page (simplest: payable call, no approve)
7. **Portfolio page** — pure reads, verify data is coming through
8. **Split page** — introduces approve flow
9. **Swap page** — AMM quote + swap
10. **Agents page** — read-only leaderboard

Each step must run in dev (`pnpm dev`) before moving to the next.

---

## Environment Variables (`.env.local`)

```
NEXT_PUBLIC_WALLETCONNECT_ID=your_walletconnect_project_id
```

All contract addresses are hardcoded in `shared/hooks/useContractAddresses.ts` — no need for env vars for addresses since this targets one fixed network.
