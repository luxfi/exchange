import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
<<<<<<< HEAD
import { Flex, styled, Text } from '@l.x/ui/src'
import { isSVMChain } from '@l.x/lx/src/features/platforms/utils/chains'
import { TokenDetailsPoolsTable } from '~/pages/TokenDetails/components/activity/TokenDetailsPoolsTable'
import { TransactionsTable } from '~/pages/TokenDetails/components/activity/TransactionsTable'
import { useTDPStore } from '~/pages/TokenDetails/context/useTDPStore'
import { ClickableGuiStyle } from '~/theme/components/styles'
=======
import { Flex, styled, Text } from 'ui/src'
import { UniverseChainId } from 'uniswap/src/features/chains/types'
import { isSVMChain } from 'uniswap/src/features/platforms/utils/chains'
import { TokenDetailsPoolsTable } from '~/pages/TokenDetails/components/activity/TokenDetailsPoolsTable'
import { TransactionsTable } from '~/pages/TokenDetails/components/activity/TransactionsTable'
import { useTDPStore } from '~/pages/TokenDetails/context/useTDPStore'
import { ClickableTamaguiStyle } from '~/theme/components/styles'
>>>>>>> upstream/main

const Tab = styled(Text, {
  color: '$neutral1',
  variant: 'heading3',
  variants: {
    clickable: {
<<<<<<< HEAD
      true: ClickableGuiStyle,
=======
      true: ClickableTamaguiStyle,
>>>>>>> upstream/main
      false: {},
    },
  },
  defaultVariants: {
    clickable: true,
  },
})

// if you add a new tab, you must update the logic to disable the tab if the token is on a solana chain
enum ActivityTab {
  Txs = 0,
  Pools = 1,
}

export function ActivitySection() {
  const { t } = useTranslation()
  const { currency: referenceCurrency, currencyChainId } = useTDPStore((s) => ({
    currency: s.currency!,
    currencyChainId: s.currencyChainId,
  }))

  const [activityInView, setActivityInView] = useState(ActivityTab.Txs)

  const isSolanaToken = isSVMChain(currencyChainId)
<<<<<<< HEAD
=======
  const hasLimitedTransactionData = currencyChainId === UniverseChainId.Tempo
>>>>>>> upstream/main

  useEffect(() => {
    if (isSolanaToken && activityInView === ActivityTab.Pools) {
      setActivityInView(ActivityTab.Txs)
    }
  }, [isSolanaToken, activityInView])

  return (
    <Flex data-testid="token-details-activity-section" width="100%">
<<<<<<< HEAD
      <Flex row gap="$spacing24" mb="$spacing24" id="activity-header">
=======
      <Flex row gap="$spacing24" mb="$spacing12" id="activity-header">
>>>>>>> upstream/main
        <Tab
          clickable={!isSolanaToken}
          color={activityInView === ActivityTab.Txs ? '$neutral1' : '$neutral2'}
          onPress={() => setActivityInView(ActivityTab.Txs)}
        >
          {t('common.transactions')}
        </Tab>
        {!isSolanaToken && (
          <Tab
            color={activityInView === ActivityTab.Pools ? '$neutral1' : '$neutral2'}
            onPress={() => setActivityInView(ActivityTab.Pools)}
          >
            {t('common.pools')}
          </Tab>
        )}
      </Flex>
<<<<<<< HEAD
=======
      {hasLimitedTransactionData && (
        <Text variant="body2" color="$neutral2" mb="$spacing24">
          {t('tdp.transactions.limitedMarketData')}
        </Text>
      )}
>>>>>>> upstream/main
      {activityInView === ActivityTab.Txs && (
        <TransactionsTable chainId={referenceCurrency.chainId} referenceToken={referenceCurrency.wrapped} />
      )}
      {activityInView === ActivityTab.Pools && !isSolanaToken && (
        <TokenDetailsPoolsTable referenceCurrency={referenceCurrency} />
      )}
    </Flex>
  )
}
