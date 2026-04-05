import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React from 'react'
import { SettingsStackParamList } from 'src/app/navigation/types'
import { Screen } from 'src/components/layout/Screen'
import { ConnectedDappsList } from 'src/components/Requests/ConnectedDapps/ConnectedDappsList'
import { useWalletConnect } from 'src/features/walletConnect/useWalletConnect'
<<<<<<< HEAD
import { MobileScreens } from '@l.x/lx/src/types/screens/mobile'
=======
import { MobileScreens } from 'uniswap/src/types/screens/mobile'
>>>>>>> upstream/main

type Props = NativeStackScreenProps<SettingsStackParamList, MobileScreens.SettingsWalletManageConnection>

export function SettingsWalletManageConnection({
  route: {
    params: { address },
  },
}: Props): JSX.Element {
  const { sessions } = useWalletConnect(address)

  return (
    <Screen>
      <ConnectedDappsList sessions={sessions} />
    </Screen>
  )
}
