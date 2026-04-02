import { createSelector, Selector } from '@reduxjs/toolkit'
import { normalizeTokenAddressForCache } from 'lx/src/data/cache'
import { PortfolioState, TokenBalanceOverride } from 'lx/src/features/portfolio/slice/slice'
import { LXState } from 'lx/src/state/lxReducer'

export const selectTokenBalanceOverrides = (state: LXState): PortfolioState['tokenBalanceOverrides'] =>
  state.portfolio.tokenBalanceOverrides

export const makeSelectTokenBalanceOverridesForWalletAddress = (): Selector<
  LXState,
  undefined | TokenBalanceOverride,
  [Address]
> =>
  createSelector(
    selectTokenBalanceOverrides,
    (_: LXState, walletAddress: Address) => walletAddress,
    (tokenBalanceOverrides, walletAddress) => tokenBalanceOverrides[normalizeTokenAddressForCache(walletAddress)],
  )
