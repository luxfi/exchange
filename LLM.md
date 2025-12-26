# AI Assistant Knowledge Base

**Last Updated**: 2025-12-25
**Project**: Lux Exchange Monorepo
**Organization**: luxfi

## Project Overview

Lux Exchange is a full-featured, cross-chain DEX for the Lux Network ecosystem. It combines:
- **Standard AMM Contracts** (`~/work/lux/standard`) - V2/V3 pools deployed on Lux chains
- **DEX Precompiles** (0x0400-0x0403) - Native Uniswap v4-style pools for sub-microsecond execution
- **Omni-chain Routing** - Cross-chain swaps via Warp/Teleport
- **Modern Frontend** - Tamagui + Zustand (Uniswap interface patterns)

## Technology Stack

- **Framework**: Next.js 15.5 (App Router) with Nx monorepo
- **React**: 19.x
- **Web3**: wagmi v3, viem
- **UI**: Tamagui (cross-platform) + Tailwind CSS (web)
- **State**: Zustand stores
- **Data**: React Query
- **Testing**: Playwright (e2e), Vitest (unit)
- **Package Manager**: pnpm workspaces

## Monorepo Structure

```
/Users/z/work/lux/exchange/
├── apps/
│   └── web/                    # Next.js 15 web app
│       ├── app/                # App Router pages
│       ├── components/         # React components
│       ├── lib/                # Utilities
│       ├── e2e/                # Playwright tests
│       └── public/             # Static assets
│
├── packages/
│   ├── config/                 # Shared configuration
│   │   └── src/
│   │       ├── chains.ts       # Chain definitions (Lux, Zoo)
│   │       ├── contracts.ts    # Contract addresses (V2, V3, Precompiles)
│   │       ├── wagmi.ts        # Wagmi config
│   │       └── env.ts          # Environment config
│   │
│   ├── exchange/               # Core DEX logic
│   │   └── src/
│   │       ├── chains/         # Chain re-exports
│   │       ├── tokens/         # Token definitions
│   │       ├── contracts/      # ABIs (V2, V3, precompiles)
│   │       ├── dex/            # DEX types (PoolKey, BalanceDelta)
│   │       ├── hooks/          # React hooks (useSwap, usePools, etc.)
│   │       └── stores/         # Zustand stores
│   │
│   ├── ui/                     # Tamagui UI components
│   │   └── src/
│   │       ├── theme/          # Design tokens, themes
│   │       └── components/     # Button, Card, TokenLogo, etc.
│   │
│   └── api/                    # Data fetching
│       └── src/
│           ├── client.ts       # React Query client
│           └── hooks/          # useTokenList, useTokenPrice
│
├── package.json                # Workspace root
├── pnpm-workspace.yaml         # pnpm workspaces config
└── nx.json                     # Nx build orchestration
```

## Essential Commands

```bash
# Development
pnpm dev                    # Start web app dev server
pnpm build                  # Build all packages

# Testing
pnpm test                   # Run all tests
pnpm test:e2e               # Playwright e2e tests

# Package-specific
pnpm nx run @luxfi/config:typecheck
pnpm nx run @luxfi/exchange:typecheck
pnpm nx run @luxfi/web:dev
```

## Supported Chains

| Chain | Chain ID | RPC |
|-------|----------|-----|
| Lux Mainnet | 96369 | https://api.lux.network/rpc |
| Lux Testnet | 96368 | https://api.lux-test.network/rpc |
| Zoo Mainnet | 200200 | https://api.zoo.network/rpc |
| Zoo Testnet | 200201 | https://api.zoo-test.network/rpc |

## Contract Addresses

### AMM V2 (QuantumSwap) - Lux Mainnet
| Contract | Address |
|----------|---------|
| V2Factory | `0xd9a95609DbB228A13568Bd9f9A285105E7596970` |
| V2Router | `0x1F6cbC7d3bc7D803ee76D80F0eEE25767431e674` |

### AMM V3 (Concentrated Liquidity) - Lux Mainnet
| Contract | Address |
|----------|---------|
| V3Factory | `0xb732BD88F25EdD9C3456638671fB37685D4B4e3f` |
| SwapRouter | `0xE8fb25086C8652c92f5AF90D730Bac7C63Fc9A58` |
| QuoterV2 | `0x15C729fdd833Ba675edd466Dfc63E1B737925A4c` |
| NonfungiblePositionManager | `0x7a4C48B9dae0b7c396569b34042fcA604150Ee28` |

### DEX Precompiles (Native AMM)
| Precompile | Address | Description |
|------------|---------|-------------|
| PoolManager | `0x0400` | Singleton pool manager |
| SwapRouter | `0x0401` | Optimized swap routing |
| HooksRegistry | `0x0402` | Hook contract registry |
| FlashLoan | `0x0403` | Flash loan facility |

## Key Tokens

| Symbol | Name | Type |
|--------|------|------|
| LUX | Lux | Native gas token |
| WLUX | Wrapped LUX | ERC-20 wrapped native (0x55750d6...) |
| LETH | Lux ETH | Bridged ETH (0xAA3AE95...) |
| LBTC | Lux BTC | Bridged BTC (0x526903E...) |
| ZOO | Zoo | Native on Zoo Network |

## Package Dependencies

```
@luxfi/web
  └── @luxfi/exchange
      ├── @luxfi/config
      └── @luxfi/api
  └── @luxfi/ui
      └── @luxfi/config
```

## Recent Changes (2025-12-25)

### Monorepo Migration Complete
- Migrated to Nx monorepo with pnpm workspaces
- Created 4 packages: config, exchange, ui, api
- Moved web app to apps/web/
- Added Tamagui UI components (Button, Card, TokenLogo)
- Added comprehensive ABIs for V2, V3, and DEX precompiles
- Added Zustand stores for swap state management
- Added React hooks for swap, pools, positions, balances

### Package Highlights

**@luxfi/config**
- Chain definitions (luxMainnet, luxTestnet, zooMainnet, zooTestnet)
- All deployed contract addresses from ~/work/lux/standard
- DEX precompile addresses
- Wagmi configuration

**@luxfi/exchange**
- Token definitions with bridge tokens (LETH, LBTC)
- Full ABIs: V2Router, V2Factory, V2Pair, V3Factory, V3Pool, SwapRouter, QuoterV2, NFTPositionManager
- DEX types: PoolKey, BalanceDelta, SwapParams
- Hooks: useSwapQuote, useSwap, usePools, usePositions, useTokenBalance, useTokenAllowance
- Stores: swapStore, tokenStore, settingsStore

**@luxfi/ui**
- Tamagui design tokens and themes (light/dark)
- Components: Button, Card, IconButton, TokenLogo

**@luxfi/api**
- React Query client configuration
- Token list and price hooks

## Development Workflow

1. Start dev server: `pnpm dev`
2. Make changes to packages (they're transpiled by Next.js)
3. Run tests: `pnpm test:e2e`
4. Commit: `git commit -m "feat: description"`

## Verification Status (2025-12-25)

- **TypeScript**: All 5 packages pass typecheck ✓
- **Build**: All packages build successfully ✓
- **E2E Tests**: 20 passed, 19 skipped (require local node) ✓

## Next Steps

1. **Connect to Standard AMM**: Wire up hooks to deployed V2/V3 contracts
2. **Add Pool UI**: Implement pool list and add/remove liquidity
3. **Add Positions UI**: Implement position management
4. **DEX Precompile Integration**: Add precompile-based swap path
5. **Cross-chain Support**: Implement Warp/Teleport routing

## Rules for AI Assistants

1. **ALWAYS** update LLM.md with significant discoveries
2. **NEVER** commit symlinked files (.AGENTS.md, CLAUDE.md, etc.)
3. **NEVER** create random summary files - update THIS file
4. **USE** Lux/Zoo chains and tokens as primary
5. **PREFER** packages from the monorepo over duplicating code
6. **USE** deployed addresses from ~/work/lux/standard/DEPLOYMENTS.md

---

**Note**: This file serves as the single source of truth for all AI assistants working on this project.
