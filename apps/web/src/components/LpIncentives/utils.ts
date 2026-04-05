<<<<<<< HEAD
import { Percent } from '@luxamm/sdk-core'
import { BIPS_BASE } from '@l.x/lx/src/constants/misc'
=======
import { Percent } from '@uniswap/sdk-core'
import { BIPS_BASE } from 'uniswap/src/constants/misc'
>>>>>>> upstream/main

export const calculateTotalApr = (poolApr: Percent, rewardsApr: number) => {
  const rewardsAprPercent = new Percent(Math.round(rewardsApr * 100), BIPS_BASE)
  return poolApr.add(rewardsAprPercent)
}
