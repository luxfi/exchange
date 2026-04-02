import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Flex, Text, TouchableArea } from '@luxfi/ui/src'
import { Edit } from '@luxfi/ui/src/components/icons/Edit'
import { XTwitter } from '@luxfi/ui/src/components/icons/XTwitter'
import { iconSizes } from '@luxfi/ui/src/theme'
import { CurrencyLogo } from 'lx/src/components/CurrencyLogo/CurrencyLogo'
import { TokenLogo } from 'lx/src/components/CurrencyLogo/TokenLogo'
import { getChainInfo } from 'lx/src/features/chains/chainInfo'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { useLocalizationContext } from 'lx/src/features/language/LocalizationContext'
import { useLocalizedDayjs } from 'lx/src/features/language/localizedDayjs'
import { useCurrencyInfo, useNativeCurrencyInfo } from 'lx/src/features/tokens/useCurrencyInfo'
import { buildCurrencyId } from 'lx/src/utils/currencyId'
import { NumberType } from '@luxfi/utilities/src/format/types'
import {
  useCreateAuctionStore,
  useCreateAuctionStoreActions,
} from '~/pages/Liquidity/CreateAuction/CreateAuctionContext'
import { AuctionType, CreateAuctionStep, RaiseCurrency, TokenMode } from '~/pages/Liquidity/CreateAuction/types'
import { amountToPercent } from '~/pages/Liquidity/CreateAuction/utils'

const TOKEN_LOGO_SIZE = 60
const CURRENCY_LOGO_SIZE = iconSizes.icon20

function EditButton({ onPress }: { onPress: () => void }) {
  const { t } = useTranslation()
  return (
    <TouchableArea
      backgroundColor="$surface3"
      borderRadius="$rounded12"
      px="$spacing12"
      py="$spacing8"
      flexDirection="row"
      alignItems="center"
      gap="$spacing8"
      onPress={onPress}
    >
      <Edit size="$icon.20" color="$neutral1" />
      <Text variant="buttonLabel3" color="$neutral1">
        {t('common.button.edit')}
      </Text>
    </TouchableArea>
  )
}

function SectionHeader({ title, onEdit }: { title: string; onEdit?: () => void }) {
  return (
    <Flex
      row
      justifyContent="space-between"
      alignItems="center"
      borderBottomWidth={1}
      borderBottomColor="$surface3"
      pb="$spacing12"
    >
      <Text variant="heading3" color="$neutral1">
        {title}
      </Text>
      {onEdit && <EditButton onPress={onEdit} />}
    </Flex>
  )
}

function ReviewRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Flex row justifyContent="space-between" alignItems="center">
      <Text variant="body1" color="$neutral2">
        {label}
      </Text>
      {children}
    </Flex>
  )
}

export function ReviewLaunchStep() {
  const { t } = useTranslation()
  const { formatNumberOrString } = useLocalizationContext()
  const tokenForm = useCreateAuctionStore((state) => state.tokenForm)
  const configureAuction = useCreateAuctionStore((state) => state.configureAuction)
  const { setStep } = useCreateAuctionStoreActions()

  const handleEditTokenInfo = () => setStep(CreateAuctionStep.ADD_TOKEN_INFO)
  const handleEditAuctionConfig = () => setStep(CreateAuctionStep.CONFIGURE_AUCTION)

  const dayjsInstance = useLocalizedDayjs()
  const formattedStartDate = configureAuction.startTime
    ? dayjsInstance(configureAuction.startTime).format('MM/DD/YY')
    : undefined

  const tokenName =
    tokenForm.mode === TokenMode.CREATE_NEW
      ? tokenForm.name || t('toucan.createAuction.step.tokenInfo.namePlaceholder')
      : (tokenForm.existingTokenCurrencyInfo?.currency.name ?? '')

  const tokenSymbol =
    tokenForm.mode === TokenMode.CREATE_NEW
      ? tokenForm.symbol
      : (tokenForm.existingTokenCurrencyInfo?.currency.symbol ?? '')

  const description = tokenForm.description

  const xProfile = tokenForm.xProfile

  const chainId =
    tokenForm.mode === TokenMode.CREATE_NEW
      ? tokenForm.network
      : (tokenForm.existingTokenCurrencyInfo?.currency.chainId ?? UniverseChainId.Mainnet)

  const { committed } = configureAuction
  const activeConfig = committed
    ? committed.activeAuctionType === AuctionType.BOOTSTRAP_LIQUIDITY
      ? committed.bootstrap
      : committed.fundraise
    : undefined

  const formattedAuctionAmount = activeConfig
    ? formatNumberOrString({ value: activeConfig.auctionSupplyAmount.toExact(), type: NumberType.TokenNonTx })
    : '0'

  const fdv = useMemo(() => {
    if (!configureAuction.floorPrice || !committed) {
      return undefined
    }
    return parseFloat(configureAuction.floorPrice) * parseFloat(committed.totalSupply.toExact())
  }, [configureAuction.floorPrice, committed])
  const formattedFdv =
    fdv !== undefined ? formatNumberOrString({ value: fdv.toString(), type: NumberType.TokenNonTx }) : undefined

  const nativeCurrencyInfo = useNativeCurrencyInfo(chainId)
  const usdcCurrencyId = useMemo(() => {
    const usdc = getChainInfo(chainId).tokens.USDC
    return usdc ? buildCurrencyId(chainId, usdc.address) : undefined
  }, [chainId])
  const usdcCurrencyInfo = useCurrencyInfo(usdcCurrencyId, { skip: !usdcCurrencyId })
  const raiseCurrencyInfo = configureAuction.raiseCurrency === RaiseCurrency.ETH ? nativeCurrencyInfo : usdcCurrencyInfo

  const postAuctionLiquidityPercentDisplay =
    committed?.activeAuctionType === AuctionType.FUNDRAISE && !committed.fundraise.auctionSupplyAmount.equalTo(0)
      ? Math.round(
          amountToPercent(committed.fundraise.auctionSupplyAmount, committed.fundraise.postAuctionLiquidityAmount),
        )
      : undefined

  return (
    <Flex gap="$spacing12">
      <Flex backgroundColor="$surface1" p="$spacing24" gap="$spacing32">
        {/* Token info */}
        <Flex gap="$spacing20">
          <SectionHeader title={t('toucan.createAuction.step.tokenInfo.title')} />

          <Flex row alignItems="center" gap="$spacing16">
            {tokenForm.mode === TokenMode.CREATE_NEW ? (
              <TokenLogo
                url={tokenForm.imageUrl || null}
                symbol={tokenForm.symbol}
                name={tokenForm.name}
                chainId={tokenForm.network}
                size={TOKEN_LOGO_SIZE}
              />
            ) : (
              <CurrencyLogo currencyInfo={tokenForm.existingTokenCurrencyInfo ?? null} size={TOKEN_LOGO_SIZE} />
            )}
            <Flex flex={1} gap="$spacing4">
              <Text variant="heading3" color="$neutral1">
                {tokenName}
              </Text>
              <Text variant="body2" color="$neutral2">
                {tokenSymbol}
              </Text>
            </Flex>
            <EditButton onPress={handleEditTokenInfo} />
          </Flex>

          {description ? (
            <Text variant="body2" color="$neutral1">
              {description}
            </Text>
          ) : null}

          {xProfile ? (
            <Flex row>
              <Flex
                backgroundColor="$surface3"
                borderRadius="$roundedFull"
                flexDirection="row"
                alignItems="center"
                gap="$spacing8"
                pl="$spacing8"
                pr="$spacing12"
                py="$spacing6"
              >
                <XTwitter size="$icon.16" color="$neutral1" />
                <Text variant="buttonLabel3" color="$neutral1">
                  @{xProfile}
                </Text>
              </Flex>
            </Flex>
          ) : null}
        </Flex>

        {/* Auction details */}
        <Flex gap="$spacing24">
          <SectionHeader
            title={t('toucan.createAuction.step.configureAuction.title')}
            onEdit={handleEditAuctionConfig}
          />

          <ReviewRow label={t('toucan.createAuction.step.reviewLaunch.auctionAmount')}>
            <Text variant="body1" color="$neutral1">
              {formattedAuctionAmount} {tokenSymbol}
            </Text>
          </ReviewRow>

          {committed?.activeAuctionType === AuctionType.FUNDRAISE &&
          postAuctionLiquidityPercentDisplay !== undefined ? (
            <ReviewRow label={t('toucan.createAuction.step.configureAuction.postAuctionLiquidity')}>
              <Text variant="body1" color="$neutral1">
                {postAuctionLiquidityPercentDisplay}%
              </Text>
            </ReviewRow>
          ) : null}

          {configureAuction.floorPrice ? (
            <ReviewRow label={t('toucan.createAuction.step.reviewLaunch.clearingPrice')}>
              <Flex row alignItems="center" gap="$spacing4">
                <Text variant="body1" color="$neutral1">
                  {configureAuction.floorPrice} {configureAuction.raiseCurrency}
                </Text>
                {formattedFdv !== undefined ? (
                  <Text variant="body1" color="$neutral2">
                    ({formattedFdv} {configureAuction.raiseCurrency} FDV)
                  </Text>
                ) : null}
              </Flex>
            </ReviewRow>
          ) : null}

          <ReviewRow label={t('toucan.createAuction.step.configureAuction.raiseCurrency')}>
            <Flex row alignItems="center" gap="$spacing6">
              {raiseCurrencyInfo ? (
                <CurrencyLogo hideNetworkLogo currencyInfo={raiseCurrencyInfo} size={CURRENCY_LOGO_SIZE} />
              ) : null}
              <Text variant="body1" color="$neutral1">
                {configureAuction.raiseCurrency}
              </Text>
            </Flex>
          </ReviewRow>

          {configureAuction.startTime ? (
            <ReviewRow label={t('toucan.createAuction.step.reviewLaunch.startDate')}>
              <Text variant="body1" color="$neutral1">
                {formattedStartDate}
              </Text>
            </ReviewRow>
          ) : null}

          <ReviewRow label={t('toucan.createAuction.step.configureAuction.duration')}>
            <Text variant="body1" color="$neutral1">
              {configureAuction.maxDurationDays}d
            </Text>
          </ReviewRow>

          <ReviewRow label={t('toucan.createAuction.step.configureAuction.kyc.title')}>
            <Text variant="body1" color="$neutral1">
              {t('toucan.createAuction.step.reviewLaunch.kycDisabled')}
            </Text>
          </ReviewRow>
        </Flex>
      </Flex>

      <Flex row>
        <Button size="large" emphasis="primary" isDisabled fill>
          {t('toucan.createAuction.launchAuction')}
        </Button>
      </Flex>
    </Flex>
  )
}
