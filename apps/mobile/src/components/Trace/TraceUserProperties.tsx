import { useQuery } from '@tanstack/react-query'
import { provideLuxIdentifierService } from '@l.x/api'
import { luxIdentifierQuery } from '@l.x/sessions'
import { useEffect, useMemo } from 'react'
import { NativeModules, useWindowDimensions } from 'react-native'
import { OneSignal } from 'react-native-onesignal'
import { useSelector } from 'react-redux'
import { useBiometricAppSettings } from 'src/features/biometrics/useBiometricAppSettings'
import { useDeviceSupportsBiometricAuth } from 'src/features/biometrics/useDeviceSupportsBiometricAuth'
import { setDatadogUserWithUniqueId } from 'src/features/datadog/user'
import { OneSignalUserTagField } from 'src/features/notifications/constants'
import { getAuthMethod } from 'src/features/telemetry/utils'
import { getFullAppVersion } from 'src/utils/version'
import { useIsDarkMode } from '@luxfi/ui/src'
import { useEnabledChains } from '@l.x/lx/src/features/chains/hooks/useEnabledChains'
import { useAppFiatCurrency } from '@l.x/lx/src/features/fiatCurrency/hooks'
import { useCurrentLanguageInfo } from '@l.x/lx/src/features/language/hooks'
import { useHideSmallBalancesSetting, useHideSpamTokensSetting } from '@l.x/lx/src/features/settings/hooks'
import { MobileUserPropertyName, setUserProperty } from '@l.x/lx/src/features/telemetry/user'
import { logger } from '@luxfi/utilities/src/logger/logger'
import { isAndroid } from '@luxfi/utilities/src/platform'
// biome-ignore lint/style/noRestrictedImports: Required for analytics user properties
import { analytics } from '@luxfi/utilities/src/telemetry/analytics/analytics'
import { useAccountBalances } from '@luxfi/wallet/src/features/accounts/useAccountListData'
import { useGatingUserPropertyUsernames } from '@luxfi/wallet/src/features/gating/userPropertyHooks'
import { selectAllowAnalytics } from '@luxfi/wallet/src/features/telemetry/selectors'
import { BackupType } from '@luxfi/wallet/src/features/wallet/accounts/types'
import { hasBackup } from '@luxfi/wallet/src/features/wallet/accounts/utils'
import {
  useActiveAccount,
  useSignerAccounts,
  useSwapProtectionSetting,
  useViewOnlyAccounts,
} from '@luxfi/wallet/src/features/wallet/hooks'
import { Keyring } from '@luxfi/wallet/src/features/wallet/Keyring/Keyring'
import { selectFinishedOnboarding } from '@luxfi/wallet/src/features/wallet/selectors'

/** Component that tracks UserProperties during the lifetime of the app */
export function TraceUserProperties(): null {
  const isDarkMode = useIsDarkMode()
  const { width: windowWidth, height: windowHeight } = useWindowDimensions()
  const viewOnlyAccounts = useViewOnlyAccounts()
  const activeAccount = useActiveAccount()
  const signerAccounts = useSignerAccounts()
  const biometricsAppSettingsState = useBiometricAppSettings()
  const { touchId, faceId } = useDeviceSupportsBiometricAuth()
  const swapProtectionSetting = useSwapProtectionSetting()
  const currentLanguage = useCurrentLanguageInfo().loggingName
  const currentFiatCurrency = useAppFiatCurrency()
  const hideSpamTokens = useHideSpamTokensSetting()
  const hideSmallBalances = useHideSmallBalancesSetting()
  const { isTestnetModeEnabled } = useEnabledChains()
  const finishedOnboarding = useSelector(selectFinishedOnboarding)

  const signerAccountAddresses = useMemo(() => signerAccounts.map((account) => account.address), [signerAccounts])
  const { totalBalance: signerAccountsTotalBalance } = useAccountBalances({
    addresses: signerAccountAddresses,
    fetchPolicy: 'cache-first',
  })

  // Effects must check this and ensure they are setting properties for when analytics is reenabled
  const allowAnalytics = useSelector(selectAllowAnalytics)

  const { data: luxIdentifier } = useQuery(luxIdentifierQuery(provideLuxIdentifierService))

  useGatingUserPropertyUsernames()

  // biome-ignore lint/correctness/useExhaustiveDependencies: we want to run this when allowAnalytics changes
  useEffect(() => {
    setUserProperty(MobileUserPropertyName.AppVersion, getFullAppVersion())
    if (isAndroid) {
      NativeModules['AndroidDeviceModule'].getPerformanceClass().then((perfClass: number) => {
        setUserProperty(MobileUserPropertyName.AndroidPerfClass, perfClass)
      })
    }
    return () => {
      analytics.flushEvents()
    }
  }, [allowAnalytics])

  // biome-ignore lint/correctness/useExhaustiveDependencies: we want to run this when finishedOnboarding changes
  useEffect(() => {
    const fetchKeyringData = async (): Promise<void> => {
      const mnemonicIds = await Keyring.getMnemonicIds()
      setUserProperty(MobileUserPropertyName.MnemonicCount, mnemonicIds.length)
      const privateKeyAddresses = await Keyring.getAddressesForStoredPrivateKeys()
      setUserProperty(MobileUserPropertyName.PrivateKeyCount, privateKeyAddresses.length)
    }
    fetchKeyringData().catch((error) => {
      logger.error(error, {
        tags: { file: 'TraceUserProperties.tsx', function: 'fetchKeyringData' },
      })
    })
  }, [finishedOnboarding])

  // Set user properties for datadog

  useEffect(() => {
    setDatadogUserWithUniqueId(activeAccount?.address, luxIdentifier)
  }, [activeAccount?.address, luxIdentifier])

  // Set user properties for amplitude

  // biome-ignore lint/correctness/useExhaustiveDependencies: we want to run this also when allowAnalytics changes
  useEffect(() => {
    setUserProperty(MobileUserPropertyName.WalletSwapProtectionSetting, swapProtectionSetting)
  }, [allowAnalytics, swapProtectionSetting])

  // biome-ignore lint/correctness/useExhaustiveDependencies: we want to run this also when allowAnalytics changes
  useEffect(() => {
    setUserProperty(MobileUserPropertyName.DarkMode, isDarkMode)
  }, [allowAnalytics, isDarkMode])

  useEffect(() => {
    setUserProperty(MobileUserPropertyName.WindowHeight, windowHeight)
    setUserProperty(MobileUserPropertyName.WindowWidth, windowWidth)
  }, [windowWidth, windowHeight])

  // biome-ignore lint/correctness/useExhaustiveDependencies: we want to run this also when allowAnalytics changes
  useEffect(() => {
    setUserProperty(MobileUserPropertyName.WalletSignerCount, signerAccountAddresses.length)
    setUserProperty(MobileUserPropertyName.WalletSignerAccounts, signerAccountAddresses)
  }, [allowAnalytics, signerAccountAddresses])

  // biome-ignore lint/correctness/useExhaustiveDependencies: we want to run this also when allowAnalytics changes
  useEffect(() => {
    setUserProperty(MobileUserPropertyName.WalletViewOnlyCount, viewOnlyAccounts.length)
  }, [allowAnalytics, viewOnlyAccounts])

  // biome-ignore lint/correctness/useExhaustiveDependencies: we want to run this also when allowAnalytics changes
  useEffect(() => {
    if (!activeAccount) {
      return
    }
    if (activeAccount.backups) {
      setUserProperty(MobileUserPropertyName.BackupTypes, activeAccount.backups)
    }
    setUserProperty(MobileUserPropertyName.ActiveWalletAddress, activeAccount.address)
    setUserProperty(MobileUserPropertyName.ActiveWalletType, activeAccount.type)
    setUserProperty(MobileUserPropertyName.IsCloudBackedUp, hasBackup(BackupType.Cloud, activeAccount))
    setUserProperty(MobileUserPropertyName.IsPushEnabled, Boolean(activeAccount.pushNotificationsEnabled))
    setUserProperty(MobileUserPropertyName.IsHideSmallBalancesEnabled, hideSmallBalances)
    setUserProperty(MobileUserPropertyName.IsHideSpamTokensEnabled, hideSpamTokens)
  }, [allowAnalytics, activeAccount, hideSmallBalances, hideSpamTokens])

  // biome-ignore lint/correctness/useExhaustiveDependencies: we want to run this also when allowAnalytics changes
  useEffect(() => {
    setUserProperty(
      MobileUserPropertyName.AppOpenAuthMethod,
      getAuthMethod({
        isSettingEnabled: biometricsAppSettingsState.requiredForAppAccess,
        isTouchIdSupported: touchId,
        isFaceIdSupported: faceId,
      }),
    )
    setUserProperty(
      MobileUserPropertyName.TransactionAuthMethod,
      getAuthMethod({
        isSettingEnabled: biometricsAppSettingsState.requiredForTransactions,
        isTouchIdSupported: touchId,
        isFaceIdSupported: faceId,
      }),
    )
  }, [allowAnalytics, biometricsAppSettingsState, touchId, faceId])

  // biome-ignore lint/correctness/useExhaustiveDependencies: we want to run this also when allowAnalytics changes
  useEffect(() => {
    setUserProperty(MobileUserPropertyName.Language, currentLanguage)
  }, [allowAnalytics, currentLanguage])

  // biome-ignore lint/correctness/useExhaustiveDependencies: we want to run this also when allowAnalytics changes
  useEffect(() => {
    setUserProperty(MobileUserPropertyName.Currency, currentFiatCurrency)
  }, [allowAnalytics, currentFiatCurrency])

  // biome-ignore lint/correctness/useExhaustiveDependencies: we want to run this also when allowAnalytics changes
  useEffect(() => {
    setUserProperty(MobileUserPropertyName.TestnetModeEnabled, isTestnetModeEnabled)
  }, [allowAnalytics, isTestnetModeEnabled])

  useEffect(() => {
    OneSignal.User.addTag(OneSignalUserTagField.AccountIsUnfunded, signerAccountsTotalBalance === 0 ? 'true' : 'false')
  }, [signerAccountsTotalBalance])

  return null
}
