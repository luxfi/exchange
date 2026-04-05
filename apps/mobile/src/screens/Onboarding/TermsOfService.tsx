import { Trans } from 'react-i18next'
<<<<<<< HEAD
import { Text } from '@l.x/ui/src'
import { lxUrls } from '@l.x/lx/src/constants/urls'
import { openUri } from '@l.x/lx/src/utils/linking'
=======
import { Text } from 'ui/src'
import { uniswapUrls } from 'uniswap/src/constants/urls'
import { openUri } from 'uniswap/src/utils/linking'
>>>>>>> upstream/main

export function TermsOfService(): JSX.Element {
  return (
    <Text color="$neutral2" mx="$spacing4" textAlign="center" variant="body4">
      <Trans
        components={{
          highlightTerms: (
            <Text
              key="terms-of-service"
              color="$accent1"
              variant="body4"
<<<<<<< HEAD
              onPress={(): Promise<void> => openUri({ uri: lxUrls.termsOfServiceUrl })}
=======
              onPress={(): Promise<void> => openUri({ uri: uniswapUrls.termsOfServiceUrl })}
>>>>>>> upstream/main
            />
          ),
          highlightPrivacy: (
            <Text
              key="privacy-policy"
              color="$accent1"
              variant="body4"
<<<<<<< HEAD
              onPress={(): Promise<void> => openUri({ uri: lxUrls.privacyPolicyUrl })}
=======
              onPress={(): Promise<void> => openUri({ uri: uniswapUrls.privacyPolicyUrl })}
>>>>>>> upstream/main
            />
          ),
        }}
        i18nKey="onboarding.termsOfService"
      />
    </Text>
  )
}
