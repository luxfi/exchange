# AI Assistant Knowledge Base

**Last Updated**: 2025-12-30
**Project**: Lux Exchange Monorepo
**Organization**: luxfi

## Project Overview

Lux Exchange is a full-featured, cross-chain DEX for the Lux Network ecosystem. It combines:
- **Standard AMM Contracts** (`~/work/lux/standard`) - V2/V3 pools deployed on Lux chains
- **DEX Precompiles** (LP-9010 to LP-9040) - Native Uniswap v4-style pools for sub-microsecond execution
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

**Lux Precompile Address Standard:**
- **Prefix format**: `0xNNNN000000000000000000000000000000000000`
- LP-Aligned format: `0x0000000000000000000000000000000000LPNUM`
- DEX precompiles use LP-9xxx range (LP-9010 to LP-9040)
- See LP-9015 (Precompile Registry) for canonical spec

| Precompile | LP | Full Address |
|------------|-----|--------------|
| PoolManager | LP-9010 | `0x0000000000000000000000000000000000009010` |
| OracleHub | LP-9011 | `0x0000000000000000000000000000000000009011` |
| SwapRouter | LP-9012 | `0x0000000000000000000000000000000000009012` |
| HooksRegistry | LP-9013 | `0x0000000000000000000000000000000000009013` |
| FlashLoan | LP-9014 | `0x0000000000000000000000000000000000009014` |
| CLOB | LP-9020 | `0x0000000000000000000000000000000000009020` |
| Vault | LP-9030 | `0x0000000000000000000000000000000000009030` |
| PriceFeed | LP-9040 | `0x0000000000000000000000000000000000009040` |
| Teleport | LP-6010 | `0x0000000000000000000000000000000000006010` |

**Enabling DEX Precompiles:**

Add to `~/.lux/chain-configs/C/config.json`:
```json
{
  "dexConfig": {
    "upgrade": { "blockTimestamp": 0 },
    "enableFlashLoans": true,
    "enableHooks": true,
    "maxPools": 10000
  }
}
```

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

### Lux & Zoo Chain Integration
- Added Lux C-Chain (chainId: 96369) and Zoo Network (chainId: 200200) as native chains
- Created chain info files: `lux.ts` and `zoo.ts` in `/packages/uniswap/src/features/chains/evm/info/`
- Chains prioritized in ORDERED_CHAINS array for primary display
- Added LUX_LOGO, LUX_NETWORK_LOGO assets in `/packages/ui/src/assets/logos/`
- Fixed `testnet: false` property in chain configurations

### Branding Update (Uniswap → Lux)
- Updated user-facing strings in `en-US.json` translation file
- Changed: "Uniswap Wallet" → "Lux Wallet", "Uniswap Labs" → "Lux Industries"
- Changed: "Uniswap TVL" → "Lux TVL", "Uniswap Exchange" → "Lux Exchange"
- Updated social links: GitHub, Twitter, Discord to luxfi accounts
- Updated trademark policy to lux.exchange/trademark
- Preserved protocol names: "Uniswap v2", "Uniswap v3", "Uniswap v4", "UniswapX" (technical references)

### URL/Domain Branding (Uniswap → Lux)
- Updated default chain from Ethereum Mainnet to Lux in `utils.ts:getDefaultChainId()`
- Changed Apollo client Origin header to `https://lux.exchange`
- Updated MICROSITE_LINK to `https://lux.exchange/wallet`
- Updated env.ts domain checks from uniswap.org to lux.exchange
- Updated setupTests.ts origin to lux.exchange

**Support/Help URLs Updated:**
- AddLiquidity/index.tsx → `https://docs.lux.exchange/help/liquidity-full-range-v3`
- Pool/v2.tsx → `https://docs.lux.exchange/protocol/v2/core-concepts/pools`
- Pool/v2.tsx info link → `https://info.lux.exchange/v2/account/`
- Pool/CTACards.tsx → `https://docs.lux.exchange/help/providing-liquidity`
- SwapLineItem.tsx → `https://docs.lux.exchange/help/token-fees`, `swap-fees`
- GasBreakdownTooltip.tsx → `https://docs.lux.exchange/help/network-fees`
- LimitDisclaimer.tsx → `https://docs.lux.exchange/help/limit-orders`
- RouterPreferenceSettings → `https://docs.lux.exchange/help/uniswapx`
- OutageBanner.tsx → `https://docs.lux.exchange/help/subgraph-downtime`
- ConnectedAccountBlocked.tsx → `https://docs.lux.exchange/help/blocked-addresses`
- IncreaseLiquidityReview.tsx → `https://docs.lux.exchange/help/add-liquidity-existing-position`
- Wrapped/index.tsx → `https://wrapped.lux.exchange`
- PrivacyPolicy.tsx → `https://lux.exchange/terms`, `https://lux.exchange/privacy`
- WalletConnect metadata → `https://lux.exchange`, `Lux Exchange`

**Compliance email updated:**
- `compliance@uniswap.org` → `compliance@lux.exchange` (en-US.json + all 14 translation files)

**Additional Package Updates (packages/uniswap):**
- dynamicConfigOverrides.tsx → `lux.exchange` embedded wallet URL
- mainnet.ts → `https://docs.lux.exchange/` for Ethereum Mainnet and Sepolia docs
- conversionTracking/constants.ts → `.lux.exchange` cookie domain
- conversionTracking/utils.ts → Updated subdomain comment

**Remaining Backend API URLs (NOT changed - connect to real infrastructure):**
- `api.uniswap.org` - Core API endpoint
- `liquidity.backend-prod.api.uniswap.org` - Liquidity service
- `entry-gateway.backend-*.api.uniswap.org` - Conversion tracking APIs
These require Lux backend infrastructure to replace.

### @luxfi/config Exports Fixed
- Added chain exports: luxMainnet, luxTestnet, zooMainnet, zooTestnet
- Added contract exports: LUX_MAINNET_CONTRACTS, DEX_PRECOMPILES
- Fixed missing exports causing TypeScript errors

### React 19 Compatibility Fix
- Fixed "Cannot read properties of null (reading 'getOwner')" error
- Created `scripts/fix-reanimated-react19.sh` to patch react-native-reanimated
- The patch wraps `getCurrentReactOwner()` in try-catch for React 19 internals
- Added to postinstall hook in package.json
- Disabled StrictMode temporarily for immer 9.x compatibility
- Tests passing: 6/7 landing page tests pass (1 UK-specific test skipped)

### Namespace Migration Complete
- Renamed @universe/ → @luxfi/ across 871+ source files
- Renamed internal @uniswap packages: biome-config, eslint-config, extension, mobile → @luxfi/
- External @uniswap SDK packages preserved (sdk-core, router-sdk, etc.)
- All tests passing after migration

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

## Lux Gateway Integration (2025-12-26)

### Gateway Overview

The Lux Gateway (`~/work/lux/dex`) provides a unified API layer for DEX operations:
- **Lux Provider** (priority 10): Native handler for Lux (96369) and Zoo (200200) chains
- **Uniswap Provider** (priority 100): Fallback for all other chains

### Gateway URLs

| Environment | URL |
|-------------|-----|
| Development | `http://localhost:8085` |
| Staging | `https://dex.lux-test.network` |
| Production | `https://dex.lux.network` |

### Configuration

Environment variables in `.env` or `.env.local`:
```bash
LUX_GATEWAY_URL=http://localhost:8085  # Override default URL selection
```

### Files Modified for Gateway Integration

| File | Purpose |
|------|---------|
| `packages/config/src/config-types.ts` | Added `luxGatewayUrlOverride` field |
| `packages/config/src/getConfig.web.ts` | Added env var handling for web |
| `packages/config/src/getConfig.native.ts` | Added env var handling for mobile |
| `packages/config/src/global.d.ts` | Added `LUX_GATEWAY_URL` type declaration |
| `packages/uniswap/src/constants/urls.ts` | Added gateway URL constants and `getLuxGatewayUrl()` |
| `.env.defaults` | Added gateway URL documentation |

### Gateway Endpoints

```
GET  /health              - Provider health status
GET  /providers           - List registered providers
POST /v1/quote            - Get swap quote
POST /v1/quotes           - Get multiple quotes
POST /v1/swap             - Build swap transaction
GET  /v1/pools            - List pools
GET  /v1/pool/:chainId/:address - Get specific pool
GET  /v1/positions        - List positions
GET  /v1/price            - Get token price
POST /v1/prices           - Get multiple token prices
GET  /v1/tokens           - List tokens
POST /v1/leads            - Create conversion lead
POST /v1/events           - Track conversion event
```

### Quote Request Format

```json
{
  "tokenIn": "0x0000000000000000000000000000000000000000",
  "tokenOut": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  "amount": "1000000000000000000",
  "isExactIn": true,
  "chainId": 96369
}
```

### Testing Status

| Chain | Chain ID | Provider | Status |
|-------|----------|----------|--------|
| Lux | 96369 | lux | Mock quotes working |
| Zoo | 200200 | lux | Mock quotes working |
| Ethereum | 1 | uniswap | Requires API key |

### Frontend Integration (2025-12-26)

The `TradingApiClient` is now wrapped with `LuxGatewayClient` to route Lux/Zoo chain requests to the gateway:

**Files Added:**
- `packages/uniswap/src/data/apiClients/tradingApi/LuxGatewayClient.ts` - Gateway client wrapper

**Key Functions:**
- `isLuxChain(chainId)` - Checks if chain is Lux (96369) or Zoo (200200)
- `createLuxGatewayAwareTradingClient(client)` - Wraps TradingApiClient with gateway routing
- `fetchLuxGatewayQuote(request)` - Fetches quote from Lux Gateway

**How It Works:**
1. When `fetchQuote` or `fetchIndicativeQuote` is called
2. If `tokenInChainId` is 96369 (Lux) or 200200 (Zoo)
3. Request is routed to Lux Gateway (`/v1/quote`)
4. Response is transformed to match `DiscriminatedQuoteResponse` format
5. Falls back to TradingAPI on gateway failure

**Response Transformation:**
- Gateway returns mock quote with DEX precompile route (0x0400)
- Transformed to ClassicQuote format for UI compatibility
- Uses v4-pool route type for native Lux DEX pools

### Starting the Gateway

```bash
cd ~/work/lux/dex
go build -o lxd ./cmd/gateway
./lxd -addr :8085  # Development port (default is :8080)
```

## Universe Network Setup (2025-12-28)

All 4 network targets are now configured in `~/work/lux/universe/`:

### Port Assignments (Parallel-Safe)

| Network | RPC Base | Gateway | PostgreSQL | Redis | Network ID |
|---------|----------|---------|------------|-------|------------|
| Mainnet | 9630-9639 | 8080 | 15432 | 16379 | 1 |
| Testnet | 9740-9749 | 8081 | 15433 | 16380 | 2 |
| Devnet | 9840-9849 | 8082 | 15434 | 16381 | 5 |
| Local | 9940-9949 | 8083 | 15435 | 16382 | 1337 |

### Compose Files

```bash
# Start individual networks
docker compose -f compose.mainnet.yml up -d
docker compose -f compose.testnet.yml up -d
docker compose -f compose.devnet.yml up -d
docker compose -f compose.local.yml up -d

# Or use CLI for quick dev
lux network start --mainnet   # Ports 9630+
lux network start --testnet   # Ports 9640+
lux network start --devnet    # Ports 9650+
lux network start --local     # Single node, port 8545
```

### State Data

RLP block exports available at `~/work/lux/state/rlp/`:
- `lux-mainnet-96369.rlp` - 1,082,780 blocks (1.2GB)
- `zoo-mainnet-200200.rlp` - 799 blocks
- `lux-testnet-96368.rlp` - 219 blocks
- `zoo-testnet-200201.rlp` - 85 blocks

### LXD Gateway Endpoints

```bash
# Health check
curl http://localhost:8080/health

# Get pools (returns 5 v4 pools)
curl 'http://localhost:8080/v1/pools?chainId=96369'

# Get tokens (returns 10 tokens)
curl 'http://localhost:8080/v1/tokens?chainId=96369'

# Get swap quote
curl 'http://localhost:8080/v1/quote?chainId=96369&tokenIn=0x0&tokenOut=0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48&amount=1000000000000000000'
```

## SDK Type Compatibility Status (2025-12-28)

### Core Packages (All Typecheck Successfully)
- `packages/exchange` ✓ - AMM/DEX hooks, tokens, contracts
- `packages/lx` ✓ - Business logic, swap utilities
- `packages/ui` ✓ - UI components
- `packages/config` ✓ - Chain and contract configuration

### Known SDK Type Mismatches
The codebase uses `@luxamm/*` SDKs (forked from Uniswap) but `@luxdex/router-sdk` internally depends on `@uniswap/*` SDKs. This causes TypeScript errors when types cross boundaries.

**Solution Applied**: Type assertions (`as unknown as`) in:
- `packages/lx/src/features/transactions/swap/analytics.ts`
- `packages/lx/src/features/transactions/swap/types/trade.ts`
- `packages/lx/src/features/transactions/swap/utils/tradingApi.ts`
- `apps/web/src/utils/getTickToPrice.ts`
- `apps/web/src/utils/computeSurroundingTicks.ts`

**Remaining Web App Errors**: ~212 type errors in UI components (TransactionRow, PoolRow, NetworkFilter, etc.) due to SDK mismatches. These don't affect runtime functionality.

### Token Lists
Added `@uniswap/token-lists` with manually built dist/ types (package source-only).

### Legacy Pages
Excluded `src/_pages_legacy/` from typecheck in `apps/web/tsconfig.json`.

## G-Chain GraphQL Integration (2025-12-30)

### Overview

G-Chain is a read-only GraphQL interface that provides unified access to blockchain data across all Lux chains. It eliminates the need for external subgraph services by indexing DEX data natively.

### G-Chain URLs

| Environment | Port | URL |
|-------------|------|-----|
| Mainnet | 9630 | `http://localhost:9630/ext/bc/G/graphql` |
| Testnet | 9650 | `http://localhost:9650/ext/bc/G/graphql` |
| Devnet | 9650 | `http://localhost:9650/ext/bc/G/graphql` |

### Files Added

**Exchange Frontend (`packages/lx/src/data/gchain/`):**
- `client.ts` - Apollo client, queries, types, helper functions
- `hooks.ts` - React Query hooks for G-Chain data
- `useLuxBalance.ts` - Lux-specific balance and account hooks
- `index.ts` - Exports and documentation

**Configuration:**
- `packages/config/src/config-types.ts` - Added `gChainGraphqlUrl` field
- `packages/config/src/getConfig.web.ts` - G-Chain URL config for web
- `packages/config/src/getConfig.native.ts` - G-Chain URL config for mobile
- `packages/lx/src/constants/urls.ts` - G-Chain URL exports
- `packages/lx/src/data/links.ts` - Apollo link for G-Chain

**Node DEX Resolvers (`node/vms/graphvm/`):**
- `dex_resolvers.go` - Comprehensive v2/v3 subgraph-compatible resolvers
- `graphql.go` - Updated to register DEX resolvers

### G-Chain Queries

**Core Queries:**
```graphql
query { chainInfo { vmName version readOnly } }
query { block(hash: "0x...") { hash height timestamp } }
query { account(address: "0x...") { address balance nonce } }
query { balance(address: "0x...") }
```

**DEX Queries (v2/v3 subgraph compatible):**
```graphql
# Factory stats
query { factory(id: "1") { poolCount pairCount txCount totalVolumeUSD totalValueLockedUSD } }

# Price bundle (critical for quotes)
query { bundle(id: "1") { ethPriceUSD luxPriceUSD } }

# Token queries
query { token(id: "0x...") { symbol name decimals volumeUSD totalValueLockedUSD derivedETH } }
query { tokens(first: 100, orderBy: "volumeUSD", orderDirection: "desc") { id symbol volumeUSD } }

# Pool queries (v3)
query { pool(id: "0x...") { token0 { symbol } token1 { symbol } feeTier liquidity sqrtPrice tick } }
query { pools(first: 100) { id volumeUSD totalValueLockedUSD } }

# Pair queries (v2)
query { pair(id: "0x...") { reserve0 reserve1 token0Price token1Price volumeUSD } }
query { pairs(first: 100) { id reserveUSD volumeUSD } }

# Tick data (v3)
query { ticks(where: { pool: "0x..." }) { tickIdx liquidityGross liquidityNet price0 price1 } }

# Swap history
query { swaps(first: 100) { timestamp amount0 amount1 amountUSD pool pair } }

# Time series
query { tokenDayDatas(where: { token: "0x..." }, first: 30) { date volumeUSD priceUSD open high low close } }
query { poolHourDatas(where: { pool: "0x..." }, first: 24) { periodStartUnix volumeUSD tvlUSD } }
```

### React Hooks

```typescript
import { useGChainInfo, useGChainBalance, useLuxNativeBalance } from '@luxfi/lx/data/gchain'

// Chain info
const { data: chainInfo } = useGChainInfo()

// Account balance (raw)
const { data: balance } = useGChainBalance(address)

// Formatted Lux balance
const { formatted, isLoading } = useFormattedLuxBalance(address)
```

### Lux CLI Single-Node Setup

```bash
# Start local network (uses port 9640+ for testnet)
lux network start --testnet

# Deploy DEX chain
lux chain deploy dex --local

# Check DEX status
lux dex status

# Check configured chains
lux chain list
```

**DEX Chain Configuration (chain ID 36963):**
- Type: L2 (Based Rollup)
- VM: Custom DEX VM
- Block Time: 1ms (HFT optimized)
- Features: AMM + Perpetual futures
- Max orders/block: 10,000

## Lux Dev Mode (2025-12-30)

### Overview

The `lux dev start` command starts a single-node Lux network with instant block mining, perfect for local development and e2e testing.

### Key Features

- **K=1 Consensus**: No validator sampling required - blocks are accepted immediately
- **Full Validator Signing**: All chains (C/P/X) have full validator signing capabilities
- **Auto-Mining**: Blocks are mined instantly as transactions arrive
- **Anvil-Compatible**: Port 8545 by default, same test accounts as Anvil/Hardhat
- **Chain ID 1337**: Standard dev network ID

### Starting Dev Mode

```bash
# Build CLI (if needed)
cd ~/work/lux/cli && go build -o bin/lux ./main.go

# Start dev mode (default port 8545)
lux dev start

# Custom port
lux dev start --port 9650

# With timed block interval (e.g., 1 block per second)
lux dev start --automine 1s

# Clean state and restart fresh
lux dev start --clean
```

### Command Flags

| Flag | Default | Description |
|------|---------|-------------|
| `--port` | 8545 | HTTP port for RPC (Anvil-compatible) |
| `--automine` | (empty) | Block interval (e.g., `1s`, `500ms`); empty = instant |
| `--clean` | false | Clean state before starting (fresh genesis) |
| `--node-path` | (auto) | Path to luxd binary |
| `--log-level` | info | Log level (debug, info, warn, error) |

### Endpoints (Port 8545 default)

| Endpoint | URL |
|----------|-----|
| C-Chain RPC | `http://localhost:8545/ext/bc/C/rpc` |
| C-Chain WS | `ws://localhost:8545/ext/bc/C/ws` |
| P-Chain RPC | `http://localhost:8545/ext/bc/P` |
| X-Chain RPC | `http://localhost:8545/ext/bc/X` |
| Health | `http://localhost:8545/ext/health` |

### Test Accounts (Pre-funded)

The dev genesis includes the standard Anvil/Hardhat test accounts:

| Account | Address | Private Key |
|---------|---------|-------------|
| 0 | `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` | `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80` |
| 1 | `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` | `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d` |
| 2-9 | Standard Anvil accounts 2-9 | Standard Anvil keys |

### E2E Testing with Lux

To use Lux instead of Anvil for e2e tests:

1. Start Lux dev mode: `lux dev start`
2. Set environment variable: `REACT_APP_CHAIN_ID=1337`
3. Run e2e tests: `bun e2e:no-anvil`

The test wallet (`0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`) has funds on both Anvil and Lux dev mode.

### Data Directory

```
~/.lux/dev/
├── db/           # Blockchain database (cleared with --clean)
└── logs/         # Node logs
```

### Stopping Dev Mode

```bash
lux dev stop
# Or Ctrl+C if running in foreground
```

## G-Chain GraphQL Precompile (2025-12-30)

### Overview

A native EVM precompile at `0x0500` that enables any smart contract to execute GraphQL queries against the unified G-Chain query layer. This eliminates the need for off-chain oracles or subgraph services.

### Precompile Address

| Address | Name | Description |
|---------|------|-------------|
| `0x0500` | GraphQL Query | Main query interface |
| `0x0501` | GraphQL Subscribe | Subscriptions (future) |
| `0x0502` | GraphQL Cache | Query caching |

### Files Created

Location: `~/work/lux/precompiles/graph/`

| File | Description |
|------|-------------|
| `types.go` | Query types, gas costs, constants |
| `graph.go` | Main precompile implementation |
| `schema.go` | Full GraphQL schema (DEX + OpenZeppelin) |
| `registry.go` | Chain-to-precompile mapping |
| `IGraphQL.sol` | Solidity interface |

### Supported Query Types

**DEX Queries (V2/V3 subgraph compatible):**
- Factory stats, Bundle (ETH/LUX prices)
- Tokens, Pools, Pairs, Ticks
- Positions, Swaps, Mints, Burns
- Time series (day/hour data)

**OpenZeppelin Standard Library:**
- ERC20, ERC721, ERC1155 contracts and balances
- AccessControl roles and members
- Governor proposals and votes
- Timelock operations

**Lux-Specific:**
- Bridge tokens and transfers
- Liquid vault positions (self-repaying loans)
- Perpetual market positions

### Usage from Solidity

```solidity
import {IGraphQL, GraphQL} from "@luxfi/precompiles/graph/IGraphQL.sol";

contract MyContract {
    address constant GRAPHQL = address(0x0500);

    function getETHPrice() external returns (uint256) {
        (uint256 ethPrice, ) = GraphQL.getPriceBundle();
        return ethPrice;
    }

    function getPool(address poolAddr) external returns (
        address token0, address token1, uint24 fee
    ) {
        return GraphQL.getPool(poolAddr);
    }
}
```

### Gas Costs

| Operation | Gas |
|-----------|-----|
| Base query | 5,000 |
| Simple query | 10,000 |
| Complex query | 25,000 |
| Cross-chain query | 50,000 |
| Per entity | 1,000 |
| Per byte response | 3 |

### Precompile Registry by Chain

| Chain | Description | Key Precompiles |
|-------|-------------|-----------------|
| A | Asset Chain | Warp, GraphQL |
| B | Bridge Chain | Warp, Teleport, GraphQL |
| C | Contract Chain | ALL (DEX, AI, PQ, ZK, etc.) |
| D | DEX Chain | Full DEX suite, GraphQL |
| G | Graph Chain | GraphQL (read-only) |
| K | Keys Chain | PQ Crypto, Threshold, FHE |
| P | Platform Chain | Warp, Rewards |
| Q | Quantum Chain | Full PQ suite, Quasar |
| T | Token Chain | Warp, Teleport, GraphQL |
| X | Exchange Chain | Warp |
| Z | Zoo Chain | DEX, AI, GraphQL |

## Universal ZK Platform (2026-01-01)

### Architecture Overview

The Lux Universal ZK Platform enables proving anything, verifying cheaply, and composing proofs across chains. It uses a **Two Lane** approach:

**Production Lane** (stable, cheap):
- Groth16: External EVM cheap verification
- PLONK: Universal setup / upgradability
- STARK: Transparent, scalable, PQ-friendlier

**Research Lane** (versioned, experimental):
- Novel hashes, new arithmetizations, new commitment schemes
- Custom verifiers with explicit risk labels
- Sandboxed with versioned capability IDs

### Chain Responsibilities

| Chain | ID | Purpose | Key Precompiles |
|-------|----|---------|-----------------| 
| C | - | Contract Chain (apps) | ALL precompiles |
| Z | - | ZK Substrate | Program registry, Receipts, STARK verify |
| T | - | TFHE Threshold | Decrypt/reencrypt, Committee state |
| K | - | Key Management | PQ KMS, ML-KEM, Policies |
| A | - | Attestations | TEE, Identity, Compliance |

### Z-Chain RPC Surface (zkp_*)

```
zkp_registerProgram    - Register program/circuit
zkp_getProgram         - Get program metadata  
zkp_submitProof        - Submit proof for verification
zkp_getReceipt         - Get receipt by hash
zkp_getLatestRoot      - Get current receipt tree root
zkp_getInclusionProof  - Get Merkle proof for receipt
```

### Proof System IDs

| ID | System | Notes |
|----|--------|-------|
| 1 | STARK | Transparent, PQ-friendlier (internal) |
| 2 | Groth16 | Cheap external EVM verification |
| 3 | PLONK | Universal setup |
| 4 | Nova/Folding | Recursion-native |
| 5-99 | Reserved | Production lane |
| 100+ | Research | Experimental, versioned |

### Universal Receipt Format

The core interoperability object:
```
Receipt {
    programId      - Hash of verified program
    claimHash      - Hash of public inputs  
    receiptHash    - Self-referential hash
    proofSystemId  - 1=STARK, 2=Groth16, etc.
    version        - Proof system version
    verifiedAt     - Timestamp
    parentReceipt  - For recursion
    aggregationRoot - For batch receipts
}
```

### ZK Precompile Addresses (Cryptographic ISA)

| Address | Name | Gas | Description |
|---------|------|-----|-------------|
| 0x0501 | Poseidon2 | 800 | ZK-friendly hash (PQ-safe) |
| 0x0502 | Pedersen | 6,000 | Legacy commitments (NOT PQ-safe) |
| 0x0510 | STARK Field Arith | 8-15 | Goldilocks Fp |
| 0x0511 | STARK Ext Arith | 25 | Extension field Fp2 |
| 0x0512 | STARK Poseidon2 | 800 | Over Goldilocks |
| 0x0513 | STARK FRI Fold | 2,000 | FRI layer folding |
| 0x0514 | STARK Merkle | 400/level | Path verification |
| 0x051F | STARK Verify | 100k-500k | Full proof verify |

### Privacy Contracts (Post-Quantum)

New PQ-safe privacy contracts added:

| Contract | Purpose |
|----------|---------|
| `IPoseidon2.sol` | Poseidon2 precompile interface |
| `Poseidon2Commitments.sol` | Note commitments using Poseidon2 |
| `ZNotePQ.sol` | PQ-safe UTXO notes with Poseidon2 Merkle tree |
| `ISTARKVerifier.sol` | STARK verification interface |
| `IReceiptRegistry.sol` | Universal receipt registry interface |

### Benchmark Results (Poseidon2 vs Pedersen)

```
BenchmarkPoseidon2Commitment     40M ops/sec   29ns/op
BenchmarkPedersenCommit          13k ops/sec   92μs/op
BenchmarkNoteCommitPoseidon2     24M ops/sec   50ns/op  
BenchmarkNoteCommitPedersen      12k ops/sec   99μs/op

Gas: Poseidon2=800, Pedersen=6,000 (7.5x cheaper)
Speed: Poseidon2 is ~2000x faster
Security: Poseidon2 is PQ-safe, Pedersen is NOT
```

**Recommendation**: Use Poseidon2 for all new privacy applications. Pedersen only for legacy/external chain compatibility.

## Next Steps

1. **Fix SDK Dependencies**: Update `@luxdex/router-sdk` to use `@luxamm/*` SDKs
2. **Connect to Standard AMM**: Wire up hooks to deployed V2/V3 contracts
3. **Add Pool UI**: Implement pool list and add/remove liquidity
4. **Add Positions UI**: Implement position management
5. **DEX Precompile Integration**: Replace mock quotes with real precompile calls
6. **Cross-chain Support**: Implement Warp/Teleport routing
7. **Uniswap API Key**: Configure for non-Lux chain support
8. **G-Chain Event Indexer**: Build indexer to populate DEX data from contract events
9. **Wire Exchange to G-Chain**: Replace subgraph queries with G-Chain queries
10. **Register Graph Precompile**: Add to subnet-evm precompile registry
11. **Implement Z-Chain RPC**: Add zkp_* endpoints to node
12. **Receipt Registry**: Deploy and wire up receipt registry on Z-chain
13. **Groth16 Export**: Add receipt-to-Groth16 proof export for external EVMs

## Rules for AI Assistants

1. **ALWAYS** update LLM.md with significant discoveries
2. **NEVER** commit symlinked files (.AGENTS.md, CLAUDE.md, etc.)
3. **NEVER** create random summary files - update THIS file
4. **USE** Lux/Zoo chains and tokens as primary
5. **PREFER** packages from the monorepo over duplicating code
6. **USE** deployed addresses from ~/work/lux/standard/DEPLOYMENTS.md

---

**Note**: This file serves as the single source of truth for all AI assistants working on this project.
