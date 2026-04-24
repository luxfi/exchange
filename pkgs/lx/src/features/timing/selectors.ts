import { LXState } from '@l.x/lx/src/state/lxReducer'

export const selectSwapStartTimestamp = (state: LXState): number | undefined => state.timing.swap.startTimestamp
