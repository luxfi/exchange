export const UNI_LIST = 'https://tokens.uniswap.org'
export const UNI_EXTENDED_LIST = 'https://extendedtokens.uniswap.org/'
const UNI_UNSUPPORTED_LIST = 'https://unsupportedtokens.uniswap.org/'
const AAVE_LIST = 'tokenlist.aave.eth'
const BA_LIST = 'https://raw.githubusercontent.com/The-Blockchain-Association/sec-notice-list/master/ba-sec-list.json'
const CMC_ALL_LIST = 'https://cdn.lux.network/exchange/cmc/all.json' // proxy to https://api.coinmarketcap.com/data-api/v3/uniswap/all.json
const COINGECKO_LIST = 'https://tokens.coingecko.com/uniswap/all.json'
const COMPOUND_LIST = 'https://raw.githubusercontent.com/compound-finance/token-list/master/compound.tokenlist.json'
const GEMINI_LIST = 'https://www.gemini.com/uniswap/manifest.json'
const KLEROS_LIST = 't2crtokens.eth'
const ROLL_LIST = 'https://app.tryroll.com/tokens.json'
const SET_LIST = 'https://raw.githubusercontent.com/SetProtocol/uniswap-tokenlist/main/set.tokenlist.json'
const WRAPPED_LIST = 'wrapped.tokensoft.eth'

export const OPTIMISM_LIST = 'https://static.optimism.io/optimism.tokenlist.json'
export const ARBITRUM_LIST = 'https://bridge.arbitrum.io/token-list-42161.json'
export const BLAST_LIST = 'https://tokens.coingecko.com/blast/all.json'
export const ZORA_LIST = 'https://tokens.coingecko.com/zora-network/all.json'
export const LUX_LIST = 'https://tokens.coingecko.com/lux/all.json'
export const BNB_LIST = 'https://tokens.coingecko.com/binance-smart-chain/all.json'
export const CELO_LIST = 'https://celo-org.github.io/celo-token-list/celo.tokenlist.json'
export const BASE_LIST = 'https://raw.githubusercontent.com/ethereum-optimism/ethereum-optimism.github.io/master/optimism.tokenlist.json'
export const LUX_LIST = 'tokens-lux'
// export const LUX_LIST = 'https://cdn.lux.network/exchange/tokens-lux/tokens.json'

export const UNSUPPORTED_LIST_URLS: string[] = [BA_LIST, UNI_UNSUPPORTED_LIST]

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = [UNI_LIST, LUX_LIST, ARBITRUM_LIST, OPTIMISM_LIST, BASE_LIST, BLAST_LIST, BNB_LIST, LUX_LIST, ZORA_LIST]
export const DEFAULT_INACTIVE_LIST_URLS: string[] = [
  UNI_EXTENDED_LIST,
  COMPOUND_LIST,
  AAVE_LIST,
  CMC_ALL_LIST,
  COINGECKO_LIST,
  KLEROS_LIST,
  GEMINI_LIST,
  WRAPPED_LIST,
  SET_LIST,
  ROLL_LIST,
  CELO_LIST,
  ...UNSUPPORTED_LIST_URLS,
]

export const DEFAULT_LIST_OF_LISTS: string[] = [...DEFAULT_ACTIVE_LIST_URLS, ...DEFAULT_INACTIVE_LIST_URLS]
