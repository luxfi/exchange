<<<<<<< HEAD
import { SerializedToken } from '@l.x/lx/src/features/tokens/warnings/slice/types'
=======
import { SerializedToken } from 'uniswap/src/features/tokens/warnings/slice/types'
>>>>>>> upstream/main

export interface SerializedPair {
  token0: SerializedToken
  token1: SerializedToken
}

export enum SlippageTolerance {
  Auto = 'auto',
}
