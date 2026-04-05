import { useQuery } from '@tanstack/react-query'
<<<<<<< HEAD
import { DynamicConfigs, ExtensionBiometricUnlockConfigKey, useDynamicConfigValue } from '@luxfi/gating'
=======
import { DynamicConfigs, ExtensionBiometricUnlockConfigKey, useDynamicConfigValue } from '@universe/gating'
>>>>>>> upstream/main
import { useTranslation } from 'react-i18next'
import { builtInBiometricCapabilitiesQuery } from 'src/app/utils/device/builtInBiometricCapabilitiesQuery'

export function useShouldShowBiometricUnlockEnrollment({ flow }: { flow: 'onboarding' | 'settings' }): boolean {
  const { t } = useTranslation()

  const isEnabled = useDynamicConfigValue({
    config: DynamicConfigs.ExtensionBiometricUnlock,
    key:
      flow === 'onboarding'
        ? ExtensionBiometricUnlockConfigKey.EnableOnboardingEnrollment
        : ExtensionBiometricUnlockConfigKey.EnableSettingsEnrollment,
    defaultValue: false,
  })

  const { data: biometricCapabilities } = useQuery(builtInBiometricCapabilitiesQuery({ t }))

  const shouldShowBiometricUnlockEnrollment = isEnabled && Boolean(biometricCapabilities?.hasBuiltInBiometricSensor)
  return shouldShowBiometricUnlockEnrollment
}
