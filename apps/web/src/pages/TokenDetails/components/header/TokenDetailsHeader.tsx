<<<<<<< HEAD
import { useAtom } from 'jotai'
import { useTranslation } from 'react-i18next'
import { Flex, Text, useMedia } from '@l.x/ui/src'
import { iconSizes } from '@l.x/ui/src/theme'
import { TokenLogo } from '@l.x/lx/src/components/CurrencyLogo/TokenLogo'
import { ReportTokenDataModal } from '@l.x/lx/src/components/reporting/ReportTokenDataModal'
import { ReportTokenIssueModalPropsAtom } from '@l.x/lx/src/components/reporting/ReportTokenIssueModal'
import { ModalName } from '@l.x/lx/src/features/telemetry/constants'
import { TestID } from '@l.x/lx/src/test/fixtures/testIDs'
import { shortenAddress } from '@l.x/utils/src/addresses'
import { useEvent } from '@l.x/utils/src/react/hooks'
import { useBooleanState } from '@l.x/utils/src/react/useBooleanState'
=======
import { FeatureFlags, useFeatureFlag } from '@universe/gating'
import { useAtom } from 'jotai'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Text, useMedia } from 'ui/src'
import { iconSizes } from 'ui/src/theme'
import { TokenLogo } from 'uniswap/src/components/CurrencyLogo/TokenLogo'
import { ReportTokenDataModal } from 'uniswap/src/components/reporting/ReportTokenDataModal'
import { ReportTokenIssueModalPropsAtom } from 'uniswap/src/components/reporting/ReportTokenIssueModal'
import { UniverseChainId } from 'uniswap/src/features/chains/types'
import { ModalName } from 'uniswap/src/features/telemetry/constants'
import { TestID } from 'uniswap/src/test/fixtures/testIDs'
import { shortenAddress } from 'utilities/src/addresses'
import { useEvent } from 'utilities/src/react/hooks'
import { useBooleanState } from 'utilities/src/react/useBooleanState'
>>>>>>> upstream/main
import { HEADER_TRANSITION } from '~/components/Explore/stickyHeader/constants'
import { getHeaderLogoSize, getHeaderTitleVariant } from '~/components/Explore/stickyHeader/getHeaderLogoSize'
import { DesktopHeaderActions } from '~/components/Explore/stickyHeader/HeaderActions/DesktopHeaderActions'
import { MobileHeaderActions } from '~/components/Explore/stickyHeader/HeaderActions/MobileHeaderActions'
import { POPUP_MEDIUM_DISMISS_MS } from '~/components/Popups/constants'
import { popupRegistry } from '~/components/Popups/registry'
import { PopupType } from '~/components/Popups/types'
import { useModalState } from '~/hooks/useModalState'
<<<<<<< HEAD
import { useTokenDetailsHeaderActions } from '~/pages/TokenDetails/components/header/useTokenDetailsHeaderActions'
import { useTDPStore } from '~/pages/TokenDetails/context/useTDPStore'
import { CopyHelper } from '~/theme/components/CopyHelper'
import { EllipsisGuiStyle } from '~/theme/components/styles'
=======
import { TokenDetailsNetworkFilter } from '~/pages/TokenDetails/components/header/TokenDetailsNetworkFilter'
import { useTokenDetailsHeaderActions } from '~/pages/TokenDetails/components/header/useTokenDetailsHeaderActions'
import { useTDPStore } from '~/pages/TokenDetails/context/useTDPStore'
import { useMultichainTokenEntries } from '~/pages/TokenDetails/hooks/useMultichainTokenEntries'
import { CopyHelper } from '~/theme/components/CopyHelper'
import { EllipsisTamaguiStyle } from '~/theme/components/styles'
>>>>>>> upstream/main

interface TokenDetailsHeaderProps {
  isCompact: boolean
}

<<<<<<< HEAD
export function TokenDetailsHeader({ isCompact }: TokenDetailsHeaderProps) {
  const { t } = useTranslation()
  const media = useMedia()
  const isMobileScreen = media.md

  const { address, currency, tokenQuery } = useTDPStore((s) => ({
    address: s.address,
    currency: s.currency!,
    tokenQuery: s.tokenQuery,
  }))
=======
function getShowAddressCopy({
  isMultichainTokenUx,
  isNative,
  isMultiChainAsset,
  selectedChainId,
}: {
  isMultichainTokenUx: boolean
  isNative: boolean
  isMultiChainAsset: boolean
  selectedChainId: UniverseChainId | undefined
}): boolean {
  if (!isMultichainTokenUx) {
    return !isNative
  }
  if (!isMultiChainAsset) {
    return !isNative
  }
  return !!selectedChainId
}

export function TokenDetailsHeader({ isCompact }: TokenDetailsHeaderProps) {
  const { t } = useTranslation()
  const media = useMedia()
  const [selectedChainId, setSelectedChainId] = useState<UniverseChainId | undefined>(undefined)
  const isMobileScreen = media.md
  const isMultichainTokenUx = useFeatureFlag(FeatureFlags.MultichainTokenUx)

  const { address, currency, tokenQuery, multiChainMap } = useTDPStore((s) => ({
    address: s.address,
    currency: s.currency!,
    tokenQuery: s.tokenQuery,
    multiChainMap: s.multiChainMap,
  }))
  const multichainEntries = useMultichainTokenEntries(multiChainMap)
  const isMultiChainAsset = multichainEntries.length > 1
  const multichainChainIds = useMemo(() => multichainEntries.map((entry) => entry.chainId), [multichainEntries])
>>>>>>> upstream/main
  const isNative = Boolean(currency.isNative)
  const tokenLogoUrl = tokenQuery.data?.token?.project?.logoUrl
  const tokenLogoSize = getHeaderLogoSize({ isCompact, isMobile: media.md })

  const { openModal } = useModalState(ModalName.ReportTokenIssue)
  const [, setModalProps] = useAtom(ReportTokenIssueModalPropsAtom)
  const openReportTokenModal = useEvent(() => {
    setModalProps({ source: 'token-details', currency, isMarkedSpam: tokenQuery.data?.token?.project?.isSpam })
    openModal()
  })

  const onReportSuccess = useEvent(() => {
    popupRegistry.addPopup(
      { type: PopupType.Success, message: t('common.reported') },
      'report-token-success',
      POPUP_MEDIUM_DISMISS_MS,
    )
  })

  const {
    value: isReportDataIssueModalOpen,
    setTrue: openReportDataIssueModal,
    setFalse: closeReportDataIssueModal,
  } = useBooleanState(false)

  const { desktopHeaderActions, mobileHeaderActionSections } = useTokenDetailsHeaderActions({
    currency,
    address,
    project: tokenQuery.data?.token?.project,
    openReportTokenModal,
    openReportDataIssueModal,
    isMobileScreen,
  })

  const tokenSymbolName = currency.symbol ?? t('tdp.symbolNotFound')
<<<<<<< HEAD
=======
  const showAddressCopy = getShowAddressCopy({ isMultichainTokenUx, isNative, isMultiChainAsset, selectedChainId })
>>>>>>> upstream/main

  return (
    <Flex
      row
      alignItems="center"
      justifyContent="space-between"
      width="100%"
      data-testid={TestID.TokenDetailsInfoContainer}
    >
      <Flex row flex={1} alignItems="center" gap="$gap12">
        <TokenLogo
          url={tokenLogoUrl}
          symbol={currency.symbol ?? undefined}
          name={currency.name ?? undefined}
<<<<<<< HEAD
          chainId={currency.chainId}
          size={tokenLogoSize}
          transition={HEADER_TRANSITION}
=======
          chainId={!isMultichainTokenUx ? currency.chainId : null}
          size={tokenLogoSize}
          transition={HEADER_TRANSITION}
          showMainnetNetworkLogo={isMultichainTokenUx && selectedChainId === UniverseChainId.Mainnet}
>>>>>>> upstream/main
        />
        <Flex gap={isCompact ? '$gap4' : '$gap8'} $md={{ gap: '$none' }} transition={HEADER_TRANSITION}>
          <Flex row flex={1} alignItems="flex-end" gap="$gap8" $sm={{ width: '100%' }}>
            <Text
              tag="h1"
              variant={getHeaderTitleVariant({ isCompact, isMobile: media.md })}
              transition={HEADER_TRANSITION}
<<<<<<< HEAD
              {...EllipsisGuiStyle}
=======
              {...EllipsisTamaguiStyle}
>>>>>>> upstream/main
            >
              {currency.name ?? t('tdp.nameNotFound')}
            </Text>
            {!isCompact && !media.md && (
              <Text
                tag="h2"
                variant="subheading1"
                textTransform="uppercase"
                color="$neutral2"
                $sm={{ display: 'none' }}
                transition={HEADER_TRANSITION}
              >
                {tokenSymbolName}
              </Text>
            )}
          </Flex>
<<<<<<< HEAD
          {!isNative && (
            <CopyHelper
              toCopy={address}
              iconPosition="right"
              iconSize={iconSizes.icon16}
              iconColor="$neutral2"
              color="$neutral2"
              dataTestId={TestID.BreadcrumbHoverCopy}
            >
              <Text color="$neutral2">{shortenAddress({ address })}</Text>
            </CopyHelper>
          )}
=======
          <Flex row alignItems="stretch" gap="$spacing6">
            <TokenDetailsNetworkFilter
              chainIds={multichainChainIds}
              selectedChainId={selectedChainId}
              setSelectedChainId={setSelectedChainId}
              showAddressCopy={showAddressCopy}
            />
            {showAddressCopy && (
              <Flex alignSelf="center">
                <CopyHelper
                  toCopy={address}
                  iconPosition="right"
                  iconSize={iconSizes.icon16}
                  iconColor="$neutral2"
                  color="$neutral2"
                  dataTestId={TestID.BreadcrumbHoverCopy}
                >
                  <Text color="$neutral2">{shortenAddress({ address })}</Text>
                </CopyHelper>
              </Flex>
            )}
          </Flex>
>>>>>>> upstream/main
        </Flex>
      </Flex>
      {isMobileScreen ? (
        <MobileHeaderActions actionSections={mobileHeaderActionSections} />
      ) : (
        <DesktopHeaderActions actions={desktopHeaderActions} />
      )}
      <ReportTokenDataModal
        currency={currency}
        isMarkedSpam={tokenQuery.data?.token?.project?.isSpam}
        onReportSuccess={onReportSuccess}
        isOpen={isReportDataIssueModalOpen}
        onClose={closeReportDataIssueModal}
      />
    </Flex>
  )
}
