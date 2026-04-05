import ms from 'ms'
<<<<<<< HEAD
import { LimitsExpiry } from '@l.x/lx/src/types/limits'

const DAY_SECS = ms('1d') / 1000

// eslint-disable-next-line consistent-return
=======
import { LimitsExpiry } from 'uniswap/src/types/limits'

const DAY_SECS = ms('1d') / 1000

// oxlint-disable-next-line consistent-return
>>>>>>> upstream/main
export function expiryToDeadlineSeconds(expiry: LimitsExpiry): number {
  switch (expiry) {
    case LimitsExpiry.Day:
      return DAY_SECS
    case LimitsExpiry.Week:
      return DAY_SECS * 7
    case LimitsExpiry.Month:
      return DAY_SECS * 30
    case LimitsExpiry.Year:
      return DAY_SECS * 365
  }
}
