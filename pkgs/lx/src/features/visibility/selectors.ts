import {
  ActivityIdToVisibility,
  CurrencyIdToVisibility,
  NFTKeyToVisibility,
  PositionKeyToVisibility,
} from 'lx/src/features/visibility/slice'
import { LxRootState } from 'lx/src/state'

export const selectPositionsVisibility = (state: LxRootState): PositionKeyToVisibility =>
  state.visibility.positions

export const selectTokensVisibility = (state: LxRootState): CurrencyIdToVisibility => state.visibility.tokens

export const selectNftsVisibility = (state: LxRootState): NFTKeyToVisibility => state.visibility.nfts

export const selectActivityVisibility = (state: LxRootState): ActivityIdToVisibility => state.visibility.activity
