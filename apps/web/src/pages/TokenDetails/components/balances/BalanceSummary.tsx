import { FeatureFlags, useFeatureFlag } from '@universe/gating'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { Flex, HeightAnimator, Separator, Text } from 'ui/src'
import { useConnectionStatus } from 'uniswap/src/features/accounts/store/hooks'
import { useEnabledChains } from 'uniswap/src/features/chains/hooks/useEnabledChains'
import { toGraphQLChain } from 'uniswap/src/features/chains/utils'
import { PortfolioBalance } from 'uniswap/src/features/dataApi/types'
import { getTokenDetailsURL } from '~/appGraphql/data/util'
import { PortfolioExpandoRow } from '~/pages/Portfolio/components/PortfolioExpandoRow'
import { Balance } from '~/pages/TokenDetails/components/balances/Balance'
import { BridgedAssetWithdrawButton } from '~/pages/TokenDetails/components/balances/BridgedAssetWithdrawButton'
import { useTDPStore } from '~/pages/TokenDetails/context/useTDPStore'

function getDisplayBalance({
  isMultichainUxEnabled,
  isMultichainBalance,
  allBalances,
  pageChainBalance,
}: {
  isMultichainUxEnabled: boolean
  isMultichainBalance: boolean
  allBalances: readonly PortfolioBalance[]
  pageChainBalance: PortfolioBalance | undefined
}): PortfolioBalance | undefined {
  if (isMultichainUxEnabled && isMultichainBalance && allBalances.length > 0) {
    return {
      id: 'total',
      cacheId: 'total',
      quantity: allBalances.reduce((sum, b) => sum + Number(b.quantity), 0),
      balanceUSD:
        allBalances.reduce((sum, b) => sum + (typeof b.balanceUSD === 'number' ? b.balanceUSD : 0), 0) || undefined,
      currencyInfo: pageChainBalance?.currencyInfo ?? allBalances[0].currencyInfo,
      relativeChange24: undefined,
      isHidden: undefined,
    }
  }
  return pageChainBalance
}

export function BalanceSummary(): JSX.Element | null {
  const { isDisconnected } = useConnectionStatus()
  const isMultichainUxEnabled = useFeatureFlag(FeatureFlags.MultichainTokenUx)
  const { currencyChain, multiChainMap } = useTDPStore((s) => ({
    currencyChain: s.currencyChain,
    multiChainMap: s.multiChainMap,
  }))

  const pageChainBalance = multiChainMap[currencyChain]?.balance
  const otherChainBalances: PortfolioBalance[] = []
  const allBalances: PortfolioBalance[] = []
  for (const [key, value] of Object.entries(multiChainMap)) {
    if (value.balance !== undefined) {
      allBalances.push(value.balance)
      if (key !== currencyChain) {
        otherChainBalances.push(value.balance)
      }
    }
  }
  otherChainBalances.sort((a, b) => {
    const aQty = Number(a.quantity)
    const bQty = Number(b.quantity)
    return bQty - aQty
  })

  const isMultichainBalance = otherChainBalances.length > 0
  const displayBalance = getDisplayBalance({
    isMultichainUxEnabled,
    isMultichainBalance,
    allBalances,
    pageChainBalance,
  })
  const hasBalances = Boolean(displayBalance || isMultichainBalance)

  if (isDisconnected || !hasBalances) {
    return null
  }
  return (
    <Flex gap="$gap24" height="fit-content" width="100%">
      <Flex gap="$gap16">
        <PageChainBalanceSummary
          pageChainBalance={displayBalance}
          isMultichainBalance={isMultichainUxEnabled && isMultichainBalance}
        />
        {isMultichainBalance && (
          <OtherChainsBalanceSummary
            otherChainBalances={otherChainBalances}
            pageChainBalance={pageChainBalance}
            hasPageChainBalance={!!pageChainBalance}
          />
        )}
      </Flex>
      <BridgedAssetWithdrawButton />
    </Flex>
  )
}

export function PageChainBalanceSummary({
  pageChainBalance,
  isMultichainBalance = false,
}: {
  pageChainBalance?: PortfolioBalance
  isMultichainBalance?: boolean
}): JSX.Element | null {
  const { t } = useTranslation()
  if (!pageChainBalance) {
    return null
  }
  const currency = pageChainBalance.currencyInfo.currency
  return (
    <Flex height="fit-content" width="100%" gap="$gap16">
      <Text variant="subheading2" color="$neutral2">
        {t('tdp.balanceSummary.title')}
      </Text>
      <Balance
        currency={currency}
        chainId={currency.chainId}
        fetchedBalance={pageChainBalance}
        isAggregate={isMultichainBalance}
        isMultichainBalance={isMultichainBalance}
      />
    </Flex>
  )
}

function OtherChainsBalanceSummary({
  otherChainBalances,
  pageChainBalance,
  hasPageChainBalance,
}: {
  otherChainBalances: readonly PortfolioBalance[]
  pageChainBalance?: PortfolioBalance
  hasPageChainBalance: boolean
}): JSX.Element | null {
  const { t } = useTranslation()
  const isMultichainUxEnabled = useFeatureFlag(FeatureFlags.MultichainTokenUx)
  const navigate = useNavigate()
  const { defaultChainId } = useEnabledChains()
  const [isExpanded, setIsExpanded] = useState(true)

  const displayBalances = isMultichainUxEnabled
    ? [...(pageChainBalance ? [pageChainBalance] : []), ...otherChainBalances].sort((a, b) => {
        const aQty = Number(a.quantity)
        const bQty = Number(b.quantity)
        return bQty - aQty
      })
    : otherChainBalances

  if (!displayBalances.length) {
    return null
  }

  const isCollapsible = hasPageChainBalance

  const collapseLabel = isMultichainUxEnabled
    ? t('tdp.balanceSummary.breakdown')
    : t('tdp.balanceSummary.otherNetworks')

  return (
    <Flex>
      {isCollapsible && <Separator mb="$spacing12" />}
      {isCollapsible ? (
        <Flex pb="$spacing8">
          <PortfolioExpandoRow
            isExpanded={isExpanded}
            label={collapseLabel}
            onPress={() => setIsExpanded(!isExpanded)}
            iconAlignRight
            textVariant="body3"
            iconSize="$icon.16"
            p="$none"
          />
        </Flex>
      ) : (
        <Text variant="subheading1" color="$neutral1">
          {collapseLabel}
        </Text>
      )}
      <HeightAnimator open={!isCollapsible || isExpanded}>
        {(!isCollapsible || isExpanded) &&
          displayBalances.map((balance) => {
            const currency = balance.currencyInfo.currency
            const chainId = currency.chainId || defaultChainId
            return (
              <Balance
                key={balance.id}
                currency={currency}
                chainId={chainId}
                fetchedBalance={balance}
                showChainLogoOnly
                onClick={() =>
                  navigate(
                    getTokenDetailsURL({
                      address: currency.isToken ? currency.address : undefined,
                      chain: toGraphQLChain(chainId),
                    }),
                  )
                }
              />
            )
          })}
      </HeightAnimator>
    </Flex>
  )
}
