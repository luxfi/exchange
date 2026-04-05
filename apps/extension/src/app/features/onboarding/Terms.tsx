import { PropsWithChildren } from 'react'
import { Trans } from 'react-i18next'
import { Link, LinkProps } from 'react-router'
<<<<<<< HEAD
import { Text } from '@l.x/ui/src'
import { lxUrls } from '@l.x/lx/src/constants/urls'
=======
import { Text } from 'ui/src'
import { uniswapUrls } from 'uniswap/src/constants/urls'
>>>>>>> upstream/main

export function Terms(): JSX.Element {
  return (
    <Text color="$neutral3" textAlign="center" variant="body4">
      <Trans
        components={{
<<<<<<< HEAD
          highlightTerms: <LinkWrapper to={lxUrls.termsOfServiceUrl} />,
          highlightPrivacy: <LinkWrapper to={lxUrls.privacyPolicyUrl} />,
=======
          highlightTerms: <LinkWrapper to={uniswapUrls.termsOfServiceUrl} />,
          highlightPrivacy: <LinkWrapper to={uniswapUrls.privacyPolicyUrl} />,
>>>>>>> upstream/main
        }}
        i18nKey="onboarding.termsOfService"
      />
    </Text>
  )
}

function LinkWrapper(props: PropsWithChildren<LinkProps>): JSX.Element {
  const { children, ...rest } = props
  return (
    <Link {...rest} style={{ textDecoration: 'none' }} target="_blank">
      <Text color="$neutral2" variant="body4">
        {children}
      </Text>
    </Link>
  )
}
