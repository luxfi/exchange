import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { OnboardingStackParamList } from 'src/app/navigation/types'
import { CloudBackupPassword } from 'src/features/CloudBackup/CloudBackupForm/CloudBackupPassword'
import { BackupSpeedBumpModal } from 'src/features/onboarding/BackupSpeedBumpModal'
import { SafeKeyboardOnboardingScreen } from 'src/features/onboarding/SafeKeyboardOnboardingScreen'
<<<<<<< HEAD
import { Flex } from '@l.x/ui/src'
import { Cloud } from '@l.x/ui/src/components/icons'
import { OnboardingEntryPoint } from '@l.x/lx/src/types/onboarding'
import { OnboardingScreens } from '@l.x/lx/src/types/screens/mobile'
import { dismissNativeKeyboard } from '@l.x/utils/src/device/keyboard/dismissNativeKeyboard'
import { BackupType } from '@luxfi/wallet/src/features/wallet/accounts/types'
=======
import { Flex } from 'ui/src'
import { Cloud } from 'ui/src/components/icons'
import { OnboardingEntryPoint } from 'uniswap/src/types/onboarding'
import { OnboardingScreens } from 'uniswap/src/types/screens/mobile'
import { dismissNativeKeyboard } from 'utilities/src/device/keyboard/dismissNativeKeyboard'
import { BackupType } from 'wallet/src/features/wallet/accounts/types'
>>>>>>> upstream/main

export function CloudBackupPasswordConfirmScreen({
  navigation,
  route: { params },
}: NativeStackScreenProps<OnboardingStackParamList, OnboardingScreens.BackupCloudPasswordConfirm>): JSX.Element {
  const { t } = useTranslation()

  const { password, entryPoint } = params

  const [showSpeedBumpModal, setShowSpeedBumpModal] = useState(false)

  const onboardingExperimentEnabled = entryPoint === OnboardingEntryPoint.BackupCard

  const navigateToNextScreen = useCallback((): void => {
    setShowSpeedBumpModal(false)
    navigation.navigate({
      name: OnboardingScreens.BackupCloudProcessing,
      params,
      merge: true,
    })
  }, [navigation, params])

  return (
    <CloudBackupPassword.FormProvider
      isConfirmation
      checkPasswordBeforeSubmit={onboardingExperimentEnabled}
      navigateToNextScreen={navigateToNextScreen}
      passwordToConfirm={password}
    >
      <SafeKeyboardOnboardingScreen
        Icon={Cloud}
        footer={
          <Flex mx="$spacing16" my="$spacing12">
            <CloudBackupPassword.ContinueButton
              onPressContinue={
                onboardingExperimentEnabled
                  ? (): void => {
                      dismissNativeKeyboard()
                      setShowSpeedBumpModal(true)
                    }
                  : undefined
              }
            />
          </Flex>
        }
        subtitle={t('onboarding.cloud.confirm.description')}
        title={t('onboarding.cloud.confirm.title')}
      >
        <CloudBackupPassword.PasswordInput />

        {onboardingExperimentEnabled && showSpeedBumpModal && (
          <BackupSpeedBumpModal
            backupType={BackupType.Cloud}
            onClose={() => setShowSpeedBumpModal(false)}
            onContinue={navigateToNextScreen}
          />
        )}
      </SafeKeyboardOnboardingScreen>
    </CloudBackupPassword.FormProvider>
  )
}
