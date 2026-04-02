import { createSelector, Selector } from '@reduxjs/toolkit'
import { normalizeTokenAddressForCache } from 'lx/src/data/cache'
import { PortfolioState, TokenBalanceOverride } from 'lx/src/features/portfolio/slice/slice'
import { LxState } from 'lx/src/state/lxReducer'

export const selectTokenBalanceOverrides = (state: LxState): PortfolioState['tokenBalanceOverrides'] =>
  state.portfolio.tokenBalanceOverrides

export const makeSelectTokenBalanceOverridesForWalletAddress = (): Selector<
  LxState,
  undefined | TokenBalanceOverride,
  [Address]
> =>
  createSelector(
    selectTokenBalanceOverrides,
    (_: LxState, walletAddress: Address) => walletAddress,
    (tokenBalanceOverrides, walletAddress) => tokenBalanceOverrides[normalizeTokenAddressForCache(walletAddress)],
  )
