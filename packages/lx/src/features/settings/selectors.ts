import { Language } from 'lx/src/features/language/constants'
import { deviceAccessTimeoutToMinutes } from 'lx/src/features/settings/constants'
import { UniswapState } from 'lx/src/state/uniswapReducer'

export const selectWalletHideSmallBalancesSetting = (state: UniswapState): boolean =>
  state.userSettings.hideSmallBalances

export const selectWalletHideSpamTokensSetting = (state: UniswapState): boolean => state.userSettings.hideSpamTokens

export const selectWalletHideReportedActivitySetting = (state: UniswapState): boolean =>
  state.userSettings.hideReportedActivity ?? true

export const selectCurrentLanguage = (state: UniswapState): Language => state.userSettings.currentLanguage

export const selectIsTestnetModeEnabled = (state: UniswapState): boolean =>
  state.userSettings.isTestnetModeEnabled ?? false

export const selectDeviceAccessTimeoutMinutes = (state: UniswapState): number | undefined =>
  deviceAccessTimeoutToMinutes(state.userSettings.deviceAccessTimeout)
