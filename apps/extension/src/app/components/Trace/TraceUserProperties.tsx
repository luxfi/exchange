import { datadogRum } from '@datadog/browser-rum'
import { useQuery } from '@tanstack/react-query'
<<<<<<< HEAD
import { provideLuxIdentifierService } from '@l.x/api'
import { luxIdentifierQuery } from '@l.x/sessions'
import { useEffect } from 'react'
import { useIsDarkMode } from '@l.x/ui/src'
import { DisplayNameType } from '@l.x/lx/src/features/accounts/types'
import { useEnabledChains } from '@l.x/lx/src/features/chains/hooks/useEnabledChains'
import { useAppFiatCurrencyInfo } from '@l.x/lx/src/features/fiatCurrency/hooks'
import { useCurrentLanguage } from '@l.x/lx/src/features/language/hooks'
import { useHideSmallBalancesSetting, useHideSpamTokensSetting } from '@l.x/lx/src/features/settings/hooks'
import { ExtensionUserPropertyName, setUserProperty } from '@l.x/lx/src/features/telemetry/user'
// biome-ignore lint/style/noRestrictedImports: Direct analytics import required for user property tracking
import { analytics } from '@l.x/utils/src/telemetry/analytics/analytics'
import { useGatingUserPropertyUsernames } from '@luxfi/wallet/src/features/gating/userPropertyHooks'
=======
import { provideUniswapIdentifierService } from '@universe/api'
import { uniswapIdentifierQuery } from '@universe/sessions'
import { useEffect } from 'react'
import { useIsDarkMode } from 'ui/src'
import { DisplayNameType } from 'uniswap/src/features/accounts/types'
import { useEnabledChains } from 'uniswap/src/features/chains/hooks/useEnabledChains'
import { useAppFiatCurrencyInfo } from 'uniswap/src/features/fiatCurrency/hooks'
import { useCurrentLanguage } from 'uniswap/src/features/language/hooks'
import { useHideSmallBalancesSetting, useHideSpamTokensSetting } from 'uniswap/src/features/settings/hooks'
import { ExtensionUserPropertyName, setUserProperty } from 'uniswap/src/features/telemetry/user'
// oxlint-disable-next-line no-restricted-imports -- Direct analytics import required for user property tracking
import { analytics } from 'utilities/src/telemetry/analytics/analytics'
import { useGatingUserPropertyUsernames } from 'wallet/src/features/gating/userPropertyHooks'
>>>>>>> upstream/main
import {
  useActiveAccount,
  useDisplayName,
  useSignerAccounts,
  useViewOnlyAccounts,
<<<<<<< HEAD
} from '@luxfi/wallet/src/features/wallet/hooks'
=======
} from 'wallet/src/features/wallet/hooks'
>>>>>>> upstream/main

/** Component that tracks UserProperties during the lifetime of the app */
export function TraceUserProperties(): null {
  const isDarkMode = useIsDarkMode()
  const viewOnlyAccounts = useViewOnlyAccounts()
  const activeAccount = useActiveAccount()
  const signerAccounts = useSignerAccounts()
  const hideSmallBalances = useHideSmallBalancesSetting()
  const hideSpamTokens = useHideSpamTokensSetting()
  const currentLanguage = useCurrentLanguage()
  const appFiatCurrencyInfo = useAppFiatCurrencyInfo()
  const { isTestnetModeEnabled } = useEnabledChains()
  const displayName = useDisplayName(activeAccount?.address)

<<<<<<< HEAD
  const { data: luxIdentifier } = useQuery(luxIdentifierQuery(provideLuxIdentifierService))
=======
  const { data: uniswapIdentifier } = useQuery(uniswapIdentifierQuery(provideUniswapIdentifierService))
>>>>>>> upstream/main

  useGatingUserPropertyUsernames()

  // Set user properties for datadog

  useEffect(() => {
    datadogRum.setUserProperty(ExtensionUserPropertyName.ActiveWalletAddress, activeAccount?.address)
  }, [activeAccount?.address])

  useEffect(() => {
<<<<<<< HEAD
    if (luxIdentifier) {
      datadogRum.setUserProperty(ExtensionUserPropertyName.LuxIdentifier, luxIdentifier)
    }
  }, [luxIdentifier])
=======
    if (uniswapIdentifier) {
      datadogRum.setUserProperty(ExtensionUserPropertyName.UniswapIdentifier, uniswapIdentifier)
    }
  }, [uniswapIdentifier])
>>>>>>> upstream/main

  // Set user properties for amplitude

  useEffect(() => {
    setUserProperty(ExtensionUserPropertyName.AppVersion, chrome.runtime.getManifest().version)
    return () => {
      analytics.flushEvents()
    }
  }, [])

  useEffect(() => {
    setUserProperty(ExtensionUserPropertyName.DarkMode, isDarkMode)
  }, [isDarkMode])

  useEffect(() => {
    setUserProperty(ExtensionUserPropertyName.WalletSignerCount, signerAccounts.length)
    setUserProperty(
      ExtensionUserPropertyName.WalletSignerAccounts,
      signerAccounts.map((account) => account.address),
    )
  }, [signerAccounts])

  useEffect(() => {
    setUserProperty(ExtensionUserPropertyName.WalletViewOnlyCount, viewOnlyAccounts.length)
  }, [viewOnlyAccounts])

  useEffect(() => {
    if (!activeAccount) {
      return
    }
    if (activeAccount.backups) {
      setUserProperty(ExtensionUserPropertyName.BackupTypes, activeAccount.backups)
    }
    setUserProperty(ExtensionUserPropertyName.ActiveWalletAddress, activeAccount.address)
    setUserProperty(ExtensionUserPropertyName.ActiveWalletType, activeAccount.type)
    setUserProperty(ExtensionUserPropertyName.IsHideSmallBalancesEnabled, hideSmallBalances)
    setUserProperty(ExtensionUserPropertyName.IsHideSpamTokensEnabled, hideSpamTokens)
  }, [activeAccount, hideSmallBalances, hideSpamTokens])

  useEffect(() => {
    setUserProperty(ExtensionUserPropertyName.Language, currentLanguage)
  }, [currentLanguage])

  useEffect(() => {
    setUserProperty(ExtensionUserPropertyName.Currency, appFiatCurrencyInfo.code)
  }, [appFiatCurrencyInfo])

  useEffect(() => {
    setUserProperty(ExtensionUserPropertyName.TestnetModeEnabled, isTestnetModeEnabled)
  }, [isTestnetModeEnabled])

  // Log ENS and Unitag ownership for user usage stats
  useEffect(() => {
    switch (displayName?.type) {
      case DisplayNameType.ENS:
        setUserProperty(ExtensionUserPropertyName.HasLoadedENS, true)
        return
      case DisplayNameType.Unitag:
        setUserProperty(ExtensionUserPropertyName.HasLoadedUnitag, true)
        return
      default:
        return
    }
  }, [displayName?.type])

  return null
}
