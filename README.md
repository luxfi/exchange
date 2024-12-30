# exchange

[LX](https://lux.exchange) is a decentralized exchange (DEX)
built on [Lux Network](https://lux.network), offering high-performance trading
with interoperability across hyper liquid digital assets and gas-free transactions.

Key Features:
	•	Trade: Engage in seamless, decentralized trading with a wide range of assets.
	•	Pool: Provide liquidity to earn rewards and support the ecosystem.
	•	Rewards: Participate in staking and liquidity programs to maximize returns.
	•	Markets: Access diverse markets with competitive rates and minimal slippage.
	•	Docs: Comprehensive documentation to guide users through the platform’s features and functionalities.
	•	Connect: Integrate your Web3 wallet to start trading securely and efficiently.

LX is designed for traders seeking a decentralized, efficient, and user-friendly platform. Its architecture ensures fast transactions and a seamless trading experience.

- Interface: [lux.exchange](https://lux.exchange)
- Docs: [docs.lux.network](https://docs.lux.network/)
- Twitter: [@luxdefi](https://twitter.com/luxdefi)
- Reddit: [/r/luxdefi](https://www.reddit.com/r/luxdefi/)
- Email: [hi@lux.exchange](mailto:hi@lux.exchange)

For more information, visit [Lux Exchange](https://lux.exchange).

## How to build and run

Locally

```zsh
yarn
yarn start
```

## Accessing the LX Interface

To access the LX Interface, use an IPFS gateway link from the
[latest release](https://github.com/luxfi/exchange/releases/latest),
or visit [lux.exchange](https://lux.exchange).

## Unsupported tokens

Check out `useUnsupportedTokenList()` in [src/state/lists/hooks.ts](./src/state/lists/hooks.ts) for blocking tokens in your instance of the interface.

You can block an entire list of tokens by passing in a tokenlist like [here](./src/constants/lists.ts)

## Accessing V2

The LX Interface supports swapping, adding liquidity, removing liquidity and migrating liquidity for Lux protocol V2.

- Swap on V2: <https://lux.exchange/#/swap?use=v2>
- View V2 liquidity: <https://lux.exchange/#/pool/v2>
- Add V2 liquidity: <https://lux.exchange/#/add/v2>
- Migrate V2 liquidity to V3: <https://lux.exchange/#/migrate/v2>

## Gasless Transactions

During our first year, Lux Network rebates 100% of LX related gas frees,
offering gas free trading to all users.

## Contributions

For steps on local deployment, development, and code contribution, please see [CONTRIBUTING](./CONTRIBUTING.md).
