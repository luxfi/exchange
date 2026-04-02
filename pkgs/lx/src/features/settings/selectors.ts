import { Language } from 'lx/src/features/language/constants'
import { deviceAccessTimeoutToMinutes } from 'lx/src/features/settings/constants'
import { LXState } from 'lx/src/state/lxReducer'

export const selectWalletHideSmallBalancesSetting = (state: LXState): boolean =>
  state.userSettings.hideSmallBalances

export const selectWalletHideSpamTokensSetting = (state: LXState): boolean => state.userSettings.hideSpamTokens

export const selectWalletHideReportedActivitySetting = (state: LXState): boolean =>
  state.userSettings.hideReportedActivity ?? true

export const selectCurrentLanguage = (state: LXState): Language => state.userSettings.currentLanguage

export const selectIsTestnetModeEnabled = (state: LXState): boolean =>
  state.userSettings.isTestnetModeEnabled ?? false

export const selectDeviceAccessTimeoutMinutes = (state: LXState): number | undefined =>
  deviceAccessTimeoutToMinutes(state.userSettings.deviceAccessTimeout)
