'use client'

import { createContext, useContext } from 'react'

export interface ChainContextValue {
  chainId: number
  setChainId: (id: number) => void
}

export const ChainContext = createContext<ChainContextValue>({
  chainId: 96369,
  setChainId: () => {},
})

export function useChainContext() {
  return useContext(ChainContext)
}
