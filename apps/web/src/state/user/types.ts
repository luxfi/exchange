import { SerializedToken } from '@luxexchange/lx/src/features/tokens/warnings/slice/types'

export interface SerializedPair {
  token0: SerializedToken
  token1: SerializedToken
}

export enum SlippageTolerance {
  Auto = 'auto',
}
