import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
<<<<<<< HEAD
import { type CustomEndpoint } from '@l.x/lx/src/data/links'
=======
import { type CustomEndpoint } from 'uniswap/src/data/links'
>>>>>>> upstream/main

export interface TweaksState {
  customEndpoint?: CustomEndpoint
}

export const initialTweaksState: TweaksState = {}

const slice = createSlice({
  name: 'tweaks',
  initialState: initialTweaksState,
  reducers: {
    setCustomEndpoint: (state, { payload: { customEndpoint } }: PayloadAction<{ customEndpoint?: CustomEndpoint }>) => {
      state.customEndpoint = customEndpoint
    },
    resetTweaks: () => initialTweaksState,
  },
})

export const { setCustomEndpoint, resetTweaks } = slice.actions
export const { reducer: tweaksReducer } = slice
