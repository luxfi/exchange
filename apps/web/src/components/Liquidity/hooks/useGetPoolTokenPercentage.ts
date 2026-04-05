<<<<<<< HEAD
import { Percent } from '@luxamm/sdk-core'
=======
import { Percent } from '@uniswap/sdk-core'
>>>>>>> upstream/main
import JSBI from 'jsbi'
import { useMemo } from 'react'
import { PositionInfo } from '~/components/Liquidity/types'

export function useGetPoolTokenPercentage(positionInfo?: PositionInfo) {
  const { totalSupply, liquidityAmount } = positionInfo ?? {}

  const poolTokenPercentage = useMemo(() => {
    return !!liquidityAmount && !!totalSupply && JSBI.greaterThanOrEqual(totalSupply.quotient, liquidityAmount.quotient)
      ? new Percent(liquidityAmount.quotient, totalSupply.quotient)
      : undefined
  }, [liquidityAmount, totalSupply])

  return poolTokenPercentage
}
