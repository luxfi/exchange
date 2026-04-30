import { Trans } from 'react-i18next'
import { brand } from '@l.x/config'
import { Text } from '@l.x/ui/src'
import { deprecatedStyled } from '~/lib/deprecated-styled'
import { ExternalLink } from '~/theme/components/Links'

const StyledLink = deprecatedStyled(ExternalLink)`
  font-weight: 535;
  color: ${({ theme }) => theme.neutral3};
`

export default function PrivacyPolicyNotice() {
  // Pull terms / privacy URLs from runtime brand config so each white-label
  // (zoo.exchange, pars.market, etc.) shows its own legal links instead of
  // leaking the upstream uniswap.org URLs.
  const termsHref = brand.termsUrl || 'https://lux.exchange/terms'
  const privacyHref = brand.privacyUrl || 'https://lux.exchange/privacy'
  return (
    <Text variant="body4" color="$neutral3" textAlign="center">
      <Trans
        i18nKey="wallet.connectingAgreement"
        components={{
          termsLink: <StyledLink href={termsHref} />,
          privacyLink: <StyledLink href={privacyHref} />,
        }}
      />
    </Text>
  )
}
