# Lux Labs Inc.: Front End Interfaces

This is the **public** repository for Lux Labs Inc.' front-end interfaces, including the Web App, Wallet Mobile App, and Wallet Extension. Lux Exchange is forked from Uniswap — a protocol for decentralized exchange of Ethereum-based assets.

## Interfaces

- Web: [lux.exchange](https://lux.exchange)
- Wallet (mobile + extension): [wallet.lux.exchange](https://wallet.lux.exchange)

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

For instructions on the best way to contribute, please review our [Contributing guide](CONTRIBUTING.md).

## Socials / Contact

- X (Formerly Twitter): [@luxdefi](https://x.com/luxdefi)
- Email: [contact@lux.network](mailto:contact@lux.network)
- LinkedIn: [Lux Labs Inc.](https://www.linkedin.com/company/lux-network)

## Lux Links

- Website: [lux.network](https://lux.network/)
- Docs: [docs.lux.network](https://docs.lux.network/)

## Whitepapers

- [V4](https://lux.network/whitepaper-v4.pdf)
- [V3](https://lux.network/whitepaper-v3.pdf)
- [V2](https://lux.network/whitepaper.pdf)

## Production & Release Process

Lux Labs Inc. develops all front-end interfaces in a private repository.
At the end of each development cycle:

1. We publish the latest production-ready code to this public repository.
2. Releases are automatically tagged — view them in the [Releases tab](https://github.com/luxfi/exchange/releases).

## Directory Structure

| Folder      | Contents                                                                       |
| ----------- | ------------------------------------------------------------------------------ |
| `apps/`     | The home for each standalone application.                                      |
| `config/`   | Shared infrastructure packages and configurations.                             |
| `pkgs/`     | Shared code packages covering UI, shared functionality, and shared utilities.  |
