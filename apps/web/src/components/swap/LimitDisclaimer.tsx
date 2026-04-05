<<<<<<< HEAD
import { brand, getBrandUrl, getDocsUrl } from '@l.x/config'
import { Trans } from 'react-i18next'
import { Flex, FlexProps, styled, Text } from '@l.x/ui/src'
=======
import { Trans } from 'react-i18next'
import { Flex, FlexProps, styled, Text } from 'ui/src'
>>>>>>> upstream/main
import { ExternalLink } from '~/theme/components/Links'

const DisclaimerText = styled(Text, {
  variant: 'body4',
  color: '$neutral2',
})

export function LimitDisclaimer(props: FlexProps) {
  return (
    <Flex backgroundColor="$surface2" borderRadius="$rounded12" p="$spacing12" mt="$spacing12" gap="$gap4" {...props}>
      <DisclaimerText>
        <Trans i18nKey="pool.limitFluctuation.warning" />
      </DisclaimerText>
      <DisclaimerText>Canceling a limit has a network cost.</DisclaimerText>
      <DisclaimerText>
<<<<<<< HEAD
        <ExternalLink href={getDocsUrl('/help/limit-orders')}>
=======
        <ExternalLink href="https://support.uniswap.org/hc/en-us/articles/24300813697933">
>>>>>>> upstream/main
          <Trans i18nKey="common.button.learn" />
        </ExternalLink>
      </DisclaimerText>
    </Flex>
  )
}
