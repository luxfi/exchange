// Legacy pools table removed - showing transactions only
import { TransactionsTable } from 'components/Tokens/TokenDetails/tables/TransactionsTable'
import { useTDPContext } from 'pages/TokenDetails/TDPContext'
import { Trans } from 'react-i18next'
import { ClickableTamaguiStyle } from 'theme/components/styles'
import { Flex, styled, Text } from 'ui/src'

const Container = styled(Flex, {
  width: '100%',
})

const Tab = styled(Text, {
  color: '$neutral1',
  variant: 'heading3',
  variants: {
    clickable: {
      true: ClickableTamaguiStyle,
      false: {},
    },
  },
  defaultVariants: {
    clickable: true,
  },
})

// Simplified to show only transactions (pools tab removed during migration)
export function ActivitySection() {
  const { currency: referenceCurrency } = useTDPContext()

  return (
    <Container data-testid="token-details-activity-section">
      <Flex row gap="$spacing24" mb="$spacing24" id="activity-header">
        <Tab color="$neutral1">
          <Trans i18nKey="common.transactions" />
        </Tab>
      </Flex>
      <TransactionsTable chainId={referenceCurrency.chainId} referenceToken={referenceCurrency.wrapped} />
    </Container>
  )
}
