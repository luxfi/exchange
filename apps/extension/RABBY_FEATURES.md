# Rabby Features Migration Tracker

This document tracks the migration of features from the Rabby-based xwallet to the Lux Exchange extension.

## Overview

The Lux Exchange extension is built on a modern stack (WXT, React 19, Tamagui) and integrates deeply with the Lux/Lux DEX ecosystem. We're augmenting it with battle-tested features from the Rabby wallet fork (xwallet).

## Feature Status

### Critical (Must Have)

| Feature | Status | Source | Target | Notes |
|---------|--------|--------|--------|-------|
| Ledger Support | 🟡 IN PROGRESS | `xwallet/src/background/service/keyring/eth-ledger-keyring.ts` | `src/features/hardware-wallets/ledger/` | WebHID, HD paths - Bridge implemented |
| Trezor Support | 🔴 TODO | `xwallet/src/background/service/keyring/eth-trezor-keyring.ts` | `src/features/hardware-wallets/trezor/` | WebExtension transport |
| Keystone Support | 🔴 TODO | `xwallet/src/background/service/keyring/eth-keystone-keyring.ts` | `src/features/hardware-wallets/keystone/` | QR code signing |
| WalletConnect v2 | 🔴 TODO | `xwallet` keyring | `src/features/walletconnect/` | Remote signing |
| Custom Networks | 🟢 DONE | `wallet_addEthereumChain` | `src/features/custom-networks/` | Service implemented |
| Custom Tokens | 🔴 TODO | `wallet_watchAsset` | `src/features/custom-tokens/` | Token import |

### High Priority

| Feature | Status | Source | Target | Notes |
|---------|--------|--------|--------|-------|
| Security Engine | 🟢 DONE | `xwallet/src/background/service/securityEngine.ts` | `src/background/services/security/` | Core engine implemented |
| Approval Manager | 🔴 TODO | `xwallet/src/ui/views/ApprovalManagePage/` | `src/features/approval-management/` | Batch revoke |
| Address Book | 🟢 DONE | `xwallet/src/background/service/contactBook.ts` | `src/features/address-book/` | Service implemented |
| Tx Simulation | 🔴 TODO | Via security engine | `src/features/tx-simulation/` | Preview |
| Safe/Gnosis | 🔴 TODO | `xwallet/src/background/service/keyring/eth-gnosis-keyring.ts` | `src/features/multisig/` | Multisig |

### Medium Priority

| Feature | Status | Source | Target | Notes |
|---------|--------|--------|--------|-------|
| Custom Testnets | 🔴 TODO | `xwallet/src/background/service/customTestnet.ts` | `src/features/custom-networks/testnets/` | Custom EVM |
| Bridge Integration | 🔴 TODO | `xwallet/src/background/service/bridge.ts` | `src/features/bridge/` | Multi-aggregator |
| Advanced Gas UI | 🔴 TODO | preference service | `src/features/gas/` | Custom presets |
| DApp Favorites | 🔴 TODO | `xwallet/src/background/service/permission.ts` | `src/features/dapp/` | Pin/favorite |

## Architecture Decisions

### Hardware Wallet Integration

The exchange extension uses WXT (Vite-based) which requires different handling than webpack:
- Use offscreen documents for WebHID/USB communication
- Maintain MV3 compatibility with service worker limitations
- Share keyring interfaces with existing wallet package

### State Management

- Extend existing Redux store with new slices for hardware wallets
- Add migrations for schema changes
- Use Redux Saga for async hardware operations

### UI Components

- Build on existing Tamagui component library
- Follow feature-based folder structure
- Integrate with existing navigation system

## Dependencies to Add

```json
{
  "@ledgerhq/hw-app-eth": "^6.x",
  "@ledgerhq/hw-transport-webusb": "^6.x",
  "@trezor/connect-webextension": "^9.x",
  "@keystonehq/keystone-sdk": "^0.x",
  "@walletconnect/web3wallet": "^1.x",
  "@safe-global/safe-core-sdk": "^3.x"
}
```

## Migration Notes

### From xwallet

The xwallet codebase uses:
- Webpack build system
- Class-based services with singleton pattern
- Chrome storage API directly
- Broadcast messaging pattern

We adapt to:
- WXT/Vite build system
- Functional approach with hooks where possible
- Redux persist with webextension storage adapter
- Redux action dispatch pattern

### Testing

- Port relevant tests from xwallet
- Add E2E tests for hardware wallet flows
- Mock hardware wallet devices in tests
