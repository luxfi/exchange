# AI Assistant Knowledge Base

**Last Updated**: 2025-12-25
**Project**: Lux Exchange
**Organization**: luxfi

## Project Overview

Lux Exchange is a decentralized exchange (DEX) for the Lux Network ecosystem. It provides a swap interface for trading tokens on Lux Mainnet, Lux Testnet, Zoo Mainnet, and Zoo Testnet chains.

## Technology Stack

- **Framework**: Next.js 15.3 (App Router)
- **React**: 19.x
- **Web3**: wagmi v3, viem
- **Styling**: Tailwind CSS, shadcn/ui components
- **Testing**: Playwright (e2e), Vitest (unit)
- **Package Manager**: pnpm

## Essential Commands

```bash
# Development
pnpm dev                # Start dev server (port 3001)
pnpm build              # Production build
pnpm start              # Start production server

# Testing
pnpm test               # Unit tests (Vitest)
pnpm test:e2e           # E2E tests (Playwright)
pnpm exec playwright test e2e/home.spec.ts --reporter=list  # Run specific tests

# Linting
pnpm lint               # ESLint
pnpm typecheck          # TypeScript type checking
```

## Architecture

```
/Users/z/work/lux/exchange/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Home page (swap widget)
│   ├── pool/               # Liquidity pool pages
│   ├── swap/               # Dedicated swap page
│   └── tokens/             # Token list page
├── components/
│   ├── layout/             # Header, Footer
│   ├── providers/          # React context providers
│   │   └── web3-provider.tsx  # wagmi/viem setup
│   ├── swap/               # Swap widget components
│   │   ├── swap-widget.tsx # Main swap interface
│   │   └── token-selector.tsx # Token selection modal
│   ├── wallet/             # Wallet components
│   │   └── chain-selector.tsx # Chain dropdown
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── chains.ts           # Chain definitions (Lux, Zoo, Ethereum)
│   ├── contracts.ts        # Contract addresses per chain
│   └── tokens.ts           # Token list with metadata
├── e2e/                    # Playwright e2e tests
│   └── home.spec.ts        # Home page tests (20 tests)
├── __tests__/              # Unit tests (Vitest)
└── public/
    └── tokens/             # Token icons (SVG)
```

## Supported Chains

| Chain | Chain ID | RPC |
|-------|----------|-----|
| Lux Mainnet | 96369 | https://api.lux.network/rpc |
| Lux Testnet | 96368 | https://api.lux-test.network/rpc |
| Zoo Mainnet | 200200 | https://api.zoo.network/rpc |
| Zoo Testnet | 200201 | https://api.zoo-test.network/rpc |
| Ethereum | 1 | https://eth.llamarpc.com |
| Sepolia | 11155111 | https://eth-sepolia.public.blastapi.io |

## Key Tokens (Lux Network)

| Symbol | Name | Type |
|--------|------|------|
| LUX | Lux | Native gas token |
| WLUX | Wrapped LUX | ERC-20 wrapped native |
| LETH | Lux ETH | Bridged ETH |
| LBTC | Lux BTC | Bridged BTC |
| LUSD | Lux USD | Stablecoin |

## Contract Addresses (Placeholder)

Contract addresses are in `lib/contracts.ts` - currently using placeholder addresses. Real addresses need to be deployed from `/Users/z/work/lux/standard`:

- LuxV2Factory
- LuxV2Router
- Token contracts (WLUX, LETH, LBTC, LUSD)

## Recent Changes (2025-12-25)

### Migration Complete: CRA → Next.js 15
- Migrated from Create React App to Next.js 15 App Router
- Migrated from web3-react to wagmi v3 + viem
- Updated all dependencies to latest versions

### New Features
1. **Chain Selector**: Dropdown in header to switch between Lux/Zoo networks
2. **Token Selector**: Modal with search for selecting swap tokens
3. **Lux-First Token List**: LUX, WLUX, LETH, LBTC, LUSD as primary tokens
4. **Default Pair**: LUX → LUSD on Lux Mainnet

### Test Status
- 20/20 Playwright e2e tests passing
- Unit tests for token utilities passing

## Development Workflow

1. Start dev server: `pnpm dev`
2. Make changes
3. Run tests: `pnpm exec playwright test e2e/home.spec.ts --reporter=list`
4. Commit: `git commit -m "feat: description"`
5. Push: `git push origin dev`

## Pending Work

1. **Deploy AMM Contracts**: Deploy real contracts from `/Users/z/work/lux/standard` to update `lib/contracts.ts`
2. **G-Chain Integration**: Replace The Graph subgraphs with G-Chain (GraphVM) for indexing
3. **Local Testing Stack**: Complete docker-compose setup with luxd, G-Chain, contracts
4. **Upstream Sync**: Port more components from `/Users/z/work/uni/interface` (Uniswap)

## Context for All AI Assistants

This file (`LLM.md`) is symlinked as:
- `.AGENTS.md`
- `CLAUDE.md`
- `QWEN.md`
- `GEMINI.md`

All files reference the same knowledge base. Updates here propagate to all AI systems.

## Rules for AI Assistants

1. **ALWAYS** update LLM.md with significant discoveries
2. **NEVER** commit symlinked files (.AGENTS.md, CLAUDE.md, etc.) - they're in .gitignore
3. **NEVER** create random summary files - update THIS file
4. **USE** Lux/Zoo chains and tokens as primary, Ethereum as secondary
5. **PREFER** wagmi v3 + viem over web3-react

---

**Note**: This file serves as the single source of truth for all AI assistants working on this project.
