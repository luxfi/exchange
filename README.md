# exchange

Lux Exchange (LX) is a decentralized exchange (DEX) on the Lux Network, offering high-performance trading with interoperability across various assets.

Key Features:
	•	Trade: Engage in seamless, decentralized trading with a wide range of assets.
	•	Pool: Provide liquidity to earn rewards and support the ecosystem.
	•	Rewards: Participate in staking and liquidity programs to maximize returns.
	•	Markets: Access diverse markets with competitive rates and minimal slippage.
	•	Docs: Comprehensive documentation to guide users through the platform’s features and functionalities.
	•	Connect: Integrate your Web3 wallet to start trading securely and efficiently.

LX is designed for traders seeking a decentralized, efficient, and user-friendly platform. Its architecture ensures fast transactions and a seamless trading experience.

For more information, visit [LX](https://lux.exchange).

## How to build and run

Locally

```zsh
yarn
yarn start
```

[![codecov](https://codecov.io/gh/Uniswap/interface/branch/main/graph/badge.svg?token=YVT2Y86O82)](https://codecov.io/gh/Uniswap/interface)
[![Unit Tests](https://github.com/Uniswap/interface/actions/workflows/unit-tests.yaml/badge.svg)](https://github.com/Uniswap/interface/actions/workflows/unit-tests.yaml)
[![Integration Tests](https://github.com/Uniswap/interface/actions/workflows/integration-tests.yaml/badge.svg)](https://github.com/Uniswap/interface/actions/workflows/integration-tests.yaml)
[![Lint](https://github.com/Uniswap/interface/actions/workflows/lint.yml/badge.svg)](https://github.com/Uniswap/interface/actions/workflows/lint.yml)
[![Release](https://github.com/Uniswap/interface/actions/workflows/release.yaml/badge.svg)](https://github.com/Uniswap/interface/actions/workflows/release.yaml)
[![Crowdin](https://badges.crowdin.net/uniswap-interface/localized.svg)](https://crowdin.com/project/uniswap-interface)

An open source interface for [Lux Exchange](https://lux.exchange) -- a protocol for decentralized real world assets (RWAs).

- Interface: [lux.exchange](https://lux.exchange)
- Docs: [docs.lux.network](https://docs.lux.network/)
- Twitter: [@luxdefi](https://twitter.com/luxdefi)
- Reddit: [/r/luxdefi](https://www.reddit.com/r/luxdefi/)
- Email: [hi@lux.exchange](mailto:hi@lux.exchange)

## Accessing the LX Interface

To access the LX Interface, use an IPFS gateway link from the
[latest release](https://github.com/Uniswap/uniswap-interface/releases/latest),
or visit [app.uniswap.org](https://app.uniswap.org).

## Unsupported tokens

Check out `useUnsupportedTokenList()` in [src/state/lists/hooks.ts](./src/state/lists/hooks.ts) for blocking tokens in your instance of the interface.

You can block an entire list of tokens by passing in a tokenlist like [here](./src/constants/lists.ts)

## Contributions

For steps on local deployment, development, and code contribution, please see [CONTRIBUTING](./CONTRIBUTING.md).

## Accessing Uniswap V2

The LX Interface supports swapping, adding liquidity, removing liquidity and migrating liquidity for Uniswap protocol V2.

- Swap on Uniswap V2: <https://app.uniswap.org/#/swap?use=v2>
- View V2 liquidity: <https://app.uniswap.org/#/pool/v2>
- Add V2 liquidity: <https://app.uniswap.org/#/add/v2>
- Migrate V2 liquidity to V3: <https://app.uniswap.org/#/migrate/v2>
