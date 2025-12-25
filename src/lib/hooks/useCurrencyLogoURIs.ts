import { SupportedChainId } from 'constants/chains'
import useHttpLocations from 'hooks/useHttpLocations'
import { useMemo } from 'react'
import { isAddress } from 'utils'

import EthereumLogo from '../../assets/images/ethereum-logo.png'
import CeloLogo from '../../assets/svg/celo_logo.svg'
import LuxLogo from '../../assets/svg/lux_logo.svg'
import ZooLogo from '../../assets/svg/zoo_logo.svg'
import MaticLogo from '../../assets/svg/matic-token-icon.svg'
import BLASTLogo from '../../assets/svg/blast_logo.svg'
import BNBLogo from '../../assets/svg/bnb_logo.svg'
import { isCelo, isLUX, isZOO, NATIVE_CHAIN_ID, nativeOnChain } from '../../constants/tokens'

type Network = 'ethereum' | 'arbitrum' | 'optimism' | 'polygon'

export function chainIdToNetworkName(networkId: SupportedChainId): Network {
  switch (networkId) {
    case SupportedChainId.MAINNET:
      return 'ethereum'
    case SupportedChainId.ARBITRUM_ONE:
      return 'arbitrum'
    case SupportedChainId.OPTIMISM:
      return 'optimism'
    case SupportedChainId.POLYGON:
      return 'polygon'
    default:
      return 'ethereum'
  }
}

function getTokenLogoURI(address: string, chainId: SupportedChainId = SupportedChainId.MAINNET): string | void {
  const networkName = chainIdToNetworkName(chainId)
  const networksWithUrls = [SupportedChainId.ARBITRUM_ONE, SupportedChainId.MAINNET, SupportedChainId.OPTIMISM, SupportedChainId.BASE]
  if (networksWithUrls.includes(chainId)) {
    return `https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/${networkName}/assets/${address}/logo.png`
  }

  // Celo logo is hosted elsewhere.
  if (isCelo(chainId)) {
    if (address === nativeOnChain(chainId).wrapped.address) {
      return 'https://raw.githubusercontent.com/ubeswap/default-token-list/master/assets/asset_CELO.png'
    }
  }

  // Lux logo is hosted elsewhere.
  if (isLUX(chainId)) {
    if (address === nativeOnChain(chainId).wrapped.address) {
      return 'https://cdn.lux.network/bridge/currencies/lux.png'
    }
  }
  if (isZOO(chainId)) {
    if (address === nativeOnChain(chainId).wrapped.address) {
      return 'https://cdn.lux.network/bridge/currencies/zoo.png'
    }
  }
}

export function getNativeLogoURI(chainId: SupportedChainId = SupportedChainId.MAINNET): string {
  switch (chainId) {
    case SupportedChainId.BLAST:
      return BLASTLogo
    case SupportedChainId.BNB:
      return BNBLogo
    case SupportedChainId.POLYGON:
    case SupportedChainId.POLYGON_MUMBAI:
      return MaticLogo
    case SupportedChainId.CELO:
    case SupportedChainId.CELO_ALFAJORES:
      return CeloLogo
    case SupportedChainId.LUX:
    case SupportedChainId.LUX_TESTNET:
      return LuxLogo
    case SupportedChainId.ZOO:
      return ZooLogo
    default:
      return EthereumLogo
  }
}

export default function useCurrencyLogoURIs(
  currency:
    | {
      isNative?: boolean
      isToken?: boolean
      address?: string
      chainId: number
      logoURI?: string | null
    }
    | null
    | undefined
): string[] {
  const locations = useHttpLocations(currency?.logoURI)
  return useMemo(() => {
    const logoURIs = [...locations]
    if (currency) {
      if (currency.isNative || currency.address === NATIVE_CHAIN_ID) {
        logoURIs.push(getNativeLogoURI(currency.chainId))
      } else if (currency.isToken || currency.address) {
        const checksummedAddress = isAddress(currency.address)
        const logoURI = checksummedAddress && getTokenLogoURI(checksummedAddress, currency.chainId)
        if (logoURI) {
          logoURIs.push(logoURI)
        }
      }
    }
    return logoURIs
  }, [currency, locations])
}