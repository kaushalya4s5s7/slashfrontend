# SlashMarket Frontend — Natural UX Flow Plan (Docs + Contracts Aligned)

Date: 2026-04-08

## 1) Ground Truth from Contracts (must drive UX)

This plan is based on actual L2 contracts (not early mock API assumptions):

- Vault entry: `NativeBakerVault.deposit()` (payable XTZ)
- Vault exit: `NativeBakerVault.redeem(shares)`
- Split: `YieldSplitter.deposit(mode, amount)` after ERC20 approve
- Swap: `SlashMarketAMM.swapSYforPT(syIn,minPTOut)` and `swapPTforSY(ptIn,minSYOut)`
- Maturity redemption: `YieldSplitter.redeemPrincipal(mode, ptAmount)` + `redeemYield(mode, ytAmount)`
- Agent transparency: `AgentCompetition.getWinner(roundId)`, `getStrategy(roundId, agent)`, `timeLeftInRound()`
- Registry proofs: `AgentRegistry.getAgent()`, `verifyReason()`

Implication: UX must be lifecycle-based (Deposit → Split → Trade → Mature/Redeem), not just disconnected pages.

---

## 2) Product UX North Star

A first-time user should complete one meaningful on-chain action in under 90 seconds.

Natural journey:
1. Understand value in one screen.
2. Tap one CTA (`Get Started`) for connect + SIWE auth.
3. Pick strategy intent (Fixed / Variable / Passive).
4. Land on prefilled action form with safe defaults.
5. See tx stepper + confirmed state + “what next”.

---

## 2.1) Intelligent Automation Policy (important)

Goal: reduce clicks without hiding risk.

Rules:
- Safe read operations: always automatic.
- Multi-step write flows: orchestrated automatically in sequence, but each on-chain tx still requires wallet confirmation.
- High-risk operations (swap with price impact, redemption at maturity, any irreversible action): always explicit confirmation step.

Why this policy:
- `Deposit -> Split` is a natural pipeline and can be guided as one flow.
- But on EVM, `approve` and `deposit(mode,amount)` are separate signed txs unless a permit/meta-tx path exists.
- Therefore UX should be “one initiated flow, multiple explicit signatures”, not hidden transactions.

Initial automation to implement:
- After successful `vault.deposit()`, if user enables auto-flow:
  1) auto-trigger token `approve(SPLITTER, amount)`
  2) after confirmation, auto-trigger `YieldSplitter.deposit(mode, amount)`
  3) show progress + tx hashes + final success state

---

## 3) Primary User Intent Paths (instead of page-first flow)

## A. “I want yield exposure with minimal decisions”
- Start at Home → `Get Started` → `Deposit`
- Pick `Delegation` or `Staking`
- Deposit XTZ
- Post-success suggested next actions:
  - “Split into PT + YT”
  - “View Portfolio”

## B. “I want fixed return”
- Home → `Get Started` → quick intent chooser: **Lock Fixed Yield**
- Route to `Swap` with defaults:
  - mode preselected
  - direction `SY_TO_PT`
- Show implied APY and expected PT output before swap

## C. “I want leveraged variable yield”
- Home → intent chooser: **Long Variable Yield**
- Route to `Split` first (mint PT+YT), then suggest selling PT in `Swap`

## D. “I want to monitor AI decisions only”
- Home → `Agents` (read-only should stay open)
- Show round timer, latest winner, reason summary, reason hash verification status

---

## 4) Recommended Information Architecture

Keep current routes, but orchestrate them as one guided workflow:

- `/` Landing + single CTA + intent chips
- `/deposit` Step 1 (mint slashXTZ)
- `/split` Step 2 (mint PT/YT)
- `/swap` Step 3 (rebalance exposure)
- `/portfolio` Step 4 (positions + available actions)
- `/agents` Transparency (competition + reason proofs)

Add a small global progress indicator for authenticated users:
- `Deposit` → `Split` → `Trade` → `Track`

---

## 5) Page-by-Page UX Plan

## Home (`/`)
Current role is good. Improve with:
- Keep one auth CTA (`Get Started`)
- Add 3 intent buttons under hero:
  - Fixed Yield
  - Variable Yield
  - Passive Hold
- After auth success, auto-route by chosen intent.

## Deposit (`/deposit`)
Already close to correct.
Add:
- Wallet balance guard and “Max” button
- Expected received shares (from preview)
- Tx lifecycle panel: `Preparing → Wallet → Pending → Confirmed`
- Guided auto-flow toggle: `Auto-split after deposit`
- Post-success card with next-step CTA (`Split now`) when auto-flow is off

## Split (`/split`)
Keep 2-step Approve → Split, but make state resilient:
- If allowance already sufficient, skip Approve and unlock Split
- Show token balances and insufficient-balance errors inline
- On success, CTA to `Swap` or `Portfolio`

## Swap (`/swap`)
Highest UX risk today.
Upgrade:
- Replace `minOut = 0` with slippage control (0.1–1.0%)
- Show estimated output + price impact + fee
- If quote confidence is low, warn before signing
- Keep direction labels mapped to user intent:
  - `SY → PT` = lock fixed
  - `PT → SY` = go variable

## Portfolio (`/portfolio`)
Needs to become the lifecycle center:
- Current balances are good
- Add sections:
  - **Open positions** (slashXTZ/PT/YT by mode)
  - **Maturity actions** (`redeemPrincipal` / `redeemYield` when settled)
  - **Risk events** (staking accusation haircut if present)
- Keep vault share redeem, but label it as “Exit vault shares” to avoid confusion with maturity redemption

## Agents (`/agents`)
Current read model is good but incomplete.
Add:
- Delegation + Staking tabs (`COMP_D` and `COMP_S`)
- Winner reason summary + hash + “verified/unverified” badge via `verifyReason`
- Recent rounds table (not only last round)

---

## 6) Auth + Access Model

Use one-button auth funnel:
- Pre-auth UI: `Get Started`
- Action:
  1) Connect wallet (RainbowKit)
  2) SIWE sign
  3) Route to chosen intent
- Post-auth navbar: show RainbowKit connected address chip

Access policy:
- Reads should remain available without SIWE where possible
- Writes require SIWE (`RequireSiweAuth`) + right network (`NetworkGuard`)

---

## 7) UX Components to Add (shared)

- `TxStepperCard` (preparing, awaiting signature, pending, confirmed, failed)
- `ActionGuard` (checks: connected, SIWE, network, balance, allowance)
- `SlippageInput` + `MinReceivedPreview`
- `PostTxNextActions` (contextual CTA block)
- `RiskNotice` (staking haircut, maturity timing, oracle freshness)

---

## 8) Contract-Driven UX Warnings (important)

- `YieldSplitter.deposit` uses `mode:uint8`; UI must avoid mode/address mismatch.
- `AMM` has no generic `swap()` or built-in quote fn; quote UX must come from reserve math/simulation.
- `Swap` should never default to `minOut=0` in production UX.
- `redeemPrincipal/redeemYield` should only appear once settlement is available.

---

## 9) Implementation Priority (practical)

Phase 1 (fast, high impact)
1. Intent-based onboarding from Home
2. Transaction stepper + post-success next actions
3. Allowance-aware split/swap buttons
4. Slippage + minOut controls

Phase 2 (full lifecycle)
1. Portfolio maturity redemption center
2. Agents dual-mode dashboard + reason verification
3. Better risk/explainer tooltips

Phase 3 (power users)
1. LP add/remove panel for AMMs
2. Advanced analytics (historical implied APY, pnl decomposition)
3. One-click strategy presets

---

## 10) Success Criteria

- First-time user can complete Deposit in < 90 sec.
- 80%+ users who deposit click at least one guided next action.
- Failed tx rate reduced via guards/slippage controls.
- Users can understand AI winner rationale from one Agents screen.

---

## 11) Current App Status vs Plan (delta)

Already good:
- Core wiring to real contracts exists
- Single CTA auth pattern exists
- Basic deposit/split/swap/portfolio/agents routes exist

Needs improvement now:
- Intent orchestration across pages
- Safe swap UX (slippage/minOut)
- Maturity redemption UX in portfolio
- Dual-mode (delegation + staking) agents visibility
