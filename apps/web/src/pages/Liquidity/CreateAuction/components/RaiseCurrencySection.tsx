import { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Text } from 'ui/src'
import { CheckCircleFilled } from 'ui/src/components/icons/CheckCircleFilled'
import { QuestionInCircleFilled } from 'ui/src/components/icons/QuestionInCircleFilled'
import { iconSizes } from 'ui/src/theme'
import { CurrencyLogo } from 'uniswap/src/components/CurrencyLogo/CurrencyLogo'
import { getChainInfo } from 'uniswap/src/features/chains/chainInfo'
import { UniverseChainId } from 'uniswap/src/features/chains/types'
import { useCurrencyInfo, useNativeCurrencyInfo } from 'uniswap/src/features/tokens/useCurrencyInfo'
import { buildCurrencyId } from 'uniswap/src/utils/currencyId'
import { logger } from 'utilities/src/logger/logger'
import { HookTileContainer } from '~/pages/Liquidity/CreateAuction/components/HookTile'
import { useCreateAuctionStore } from '~/pages/Liquidity/CreateAuction/CreateAuctionContext'
import { RaiseCurrency, TokenMode } from '~/pages/Liquidity/CreateAuction/types'
import { ExternalLink } from '~/theme/components/Links'

const LOGO_SIZE = iconSizes.icon24

export function RaiseCurrencySection({
  raiseCurrency,
  onSelect,
}: {
  raiseCurrency: RaiseCurrency
  onSelect: (currency: RaiseCurrency) => void
}) {
  const { t } = useTranslation()
  const tokenForm = useCreateAuctionStore((state) => state.tokenForm)

  const chainId = useMemo(
    () =>
      tokenForm.mode === TokenMode.CREATE_NEW
        ? tokenForm.network
        : (tokenForm.existingTokenCurrencyInfo?.currency.chainId ?? UniverseChainId.Mainnet),
    [tokenForm],
  )

  const nativeCurrencyInfo = useNativeCurrencyInfo(chainId)
  const handleSelectEth = useCallback(() => onSelect(RaiseCurrency.ETH), [onSelect])
  const handleSelectUsdc = useCallback(() => onSelect(RaiseCurrency.USDC), [onSelect])
  const usdcCurrencyId = useMemo(() => {
    const usdc = getChainInfo(chainId).tokens.USDC
    return usdc ? buildCurrencyId(chainId, usdc.address) : undefined
  }, [chainId])
  const usdcCurrencyInfo = useCurrencyInfo(usdcCurrencyId, { skip: !usdcCurrencyId })

  useEffect(() => {
    if (nativeCurrencyInfo && nativeCurrencyInfo.currency.symbol !== 'ETH') {
      logger.error(
        new Error(
          'RaiseCurrencySection: only ETH and USDC are accepted for raising; native currency on this chain is not ETH',
        ),
        {
          tags: { file: 'RaiseCurrencySection.tsx', function: 'RaiseCurrencySection', chainId },
          extra: {
            nativeCurrencySymbol: nativeCurrencyInfo.currency.symbol,
          },
        },
      )
    }
  }, [chainId, nativeCurrencyInfo])

  return (
    <Flex gap="$spacing12">
      <Flex gap="$spacing4">
        <Text variant="subheading1" color="$neutral1">
          {t('toucan.createAuction.step.configureAuction.raiseCurrency')}
        </Text>
        <Text variant="body3" color="$neutral2">
          {t('toucan.createAuction.step.configureAuction.raiseCurrency.description')}
        </Text>
      </Flex>
      <Flex gap="$spacing12">
        <Flex row gap="$spacing8">
          <HookTileContainer
            onPress={handleSelectEth}
            background={raiseCurrency === RaiseCurrency.ETH ? '$surface3' : '$surface1'}
          >
            <Flex row alignItems="center" gap="$spacing8" position="relative">
              <Flex width={LOGO_SIZE} height={LOGO_SIZE} flexShrink={0}>
                {nativeCurrencyInfo ? (
                  <CurrencyLogo hideNetworkLogo currencyInfo={nativeCurrencyInfo} size={LOGO_SIZE} />
                ) : (
                  <Flex width={LOGO_SIZE} height={LOGO_SIZE} borderRadius="$roundedFull" backgroundColor="$surface3" />
                )}
              </Flex>
              <Text variant="buttonLabel3" color="$neutral1">
                {nativeCurrencyInfo?.currency.symbol}
              </Text>
              {raiseCurrency === RaiseCurrency.ETH && (
                <Flex position="absolute" top={-4} right={-4}>
                  <CheckCircleFilled size="$icon.20" />
                </Flex>
              )}
            </Flex>
            <Text variant="body4" color="$neutral2">
              {t('toucan.createAuction.step.configureAuction.raiseCurrency.eth.description')}
            </Text>
          </HookTileContainer>
          <HookTileContainer
            onPress={handleSelectUsdc}
            background={raiseCurrency === RaiseCurrency.USDC ? '$surface3' : '$surface1'}
          >
            <Flex row alignItems="center" gap="$spacing8" position="relative">
              <Flex width={LOGO_SIZE} height={LOGO_SIZE} flexShrink={0}>
                {usdcCurrencyInfo ? (
                  <CurrencyLogo hideNetworkLogo currencyInfo={usdcCurrencyInfo} size={LOGO_SIZE} />
                ) : (
                  <Flex width={LOGO_SIZE} height={LOGO_SIZE} borderRadius="$roundedFull" backgroundColor="$surface3" />
                )}
              </Flex>
              <Text variant="buttonLabel3" color="$neutral1">
                {usdcCurrencyInfo?.currency.symbol}
              </Text>
              {raiseCurrency === RaiseCurrency.USDC && (
                <Flex position="absolute" top={-4} right={-4}>
                  <CheckCircleFilled size="$icon.20" />
                </Flex>
              )}
            </Flex>
            <Text variant="body4" color="$neutral2">
              {t('toucan.createAuction.step.configureAuction.raiseCurrency.usdc.description')}
            </Text>
          </HookTileContainer>
        </Flex>
        <Flex row gap="$spacing4" alignItems="center">
          <QuestionInCircleFilled size="$icon.16" color="$neutral2" />
          <ExternalLink href="https://support.uniswap.org/hc/en-us">
            <Text variant="body3" color="$neutral2" textDecorationLine="underline" textDecorationStyle="dashed">
              {t('toucan.createAuction.step.configureAuction.raiseCurrency.helpLink')}
            </Text>
          </ExternalLink>
        </Flex>
      </Flex>
    </Flex>
  )
}
