import { LXState } from 'lx/src/state/lxReducer'

export const selectSwapStartTimestamp = (state: LXState): number | undefined => state.timing.swap.startTimestamp
