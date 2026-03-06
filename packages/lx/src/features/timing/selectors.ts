import { LuxState } from 'lx/src/state/luxReducer'

export const selectSwapStartTimestamp = (state: LuxState): number | undefined => state.timing.swap.startTimestamp
