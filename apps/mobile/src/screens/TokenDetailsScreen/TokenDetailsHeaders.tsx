import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { FadeIn } from 'react-native-reanimated'
import { MODAL_OPEN_WAIT_TIME } from 'src/app/navigation/constants'
import { navigate } from 'src/app/navigation/rootNavigation'
import { useTokenDetailsContext } from 'src/components/TokenDetails/TokenDetailsContext'
import { TokenDetailsFavoriteButton } from 'src/components/TokenDetails/TokenDetailsFavoriteButton'
import { useTokenDetailsCurrentChainBalance } from 'src/components/TokenDetails/useTokenDetailsCurrentChainBalance'
import { Flex, Text } from '@luxfi/ui/src'
import { Ellipsis } from '@luxfi/ui/src/components/icons'
import { AnimatedFlex } from '@luxfi/ui/src/components/layout/AnimatedFlex'
import { iconSizes, spacing } from '@luxfi/ui/src/theme'
import { TokenLogo } from '@luxexchange/lx/src/components/CurrencyLogo/TokenLogo'
import { ContextMenu } from '@luxexchange/lx/src/components/menus/ContextMenu'
import { ContextMenuTriggerMode } from '@luxexchange/lx/src/components/menus/types'
import {
  useTokenBasicInfoPartsFragment,
  useTokenBasicProjectPartsFragment,
} from '@luxexchange/lx/src/data/graphql/lux-data-api/fragments'
import { fromGraphQLChain } from '@luxexchange/lx/src/features/chains/utils'
import { TokenList } from '@luxexchange/lx/src/features/dataApi/types'
import {
  TokenMenuActionType,
  useTokenContextMenuOptions,
} from '@luxexchange/lx/src/features/portfolio/balances/hooks/useTokenContextMenuOptions'
import { ModalName } from '@luxexchange/lx/src/features/telemetry/constants'
import { TestID } from '@luxexchange/lx/src/test/fixtures/testIDs'
import { useEvent } from '@luxfi/utilities/src/react/hooks'
import { useBooleanState } from '@luxfi/utilities/src/react/useBooleanState'

export const HeaderTitleElement = memo(function HeaderTitleElement(): JSX.Element {
  const { t } = useTranslation()

  const { currencyId } = useTokenDetailsContext()

  const token = useTokenBasicInfoPartsFragment({ currencyId }).data
  const project = useTokenBasicProjectPartsFragment({ currencyId }).data.project

  const logo = project?.logoUrl ?? undefined
  const symbol = token.symbol
  const name = token.name
  const chain = token.chain

  return (
    <Flex alignItems="center" justifyContent="space-between" ml="$spacing32">
      <Flex centered row gap="$spacing4">
        <TokenLogo
          chainId={fromGraphQLChain(chain) ?? undefined}
          name={name}
          size={iconSizes.icon16}
          symbol={symbol ?? undefined}
          url={logo}
        />
        <Text color="$neutral2" numberOfLines={1} variant="buttonLabel3">
          {symbol ?? t('token.error.unknown')}
        </Text>
      </Flex>
    </Flex>
  )
})

const EXCLUDED_ACTIONS = [TokenMenuActionType.Swap, TokenMenuActionType.Send, TokenMenuActionType.Receive]

export const HeaderRightElement = memo(function HeaderRightElement(): JSX.Element {
  const { currencyId, currencyInfo, openContractAddressExplainerModal, copyAddressToClipboard } =
    useTokenDetailsContext()
  const currentChainBalance = useTokenDetailsCurrentChainBalance()

  const openReportTokenModal = useEvent(() => {
    setTimeout(() => {
      navigate(ModalName.ReportTokenIssue, {
        source: 'token-details',
        currency: currencyInfo?.currency,
        isMarkedSpam: currencyInfo?.isSpam,
      })
    }, MODAL_OPEN_WAIT_TIME)
  })

  const openReportDataIssueModal = useEvent(() => {
    setTimeout(() => {
      navigate(ModalName.ReportTokenData, { currency: currencyInfo?.currency, isMarkedSpam: currencyInfo?.isSpam })
    }, MODAL_OPEN_WAIT_TIME)
  })

  const { value: isOpen, setTrue: openMenu, setFalse: closeMenu } = useBooleanState(false)
  const menuActions = useTokenContextMenuOptions({
    excludedActions: EXCLUDED_ACTIONS,
    currencyId,
    isBlocked: currencyInfo?.safetyInfo?.tokenList === TokenList.Blocked,
    tokenSymbolForNotification: currencyInfo?.currency.symbol,
    portfolioBalance: currentChainBalance,
    openContractAddressExplainerModal,
    openReportDataIssueModal,
    openReportTokenModal,
    copyAddressToClipboard,
    closeMenu: () => {},
  })

  return (
    <AnimatedFlex row alignItems="center" entering={FadeIn} gap="$spacing12">
      <ContextMenu
        menuItems={menuActions}
        triggerMode={ContextMenuTriggerMode.Primary}
        isOpen={isOpen}
        openMenu={openMenu}
        closeMenu={closeMenu}
      >
        <Flex
          hitSlop={{ right: 5, left: 20, top: 20, bottom: 20 }}
          style={{ padding: spacing.spacing8 }}
          testID={TestID.TokenDetailsMoreButton}
        >
          <Ellipsis color="$neutral2" size="$icon.16" />
        </Flex>
      </ContextMenu>
      <TokenDetailsFavoriteButton currencyId={currencyId} tokenName={currencyInfo?.currency.name} />
    </AnimatedFlex>
  )
})
