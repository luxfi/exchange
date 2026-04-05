<<<<<<< HEAD
import { Token } from '@luxamm/sdk-core'
=======
import { Token } from '@uniswap/sdk-core'
>>>>>>> upstream/main
import { useMemo } from 'react'
import { formatTokenAmount } from '~/components/Liquidity/LPIncentives/utils/formatTokenAmount'

interface UseFormattedTokenRewardsProps {
  tokenRewards: string
  token: Token
}

export function useFormattedTokenRewards({ tokenRewards, token }: UseFormattedTokenRewardsProps) {
  return useMemo(() => {
    return formatTokenAmount(tokenRewards, token.decimals)
  }, [tokenRewards, token.decimals])
}
