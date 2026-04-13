import { GraphQLApi } from '@l.x/api'
import ethereumLogo from '~/assets/images/ethereum-logo.png'
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
