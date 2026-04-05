import { FeatureFlags, useFeatureFlag } from '@universe/gating'
import { memo } from 'react'
import { useTokenDetailsContext } from 'src/components/TokenDetails/TokenDetailsContext'
import { Flex, Separator } from 'ui/src'
import { TokenProfitLoss } from 'uniswap/src/components/TokenProfitLoss/TokenProfitLoss'
import { useGetWalletTokenProfitLossQuery } from 'uniswap/src/data/rest/getWalletTokenProfitLoss'
import { DEFAULT_NATIVE_ADDRESS } from 'uniswap/src/features/chains/evm/rpc'
import { isStablecoinAddress } from 'uniswap/src/features/chains/utils'
import { isNativeCurrencyAddress } from 'uniswap/src/utils/currencyId'
import { useActiveAddresses } from 'wallet/src/features/accounts/store/hooks'

export const TokenPerformance = memo(function TokenPerformance(): JSX.Element | null {
  const isProfitLossEnabled = useFeatureFlag(FeatureFlags.ProfitLoss)
  const { address, chainId } = useTokenDetailsContext()
  const { evmAddress, svmAddress } = useActiveAddresses()

  const tokenAddress = isNativeCurrencyAddress(chainId, address) ? DEFAULT_NATIVE_ADDRESS : address
  const isStablecoin = isStablecoinAddress(chainId, tokenAddress)

  const { data, isError } = useGetWalletTokenProfitLossQuery({
    input: {
      evmAddress,
      svmAddress,
      chainId,
      tokenAddress,
    },
    enabled: isProfitLossEnabled && !isStablecoin,
  })

  const profitLoss = data?.profitLoss

  if (!isProfitLossEnabled || !profitLoss || isStablecoin || isError) {
    return null
  }

  return (
    <Flex gap="$spacing24" px="$spacing16">
      <TokenProfitLoss
        averageCost={profitLoss.averageCostUsd}
        oneDayReturn={profitLoss.oneDayReturnUsd}
        oneDayReturnPercent={profitLoss.oneDayReturnPercent}
        unrealizedReturn={profitLoss.unrealizedReturnUsd}
        unrealizedReturnPercent={profitLoss.unrealizedReturnPercent}
        realizedReturn={profitLoss.realizedReturnUsd}
        realizedReturnPercent={profitLoss.realizedReturnPercent}
      />
      <Separator />
    </Flex>
  )
})
