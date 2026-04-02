import { CELO_LOGO } from '@luxfi/ui/src/assets'
import { nativeOnChain } from '@l.x/lx/src/constants/tokens'
import { getChainInfo } from '@l.x/lx/src/features/chains/chainInfo'
import { UniverseChainId } from '@l.x/lx/src/features/chains/types'
import { isUniverseChainId } from '@l.x/lx/src/features/chains/utils'
import { getValidAddress } from '@l.x/lx/src/utils/addresses'

export function getInitialLogoUrl({
  address,
  chainId,
  backupImg,
}: {
  address?: string | null
  chainId?: number | null
  backupImg?: string | null
}) {
  const networkName = isUniverseChainId(chainId)
    ? (getChainInfo(chainId).assetRepoNetworkName ?? 'ethereum')
    : 'ethereum'
  const checksummedAddress = getValidAddress({
    address,
    chainId: isUniverseChainId(chainId) ? chainId : UniverseChainId.Mainnet,
    withEVMChecksum: true,
  })

  if (chainId === UniverseChainId.Celo && address === nativeOnChain(chainId).wrapped.address) {
    return CELO_LOGO
  }

  if (checksummedAddress) {
    return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${networkName}/assets/${checksummedAddress}/logo.png`
  } else {
    return backupImg ?? undefined
  }
}
