<<<<<<< HEAD
import { Percent } from '@luxamm/sdk-core'
=======
import { Percent } from '@uniswap/sdk-core'
>>>>>>> upstream/main

export function largerPercentValue(a?: Percent, b?: Percent) {
  if (a && b) {
    return a.greaterThan(b) ? a : b
  } else if (a) {
    return a
  } else if (b) {
    return b
  }
  return undefined
}
