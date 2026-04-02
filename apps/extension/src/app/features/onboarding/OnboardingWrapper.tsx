import { useEffect, useState } from 'react'
import { Outlet } from 'react-router'
import { DevMenuModal } from 'src/app/core/DevMenuModal'
import { StorageWarningModal } from 'src/app/features/warnings/StorageWarningModal'
import { onboardingMessageChannel } from 'src/background/messagePassing/messageChannels'
import { OnboardingMessageType } from 'src/background/messagePassing/types/ExtensionMessages'
import { ONBOARDING_BACKGROUND_DARK, ONBOARDING_BACKGROUND_LIGHT } from 'src/public/assets'
import { Flex, Image, useIsDarkMode } from '@luxfi/ui/src'
import { isProdEnv } from '@luxfi/utilities/src/environment/env'
import { OnboardingContextProvider } from '@luxfi/wallet/src/features/onboarding/OnboardingContext'
import { useTestnetModeForLoggingAndAnalytics } from '@luxfi/wallet/src/features/testnetMode/hooks/useTestnetModeForLoggingAndAnalytics'

export function OnboardingWrapper(): JSX.Element {
  const isDarkMode = useIsDarkMode()
  const [isHighlighted, setIsHighlighted] = useState(false)

  useTestnetModeForLoggingAndAnalytics()

  useEffect(() => {
    return onboardingMessageChannel.addMessageListener(OnboardingMessageType.HighlightOnboardingTab, (_message) => {
      // When the onboarding tab regains focus, we do a quick background change to bring attention to it.
      // Otherwise, the user might not notice that the tab is now active, specially if the tab is on a different monitor.
      setIsHighlighted(true)
      setTimeout(() => setIsHighlighted(false), 200)
    })
  }, [])

  return (
    <OnboardingContextProvider>
      {!isProdEnv() && <DevMenuModal />}
      <StorageWarningModal isOnboarding={true} />

      <Flex
        alignItems="center"
        backgroundColor={isHighlighted ? '$DEP_accentSoft' : '$transparent'}
        justifyContent="center"
        minHeight="100vh"
        width="100%"
      >
        {/* TODO: Update this to use the new background asset with varying blur level */}
        {!isHighlighted && (
          <Image
            height="100%"
            position="absolute"
            resizeMode="cover"
            source={isDarkMode ? ONBOARDING_BACKGROUND_DARK : ONBOARDING_BACKGROUND_LIGHT}
            width="100%"
          />
        )}
        <Outlet />
      </Flex>
    </OnboardingContextProvider>
  )
}
