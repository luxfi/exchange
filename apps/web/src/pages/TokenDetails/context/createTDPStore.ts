import { isDevEnv } from 'utilities/src/environment/env'
import type { StoreApi, UseBoundStore } from 'zustand'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { LoadedTDPContext, PendingTDPContext } from '~/pages/TokenDetails/context/TDPContext'

export type TDPState = PendingTDPContext | LoadedTDPContext

/** Actions for partial store updates; only volatile slices that can change without URL change */
type TDPActions = {
  setTokenQuery: (v: TDPState['tokenQuery']) => void
  setMultiChainMap: (v: TDPState['multiChainMap']) => void
  setChartState: (v: TDPState['chartState']) => void
  setTokenColor: (v: TDPState['tokenColor']) => void
  setCurrency: (v: TDPState['currency']) => void
  setAddress: (v: TDPState['address']) => void
}

type TDPStoreState = TDPState & { actions: TDPActions }

type TDPStore = UseBoundStore<StoreApi<TDPStoreState>>

export const createTDPStore = (initial: TDPState): TDPStore =>
  create<TDPStoreState>()(
    devtools(
      (set) => ({
        ...initial,
        actions: {
          setTokenQuery: (tokenQuery) => set({ tokenQuery }),
          setMultiChainMap: (multiChainMap) => set({ multiChainMap }),
          setChartState: (chartState) => set({ chartState }),
          setTokenColor: (tokenColor) => set({ tokenColor }),
          setCurrency: (currency) => set({ currency }),
          setAddress: (address) => set({ address }),
        },
      }),
      {
        name: 'TDPStore',
        enabled: isDevEnv(),
      },
    ),
  )
