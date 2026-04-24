import {
  ActivityIdToVisibility,
  CurrencyIdToVisibility,
  NFTKeyToVisibility,
  PositionKeyToVisibility,
} from '@l.x/lx/src/features/visibility/slice'
import { LXRootState } from '@l.x/lx/src/state'

export const selectPositionsVisibility = (state: LXRootState): PositionKeyToVisibility =>
  state.visibility.positions

export const selectTokensVisibility = (state: LXRootState): CurrencyIdToVisibility => state.visibility.tokens

export const selectNftsVisibility = (state: LXRootState): NFTKeyToVisibility => state.visibility.nfts

export const selectActivityVisibility = (state: LXRootState): ActivityIdToVisibility => state.visibility.activity
