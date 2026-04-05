import { RouteProp } from '@react-navigation/core'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React from 'react'
import { OnboardingStackParamList } from 'src/app/navigation/types'
import { RestoreCloudBackupPasswordScreen } from 'src/screens/Import/RestoreCloudBackupPasswordScreen'
import { render } from 'src/test/test-utils'
<<<<<<< HEAD
import { OnboardingScreens } from '@l.x/lx/src/types/screens/mobile'
import { GuiProvider } from '@luxfi/wallet/src/providers/gui-provider'
=======
import { OnboardingScreens } from 'uniswap/src/types/screens/mobile'
import { TamaguiProvider } from 'wallet/src/providers/tamagui-provider'
>>>>>>> upstream/main

const setOptionsSpy = jest.fn()
const routeProp = { params: {} } as RouteProp<OnboardingStackParamList, OnboardingScreens.RestoreCloudBackupPassword>

describe(RestoreCloudBackupPasswordScreen, () => {
  it('renders correctly', () => {
    const tree = render(
<<<<<<< HEAD
      <GuiProvider>
=======
      <TamaguiProvider>
>>>>>>> upstream/main
        <RestoreCloudBackupPasswordScreen
          navigation={
            {
              getState: () => ({
                index: 0,
              }),
              setOptions: setOptionsSpy,
            } as unknown as NativeStackNavigationProp<
              OnboardingStackParamList,
              OnboardingScreens.RestoreCloudBackupPassword,
              undefined
            >
          }
          route={routeProp}
        />
<<<<<<< HEAD
      </GuiProvider>,
=======
      </TamaguiProvider>,
>>>>>>> upstream/main
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })
})
