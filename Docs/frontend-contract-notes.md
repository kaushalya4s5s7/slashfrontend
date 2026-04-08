# Frontend Contract Notes (Actual L2 ABI)

This frontend uses the current deployed Solidity contracts from `contracts/l2/src`.

Key differences vs early mock API drafts:
- `YieldSplitter.deposit` is `deposit(uint8 mode, uint256 amount)`.
- `SlashMarketAMM` swap calls are `swapSYforPT` and `swapPTforSY` (no generic `swap`).
- Vault deposit is native payable `deposit()` with `msg.value`.
- Agent data is read from `AgentCompetition.getWinner` and `AgentRegistry.getAgent`.
