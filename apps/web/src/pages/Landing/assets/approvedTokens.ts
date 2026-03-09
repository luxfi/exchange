import { GraphQLApi } from '@universe/api'
import ethereumLogo from '~/assets/images/ethereum-logo.png'
import luxLogo from '~/assets/svg/lux_logo.svg'
import zooLogo from '~/assets/svg/zoo_logo.svg'
import { NATIVE_CHAIN_ID } from '~/constants/tokens'

export interface InteractiveToken {
  name: string
  symbol: string
  address: string
  chain: GraphQLApi.Chain
  color: string
  logoUrl: string
}

export const approvedERC20: InteractiveToken[] = [
  {
    name: 'Lux',
    symbol: 'LUX',
    address: NATIVE_CHAIN_ID,
    chain: GraphQLApi.Chain.Lux,
    color: '#E84142',
    logoUrl: luxLogo,
  },
  {
    name: 'Zoo',
    symbol: 'ZOO',
    address: NATIVE_CHAIN_ID,
    chain: GraphQLApi.Chain.Zoo,
    color: '#22C55E',
    logoUrl: zooLogo,
  },
  {
    name: 'Lux Bitcoin',
    symbol: 'LBTC',
    address: '0x1E48D32a4F5e9f08DB9aE4959163300FaF8A6C8e',
    chain: GraphQLApi.Chain.Lux,
    color: '#F7931A',
    logoUrl: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
  },
  {
    name: 'Lux Solana',
    symbol: 'LSOL',
    address: '0x26B40f650156C7EbF9e087Dd0dca181Fe87625B7',
    chain: GraphQLApi.Chain.Lux,
    color: '#9945FF',
    logoUrl: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
  },
  {
    name: 'Lux Toncoin',
    symbol: 'LTON',
    address: '0x3141b94b89691009b950c96e97Bff48e0C543E3C',
    chain: GraphQLApi.Chain.Lux,
    color: '#0098EA',
    logoUrl: 'https://assets.coingecko.com/coins/images/17980/small/ton_symbol.png',
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    address: NATIVE_CHAIN_ID,
    chain: GraphQLApi.Chain.Ethereum,
    color: '#627EEA',
    logoUrl: ethereumLogo,
  },
  {
    name: 'USDCoin',
    symbol: 'USDC',
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    chain: GraphQLApi.Chain.Ethereum,
    color: '#2775CA',
    logoUrl:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
  },
  {
    name: 'Lux Ether',
    symbol: 'LETH',
    address: '0x60E0a8167FC13dE89348978860466C9ceC24B9ba',
    chain: GraphQLApi.Chain.Lux,
    color: '#627EEA',
    logoUrl: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
  },
  {
    name: 'Wrapped BTC',
    symbol: 'WBTC',
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    chain: GraphQLApi.Chain.Ethereum,
    color: '#F7931A',
    logoUrl:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png',
  },
  {
    name: 'Lux USD',
    symbol: 'LUSD',
    address: '0x848Cff46eb323f323b6Bbe1Df274E40793d7f2c2',
    chain: GraphQLApi.Chain.Lux,
    color: '#26A17B',
    logoUrl: luxLogo,
  },
  {
    name: 'Solana',
    symbol: 'SOL',
    color: '#48577F',
    logoUrl:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/assets/So11111111111111111111111111111111111111112/logo.png',
    address: NATIVE_CHAIN_ID,
    chain: GraphQLApi.Chain.Solana,
  },
  {
    name: 'Polygon',
    symbol: 'POL',
    address: '0x0000000000000000000000000000000000001010',
    chain: GraphQLApi.Chain.Polygon,
    color: '#833ADD',
    logoUrl:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/assets/0x0000000000000000000000000000000000001010/logo.png',
  },
  {
    name: 'Chainlink',
    symbol: 'LINK',
    color: '#2A5ADA',
    logoUrl:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png',
    address: '0x514910771af9ca656af840dff83e8264ecf986ca',
    chain: GraphQLApi.Chain.Ethereum,
  },
  {
    name: 'Aave',
    symbol: 'AAVE',
    color: '#B6509E',
    logoUrl:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9/logo.png',
    address: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
    chain: GraphQLApi.Chain.Ethereum,
  },
  {
    name: 'Tether',
    symbol: 'USDT',
    color: '#409192',
    logoUrl:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    chain: GraphQLApi.Chain.Ethereum,
  },
  {
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    chain: GraphQLApi.Chain.Ethereum,
    color: '#FFAA00',
    logoUrl:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
  },
  {
    name: 'Pepe Token',
    symbol: 'PEPE',
    color: '#009E1E',
    logoUrl:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6982508145454Ce325dDbE47a25d4ec3d2311933/logo.png',
    address: '0x6982508145454ce325ddbe47a25d4ec3d2311933',
    chain: GraphQLApi.Chain.Ethereum,
  },
  {
    name: 'Lux ZOO',
    symbol: 'LZOO',
    address: '0x5E5290f350352768bD2bfC59c2DA15DD04A7cB88',
    chain: GraphQLApi.Chain.Lux,
    color: '#22C55E',
    logoUrl: zooLogo,
  },
  {
    name: 'Maker',
    symbol: 'MKR',
    color: '#6DAEA2',
    logoUrl:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2/logo.png',
    address: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
    chain: GraphQLApi.Chain.Ethereum,
  },
]
