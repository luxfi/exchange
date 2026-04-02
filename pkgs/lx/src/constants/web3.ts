export const CONNECTION_PROVIDER_IDS = {
  WALLET_CONNECT_CONNECTOR_ID: 'walletConnect',
  NATIVE_WALLET_CONNECT_CONNECTOR_ID: 'nativeWalletConnect',
  INJECTED_CONNECTOR_TYPE: 'injected',
  COINBASE_SDK_CONNECTOR_ID: 'coinbaseWalletSDK',
  COINBASE_RDNS: 'com.coinbase.wallet',
  METAMASK_RDNS: 'io.metamask',
  EXTENSION_RDNS: 'org.lx.app',
  SAFE_CONNECTOR_ID: 'safe',
  EMBEDDED_WALLET_CONNECTOR_ID: 'embeddedWallet',
  BINANCE_WALLET_CONNECTOR_ID: 'wallet.binance.com',
  BINANCE_WALLET_RDNS: 'com.binance.wallet',
  PORTO_CONNECTOR_ID: 'xyz.ithaca.porto',
  MOCK_CONNECTOR_ID: 'mock',
  // Legacy aliases
  /** @deprecated use NATIVE_WALLET_CONNECT_CONNECTOR_ID */
  LX_WALLET_CONNECT_CONNECTOR_ID: 'nativeWalletConnect',
} as const

// Brand-aware connector display names — resolved at runtime from config.json
export const CONNECTION_PROVIDER_NAMES = {
  WALLET_CONNECT: 'WalletConnect',
  get EMBEDDED_WALLET() { return _getBrandShort() + ' Embedded Wallet' },
  METAMASK: 'MetaMask',
  get EXTENSION() { return _getBrandShort() + ' Extension' },
  get WALLET() { return _getBrandWalletName() },
  // Legacy aliases
  get LX_EXTENSION() { return _getBrandShort() + ' Extension' },
  get LX_WALLET() { return _getBrandWalletName() },
  PHANTOM: 'Phantom',
  COINBASE_SDK: 'Coinbase Wallet',
  COINBASE_SOLANA_WALLET_ADAPTER: 'Coinbase Wallet',
  SAFE: 'Safe',
  BINANCE_WALLET: 'Binance Wallet',
}

function _getBrandShort(): string {
  try { return require('@l.x/config').brand.shortName || 'Exchange' } catch { return 'Exchange' }
}
function _getBrandWalletName(): string {
  try { return require('@l.x/config').brand.walletName || 'Wallet' } catch { return 'Wallet' }
}
