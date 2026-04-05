import { FeatureFlags, useFeatureFlag } from '@universe/gating'
import { useCallback, useReducer, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AnimatableCopyIcon, Flex, styled, Text, TouchableArea } from 'ui/src'
import { BlockExplorer } from 'ui/src/components/icons/BlockExplorer'
import { GlobeFilled } from 'ui/src/components/icons/GlobeFilled'
import { Page } from 'ui/src/components/icons/Page'
import { XTwitter } from 'ui/src/components/icons/XTwitter'
import { iconSizes } from 'ui/src/theme'
import { useShadowPropsMedium } from 'ui/src/theme/shadows'
import { getBlockExplorerIcon } from 'uniswap/src/components/chains/BlockExplorerIcon'
import { MultichainAddressList } from 'uniswap/src/components/MultichainTokenDetails/MultichainAddressList'
import { MultichainExplorerList } from 'uniswap/src/components/MultichainTokenDetails/MultichainExplorerList'
import { getChainInfo } from 'uniswap/src/features/chains/chainInfo'
import { useLocalizationContext } from 'uniswap/src/features/language/LocalizationContext'
import { ModalName } from 'uniswap/src/features/telemetry/constants'
import { TestID } from 'uniswap/src/test/fixtures/testIDs'
import { ExplorerDataType, getExplorerLink, openUri } from 'uniswap/src/utils/linking'
import { shortenAddress } from 'utilities/src/addresses'
import { FOTTooltipContent } from '~/components/swap/SwapLineItem'
import { MouseoverTooltip, TooltipSize } from '~/components/Tooltip'
import useCopyClipboard from '~/hooks/useCopyClipboard'
import { useSwapTaxes } from '~/hooks/useSwapTaxes'
import {
  MultichainPillDropdown,
  TokenInfoButton,
  tokenPillStyles,
} from '~/pages/TokenDetails/components/info/MultichainPillDropdown'
import { useTDPStore } from '~/pages/TokenDetails/context/useTDPStore'
import { useMultichainTokenEntries } from '~/pages/TokenDetails/hooks/useMultichainTokenEntries'
import { EllipsisTamaguiStyle } from '~/theme/components/styles'

const TRUNCATE_CHARACTER_COUNT = 300
const MULTICHAIN_POPOVER_WIDTH = 280
const MULTICHAIN_POPOVER_HEIGHT = 256

const truncateDescription = (desc: string, maxCharacterCount = TRUNCATE_CHARACTER_COUNT) => {
  //trim the string to the maximum length
  let tokenDescriptionTruncated = desc.slice(0, maxCharacterCount)
  //re-trim if we are in the middle of a word
  tokenDescriptionTruncated = `${tokenDescriptionTruncated.slice(
    0,
    Math.min(tokenDescriptionTruncated.length, tokenDescriptionTruncated.lastIndexOf(' ')),
  )}...`
  return tokenDescriptionTruncated
}

const TokenDescriptionContainer = styled(Text, {
  variant: 'body1',
  color: '$neutral1',
  maxWidth: '100%',
  maxHeight: 'fit-content',
  ...EllipsisTamaguiStyle,
  whiteSpace: 'pre-wrap',
  lineHeight: 24,
})

function TokenLinkButton({ uri, icon, name }: { uri: string; icon: JSX.Element; name: string }) {
  return (
    <TouchableArea
      tag="a"
      role="link"
      href={uri}
      target="_blank"
      rel="noopener noreferrer"
      {...tokenPillStyles}
      $platform-web={{ textDecorationLine: 'none' }}
    >
      {icon}
      <Text variant="buttonLabel3" color="$neutral1">
        {name}
      </Text>
    </TouchableArea>
  )
}

export function TokenDescription() {
  const { t } = useTranslation()
  const { address, currency, tokenQuery, multiChainMap } = useTDPStore((s) => ({
    address: s.address,
    currency: s.currency!,
    tokenQuery: s.tokenQuery,
    multiChainMap: s.multiChainMap,
  }))

  const isMultichainTokenUx = useFeatureFlag(FeatureFlags.MultichainTokenUx)
  const multichainEntries = useMultichainTokenEntries(multiChainMap)
  const hasMultipleChains = multichainEntries.length > 1

  const { description, homepageUrl, twitterName } = tokenQuery.data?.token?.project ?? {}
  const explorerUrl = getExplorerLink({
    chainId: currency.chainId,
    data: address,
    type: currency.isNative ? ExplorerDataType.NATIVE : ExplorerDataType.TOKEN,
  })

  const [isCopied, setCopied] = useCopyClipboard()
  const copy = useCallback(() => {
    setCopied(address)
  }, [address, setCopied])

  const shadowProps = useShadowPropsMedium()
  const [isExplorerOpen, setIsExplorerOpen] = useState(false)
  const [isAddressOpen, setIsAddressOpen] = useState(false)

  const multichainPopoverContentProps = {
    isSheet: false,
    placement: 'top-start' as const,
    borderRadius: '$rounded20' as const,
    borderWidth: 1,
    borderColor: '$surface3' as const,
    backgroundColor: '$surface1' as const,
    alignItems: 'stretch' as const,
    px: '$spacing8' as const,
    py: '$none' as const,
    width: MULTICHAIN_POPOVER_WIDTH,
    maxHeight: MULTICHAIN_POPOVER_HEIGHT,
    webBottomSheetProps: { px: '$spacing24' },
    ...shadowProps,
  }

  const handleExplorerPress = useCallback((url: string) => {
    openUri({ uri: url })
  }, [])

  const [isDescriptionTruncated, toggleIsDescriptionTruncated] = useReducer((x) => !x, true)
  const truncatedDescription = truncateDescription(description ?? '', TRUNCATE_CHARACTER_COUNT)
  const shouldTruncate = !!description && description.length > TRUNCATE_CHARACTER_COUNT
  const showTruncatedDescription = shouldTruncate && isDescriptionTruncated
  const { inputTax: sellFee, outputTax: buyFee } = useSwapTaxes({
    inputTokenAddress: address,
    outputTokenAddress: address,
    tokenChainId: currency.chainId,
  })
  const { formatPercent } = useLocalizationContext()
  const { sellFeeString, buyFeeString } = {
    sellFeeString: formatPercent(sellFee.toSignificant()),
    buyFeeString: formatPercent(buyFee.toSignificant()),
  }
  const hasFee = Boolean(parseFloat(sellFeeString)) || Boolean(parseFloat(buyFee.toFixed(2)))
  const sameFee = sellFeeString === buyFeeString

  const Icon = getBlockExplorerIcon(currency.chainId)
  const explorerName = getChainInfo(currency.chainId).explorer.name

  const showMultichainDropdowns = isMultichainTokenUx && hasMultipleChains

  const addressPill = currency.isNative ? null : showMultichainDropdowns ? (
    <MultichainPillDropdown
      testID={TestID.MultichainAddressDropdown}
      icon={<Page size="$icon.16" color="$neutral1" />}
      name={t('common.address')}
      isOpen={isAddressOpen}
      onOpenChange={setIsAddressOpen}
      modalName={ModalName.MultichainAddressModal}
      popoverContentProps={multichainPopoverContentProps}
    >
      <MultichainAddressList chains={multichainEntries} onCopyAddress={setCopied} />
    </MultichainPillDropdown>
  ) : (
    <TokenInfoButton
      onPress={copy}
      icon={<AnimatableCopyIcon isCopied={isCopied} size={iconSizes.icon16} textColor="$neutral1" />}
      name={shortenAddress({ address })}
    />
  )

  const explorerPill = showMultichainDropdowns ? (
    <MultichainPillDropdown
      testID={TestID.MultichainExplorerDropdown}
      icon={<BlockExplorer size="$icon.16" color="$neutral1" />}
      name={t('common.explorer')}
      isOpen={isExplorerOpen}
      onOpenChange={setIsExplorerOpen}
      modalName={ModalName.MultichainExplorerModal}
      popoverContentProps={multichainPopoverContentProps}
    >
      <MultichainExplorerList
        chains={multichainEntries}
        isNativeToken={currency.isNative}
        onExplorerPress={handleExplorerPress}
      />
    </MultichainPillDropdown>
  ) : (
    <TokenLinkButton uri={explorerUrl} icon={<Icon size="$icon.16" color="$neutral1" />} name={explorerName} />
  )

  const websitePill = homepageUrl ? (
    <TokenLinkButton
      uri={homepageUrl}
      icon={<GlobeFilled size="$icon.16" color="$neutral1" />}
      name={t('common.website')}
    />
  ) : null

  const twitterPill = twitterName ? (
    <TokenLinkButton
      uri={`https://x.com/${twitterName}`}
      icon={<XTwitter size="$icon.16" color="$neutral1" />}
      name={t('common.twitter')}
    />
  ) : null

  return (
    <Flex data-testid={TestID.TokenDetailsAboutSection} gap="$gap20" width="100%" $md={{ gap: '$gap16' }}>
      <Text variant="heading3">{t('common.about')}</Text>
      <TokenDescriptionContainer>
        {!description && (
          <Text variant="body2" color="$neutral3">
            {t('tdp.noInfoAvailable')}
          </Text>
        )}
        {description && (
          <Text tag="h2" variant="body2" color="$neutral2" whiteSpace="normal">
            {!showTruncatedDescription ? (
              <span data-testid={TestID.TokenDetailsDescriptionFull}>{description}</span>
            ) : (
              <span data-testid={TestID.TokenDetailsDescriptionTruncated}>{truncatedDescription}</span>
            )}
          </Text>
        )}
        {shouldTruncate && (
          <TouchableArea
            onPress={toggleIsDescriptionTruncated}
            data-testid="token-description-show-more-button"
            display="inline"
          >
            <Text display="inline" variant="buttonLabel2" ml="$spacing8" textWrap="nowrap">
              {isDescriptionTruncated ? t('common.showMore.button') : t('common.hide.button')}
            </Text>
          </TouchableArea>
        )}
      </TokenDescriptionContainer>
      <Flex row flexWrap="wrap" gap="$gap12" width="100%" data-testid={TestID.TokenDetailsAboutLinks}>
        {addressPill}
        {explorerPill}
        {websitePill}
        {twitterPill}
      </Flex>
      {hasFee && (
        <MouseoverTooltip
          placement="left"
          size={TooltipSize.Small}
          text={
            <Text variant="body4" color="$neutral2" lineHeight={16}>
              <FOTTooltipContent />
            </Text>
          }
        >
          <Flex gap="$gap8">
            {sameFee ? (
              <Text variant="body2" color="$neutral1">
                {currency.symbol}&nbsp;
                {t('token.fee.label')}
                :&nbsp;{sellFeeString}
              </Text>
            ) : (
              <>
                <Text variant="body2" color="$neutral1">
                  {currency.symbol}&nbsp;
                  {t('token.fee.buy.label')}
                  :&nbsp;{buyFeeString}
                </Text>{' '}
                <Text variant="body2" color="$neutral1">
                  {currency.symbol}&nbsp;
                  {t('token.fee.sell.label')}
                  :&nbsp;{sellFeeString}
                </Text>{' '}
              </>
            )}
          </Flex>
        </MouseoverTooltip>
      )}
    </Flex>
  )
}
