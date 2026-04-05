import { FeatureFlags, useFeatureFlag } from '@universe/gating'
import { TokenProfitLoss } from 'uniswap/src/components/TokenProfitLoss/TokenProfitLoss'
import { useGetWalletTokenProfitLossQuery } from 'uniswap/src/data/rest/getWalletTokenProfitLoss'
import { useConnectionStatus } from 'uniswap/src/features/accounts/store/hooks'
import { DEFAULT_NATIVE_ADDRESS } from 'uniswap/src/features/chains/evm/rpc'
import { UniverseChainId } from 'uniswap/src/features/chains/types'
import { fromGraphQLChain, isStablecoinAddress } from 'uniswap/src/features/chains/utils'
import { NATIVE_CHAIN_ID } from '~/constants/tokens'
import { useActiveAddresses } from '~/features/accounts/store/hooks'
import { useTDPStore } from '~/pages/TokenDetails/context/useTDPStore'

export function TokenPerformance(): JSX.Element | null {
  const isProfitLossEnabled = useFeatureFlag(FeatureFlags.ProfitLoss)
  const { isDisconnected } = useConnectionStatus()
  const { address, currencyChain } = useTDPStore((s) => ({ address: s.address, currencyChain: s.currencyChain }))
  const { evmAddress, svmAddress } = useActiveAddresses()

  const chainId = fromGraphQLChain(currencyChain) ?? UniverseChainId.Mainnet
  const tokenAddress = address === NATIVE_CHAIN_ID ? DEFAULT_NATIVE_ADDRESS : address
  const isStablecoin = isStablecoinAddress(chainId, tokenAddress)

  const { data, isError } = useGetWalletTokenProfitLossQuery({
    input: {
      evmAddress,
      svmAddress,
      chainId,
      tokenAddress,
    },
    enabled: isProfitLossEnabled && !isDisconnected && !isStablecoin,
  })

  const profitLoss = data?.profitLoss

  if (!isProfitLossEnabled || isDisconnected || !profitLoss || isStablecoin || isError) {
    return null
  }

  return (
    <TokenProfitLoss
      averageCost={profitLoss.averageCostUsd}
      oneDayReturn={profitLoss.oneDayReturnUsd}
      oneDayReturnPercent={profitLoss.oneDayReturnPercent}
      unrealizedReturn={profitLoss.unrealizedReturnUsd}
      unrealizedReturnPercent={profitLoss.unrealizedReturnPercent}
      realizedReturn={profitLoss.realizedReturnUsd}
      realizedReturnPercent={profitLoss.realizedReturnPercent}
    />
  )
}
