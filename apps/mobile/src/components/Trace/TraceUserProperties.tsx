import { useQuery } from '@tanstack/react-query'
<<<<<<< HEAD
import { provideLuxIdentifierService } from '@l.x/api'
import { lxIdentifierQuery } from '@l.x/sessions'
=======
import { provideUniswapIdentifierService } from '@universe/api'
import { uniswapIdentifierQuery } from '@universe/sessions'
>>>>>>> upstream/main
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
<<<<<<< HEAD
import { useIsDarkMode } from '@l.x/ui/src'
import { useEnabledChains } from '@l.x/lx/src/features/chains/hooks/useEnabledChains'
import { useAppFiatCurrency } from '@l.x/lx/src/features/fiatCurrency/hooks'
import { useCurrentLanguageInfo } from '@l.x/lx/src/features/language/hooks'
import { useHideSmallBalancesSetting, useHideSpamTokensSetting } from '@l.x/lx/src/features/settings/hooks'
import { MobileUserPropertyName, setUserProperty } from '@l.x/lx/src/features/telemetry/user'
import { logger } from '@l.x/utils/src/logger/logger'
import { isAndroid } from '@l.x/utils/src/platform'
// biome-ignore lint/style/noRestrictedImports: Required for analytics user properties
import { analytics } from '@l.x/utils/src/telemetry/analytics/analytics'
import { useAccountBalances } from '@luxfi/wallet/src/features/accounts/useAccountListData'
import { useGatingUserPropertyUsernames } from '@luxfi/wallet/src/features/gating/userPropertyHooks'
import { selectAllowAnalytics } from '@luxfi/wallet/src/features/telemetry/selectors'
import { BackupType } from '@luxfi/wallet/src/features/wallet/accounts/types'
import { hasBackup } from '@luxfi/wallet/src/features/wallet/accounts/utils'
=======
import { useIsDarkMode } from 'ui/src'
import { useEnabledChains } from 'uniswap/src/features/chains/hooks/useEnabledChains'
import { useAppFiatCurrency } from 'uniswap/src/features/fiatCurrency/hooks'
import { useCurrentLanguageInfo } from 'uniswap/src/features/language/hooks'
import { useHideSmallBalancesSetting, useHideSpamTokensSetting } from 'uniswap/src/features/settings/hooks'
import { MobileUserPropertyName, setUserProperty } from 'uniswap/src/features/telemetry/user'
import { logger } from 'utilities/src/logger/logger'
import { isAndroid } from 'utilities/src/platform'
// oxlint-disable-next-line no-restricted-imports -- Required for analytics user properties
import { analytics } from 'utilities/src/telemetry/analytics/analytics'
import { useAccountBalances } from 'wallet/src/features/accounts/useAccountListData'
import { useGatingUserPropertyUsernames } from 'wallet/src/features/gating/userPropertyHooks'
import { selectAllowAnalytics } from 'wallet/src/features/telemetry/selectors'
import { BackupType } from 'wallet/src/features/wallet/accounts/types'
import { hasBackup } from 'wallet/src/features/wallet/accounts/utils'
>>>>>>> upstream/main
import {
  useActiveAccount,
  useSignerAccounts,
  useSwapProtectionSetting,
  useViewOnlyAccounts,
<<<<<<< HEAD
} from '@luxfi/wallet/src/features/wallet/hooks'
import { Keyring } from '@luxfi/wallet/src/features/wallet/Keyring/Keyring'
import { selectFinishedOnboarding } from '@luxfi/wallet/src/features/wallet/selectors'
=======
} from 'wallet/src/features/wallet/hooks'
import { Keyring } from 'wallet/src/features/wallet/Keyring/Keyring'
import { selectFinishedOnboarding } from 'wallet/src/features/wallet/selectors'
>>>>>>> upstream/main

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

<<<<<<< HEAD
  const { data: luxIdentifier } = useQuery(lxIdentifierQuery(provideLuxIdentifierService))

  useGatingUserPropertyUsernames()

  // biome-ignore lint/correctness/useExhaustiveDependencies: we want to run this when allowAnalytics changes
=======
  const { data: uniswapIdentifier } = useQuery(uniswapIdentifierQuery(provideUniswapIdentifierService))

  useGatingUserPropertyUsernames()

  // oxlint-disable-next-line react/exhaustive-deps -- we want to run this when allowAnalytics changes
>>>>>>> upstream/main
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

<<<<<<< HEAD
  // biome-ignore lint/correctness/useExhaustiveDependencies: we want to run this when finishedOnboarding changes
=======
  // oxlint-disable-next-line react/exhaustive-deps -- we want to run this when finishedOnboarding changes
>>>>>>> upstream/main
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
<<<<<<< HEAD
    setDatadogUserWithUniqueId(activeAccount?.address, luxIdentifier)
  }, [activeAccount?.address, luxIdentifier])

  // Set user properties for amplitude

  // biome-ignore lint/correctness/useExhaustiveDependencies: we want to run this also when allowAnalytics changes
=======
    setDatadogUserWithUniqueId(activeAccount?.address, uniswapIdentifier)
  }, [activeAccount?.address, uniswapIdentifier])

  // Set user properties for amplitude

  // oxlint-disable-next-line react/exhaustive-deps -- we want to run this also when allowAnalytics changes
>>>>>>> upstream/main
  useEffect(() => {
    setUserProperty(MobileUserPropertyName.WalletSwapProtectionSetting, swapProtectionSetting)
  }, [allowAnalytics, swapProtectionSetting])

<<<<<<< HEAD
  // biome-ignore lint/correctness/useExhaustiveDependencies: we want to run this also when allowAnalytics changes
=======
  // oxlint-disable-next-line react/exhaustive-deps -- we want to run this also when allowAnalytics changes
>>>>>>> upstream/main
  useEffect(() => {
    setUserProperty(MobileUserPropertyName.DarkMode, isDarkMode)
  }, [allowAnalytics, isDarkMode])

  useEffect(() => {
    setUserProperty(MobileUserPropertyName.WindowHeight, windowHeight)
    setUserProperty(MobileUserPropertyName.WindowWidth, windowWidth)
  }, [windowWidth, windowHeight])

<<<<<<< HEAD
  // biome-ignore lint/correctness/useExhaustiveDependencies: we want to run this also when allowAnalytics changes
=======
  // oxlint-disable-next-line react/exhaustive-deps -- we want to run this also when allowAnalytics changes
>>>>>>> upstream/main
  useEffect(() => {
    setUserProperty(MobileUserPropertyName.WalletSignerCount, signerAccountAddresses.length)
    setUserProperty(MobileUserPropertyName.WalletSignerAccounts, signerAccountAddresses)
  }, [allowAnalytics, signerAccountAddresses])

<<<<<<< HEAD
  // biome-ignore lint/correctness/useExhaustiveDependencies: we want to run this also when allowAnalytics changes
=======
  // oxlint-disable-next-line react/exhaustive-deps -- we want to run this also when allowAnalytics changes
>>>>>>> upstream/main
  useEffect(() => {
    setUserProperty(MobileUserPropertyName.WalletViewOnlyCount, viewOnlyAccounts.length)
  }, [allowAnalytics, viewOnlyAccounts])

<<<<<<< HEAD
  // biome-ignore lint/correctness/useExhaustiveDependencies: we want to run this also when allowAnalytics changes
=======
  // oxlint-disable-next-line react/exhaustive-deps -- we want to run this also when allowAnalytics changes
>>>>>>> upstream/main
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

<<<<<<< HEAD
  // biome-ignore lint/correctness/useExhaustiveDependencies: we want to run this also when allowAnalytics changes
=======
  // oxlint-disable-next-line react/exhaustive-deps -- we want to run this also when allowAnalytics changes
>>>>>>> upstream/main
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

<<<<<<< HEAD
  // biome-ignore lint/correctness/useExhaustiveDependencies: we want to run this also when allowAnalytics changes
=======
  // oxlint-disable-next-line react/exhaustive-deps -- we want to run this also when allowAnalytics changes
>>>>>>> upstream/main
  useEffect(() => {
    setUserProperty(MobileUserPropertyName.Language, currentLanguage)
  }, [allowAnalytics, currentLanguage])

<<<<<<< HEAD
  // biome-ignore lint/correctness/useExhaustiveDependencies: we want to run this also when allowAnalytics changes
=======
  // oxlint-disable-next-line react/exhaustive-deps -- we want to run this also when allowAnalytics changes
>>>>>>> upstream/main
  useEffect(() => {
    setUserProperty(MobileUserPropertyName.Currency, currentFiatCurrency)
  }, [allowAnalytics, currentFiatCurrency])

<<<<<<< HEAD
  // biome-ignore lint/correctness/useExhaustiveDependencies: we want to run this also when allowAnalytics changes
=======
  // oxlint-disable-next-line react/exhaustive-deps -- we want to run this also when allowAnalytics changes
>>>>>>> upstream/main
  useEffect(() => {
    setUserProperty(MobileUserPropertyName.TestnetModeEnabled, isTestnetModeEnabled)
  }, [allowAnalytics, isTestnetModeEnabled])

  useEffect(() => {
    OneSignal.User.addTag(OneSignalUserTagField.AccountIsUnfunded, signerAccountsTotalBalance === 0 ? 'true' : 'false')
  }, [signerAccountsTotalBalance])

  return null
}
