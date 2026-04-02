import { Trans } from 'react-i18next'
import { Text } from '@luxfi/ui/src'
import { deprecatedStyled } from '~/lib/deprecated-styled'
import { ExternalLink } from '~/theme/components/Links'

const StyledLink = deprecatedStyled(ExternalLink)`
  font-weight: 535;
  color: ${({ theme }) => theme.neutral3};
`

export default function PrivacyPolicyNotice() {
  return (
    <Text variant="body4" color="$neutral3" textAlign="center">
      <Trans
        i18nKey="wallet.connectingAgreement"
        components={{
          termsLink: <StyledLink href="https://lux.exchange/terms" />,
          privacyLink: <StyledLink href="https://lux.exchange/privacy" />,
        }}
      />
    </Text>
  )
}
