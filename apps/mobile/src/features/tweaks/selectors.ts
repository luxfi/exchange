import { TweaksState } from 'src/features/tweaks/slice'
<<<<<<< HEAD
import { CustomEndpoint } from '@l.x/lx/src/data/links'
=======
import { CustomEndpoint } from 'uniswap/src/data/links'
>>>>>>> upstream/main

export const selectCustomEndpoint = (state: { tweaks: TweaksState }): CustomEndpoint | undefined =>
  state.tweaks.customEndpoint
