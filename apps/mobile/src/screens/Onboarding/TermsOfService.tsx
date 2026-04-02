import { Trans } from 'react-i18next'
import { Text } from '@luxfi/ui/src'
import { lxUrls } from '@l.x/lx/src/constants/urls'
import { openUri } from '@l.x/lx/src/utils/linking'

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
              onPress={(): Promise<void> => openUri({ uri: lxUrls.termsOfServiceUrl })}
            />
          ),
          highlightPrivacy: (
            <Text
              key="privacy-policy"
              color="$accent1"
              variant="body4"
              onPress={(): Promise<void> => openUri({ uri: lxUrls.privacyPolicyUrl })}
            />
          ),
        }}
        i18nKey="onboarding.termsOfService"
      />
    </Text>
  )
}
