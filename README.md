# Lux Exchange - Decentralized Exchange Interfaces

This is the repository for Lux Exchange front-end interfaces, including the Web App, Wallet Mobile App, and Wallet Extension. Lux Exchange is a protocol for decentralized exchange built on the Lux Network.

## Interfaces

- Web: [lux.exchange](https://lux.exchange)
- Wallet (mobile + extension): Coming soon

## Install & Apps

```bash
git clone git@github.com:luxfi/exchange.git
bun install
bun lfg
bun web start
```

For instructions per application or package, see the README published for each application:

- [Web](apps/web/README.md)
- [Mobile](apps/mobile/README.md)
- [Extension](apps/extension/README.md)

## Contributing

For instructions on the best way to contribute, please review our [Contributing guide](CONTRIBUTING.md)!

## Socials / Contact

- X (Formerly Twitter): [@luxdefi](https://x.com/luxdefi)
- Discord: [Lux Network](https://discord.gg/luxnetwork)
- Email: [contact@lux.network](mailto:contact@lux.network)

## Lux Links

- Website: [lux.network](https://lux.network/)
- Exchange: [lux.exchange](https://lux.exchange/)
- Docs: [docs.lux.network](https://docs.lux.network/)

## Key Features

### DEX Precompiles (Native AMM)

Lux Exchange leverages native DEX precompiles for ultra-fast trading:

- **PoolManager** (`0x0400`): Singleton pool management with flash accounting
- **SwapRouter** (`0x0401`): Optimized swap routing
- **HooksRegistry** (`0x0402`): Custom hook contract registry
- **FlashLoan** (`0x0403`): Flash loan facility

### CLOB Integration

Integration with Lux DEX CLOB (Central Limit Order Book) for:
- Limit orders
- Market orders
- High-frequency trading (1M+ orders/sec)

### Omnichain Routing

Best execution routing between:
- Native AMM precompiles
- CLOB order book
- Cross-chain swaps via Warp/Teleport

## Directory Structure

| Folder      | Contents                                                                       |
| ----------- | ------------------------------------------------------------------------------ |
| `apps/`     | The home for each standalone application.                                      |
| `config/`   | Shared infrastructure packages and configurations.                             |
| `packages/` | Shared code packages covering UI, shared functionality, and shared utilities.  |

## License

This project is licensed under the GPL-3.0-or-later License - see the [LICENSE](LICENSE) file for details.
