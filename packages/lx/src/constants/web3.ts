export const CONNECTION_PROVIDER_IDS = {
  WALLET_CONNECT_CONNECTOR_ID: 'walletConnect',
  LUX_WALLET_CONNECT_CONNECTOR_ID: 'luxWalletConnect',
  INJECTED_CONNECTOR_TYPE: 'injected',
  COINBASE_SDK_CONNECTOR_ID: 'coinbaseWalletSDK',
  COINBASE_RDNS: 'com.coinbase.wallet',
  METAMASK_RDNS: 'io.metamask',
  LUX_EXTENSION_RDNS: 'org.lux.app',
  SAFE_CONNECTOR_ID: 'safe',
  EMBEDDED_WALLET_CONNECTOR_ID: 'embeddedLuxWalletConnector',
  BINANCE_WALLET_CONNECTOR_ID: 'wallet.binance.com',
  BINANCE_WALLET_RDNS: 'com.binance.wallet',
  PORTO_CONNECTOR_ID: 'xyz.ithaca.porto',
  MOCK_CONNECTOR_ID: 'mock',
} as const

export const CONNECTION_PROVIDER_NAMES = {
  WALLET_CONNECT: 'WalletConnect',
  EMBEDDED_WALLET: 'Lux Embedded Wallet',
  METAMASK: 'MetaMask',
  LUX_EXTENSION: 'Lux Extension',
  LUX_WALLET: 'Lux Wallet',
  PHANTOM: 'Phantom',
  COINBASE_SDK: 'Coinbase Wallet',
  COINBASE_SOLANA_WALLET_ADAPTER: 'Coinbase Wallet',
  SAFE: 'Safe',
  BINANCE_WALLET: 'Binance Wallet',
} as const
