import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React from 'react'
import { OnboardingStackParamList } from 'src/app/navigation/types'
import { Screen } from 'src/components/layout/Screen'
import { CloudBackupProcessingAnimation } from 'src/features/CloudBackup/CloudBackupProcessingAnimation'
<<<<<<< HEAD
import { OnboardingEntryPoint } from '@l.x/lx/src/types/onboarding'
import { OnboardingScreens } from '@l.x/lx/src/types/screens/mobile'
=======
import { OnboardingEntryPoint } from 'uniswap/src/types/onboarding'
import { OnboardingScreens } from 'uniswap/src/types/screens/mobile'
>>>>>>> upstream/main

type Props = NativeStackScreenProps<OnboardingStackParamList, OnboardingScreens.BackupCloudProcessing>

/** Screen to perform secure recovery phrase backup to Cloud  */
export function CloudBackupProcessingScreen({ navigation, route: { params } }: Props): JSX.Element | null {
  const { password, importType, entryPoint, address } = params

  const onBackupComplete = (): void => {
    if (entryPoint === OnboardingEntryPoint.BackupCard) {
      navigation.navigate({
        name: OnboardingScreens.BackupManual,
        params: { ...params, fromCloudBackup: true },
        merge: true,
      })
    } else {
      navigation.navigate({
        name: OnboardingScreens.Notifications,
        params: { importType, entryPoint },
        merge: true,
      })
    }
  }

  const onErrorPress = (): void => {
    navigation.navigate({
      name: OnboardingScreens.Backup,
      params: { importType, entryPoint },
      merge: true,
    })
  }

  return (
    <Screen>
      <CloudBackupProcessingAnimation
        accountAddress={address}
        navigation={navigation}
        password={password}
        onBackupComplete={onBackupComplete}
        onErrorPress={onErrorPress}
      />
    </Screen>
  )
}
