import { Fraction } from '@luxamm/sdk-core'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Flex, Text } from '@luxfi/ui/src'
import {
  useCreateAuctionStore,
  useCreateAuctionStoreActions,
} from '~/pages/Liquidity/CreateAuction/CreateAuctionContext'
import { AdvancedSettingsRow } from '~/pages/Liquidity/CreateAuction/components/AdvancedSettingsRow'
import { BootstrapAuctionSupplySection } from '~/pages/Liquidity/CreateAuction/components/BootstrapAuctionSupplySection'
import { DurationSection, getMinStartTime } from '~/pages/Liquidity/CreateAuction/components/DurationSection'
import { FloorPriceSection } from '~/pages/Liquidity/CreateAuction/components/FloorPriceSection'
import { FundraiseAuctionSupplySection } from '~/pages/Liquidity/CreateAuction/components/FundraiseAuctionSupplySection'
import { HookTile } from '~/pages/Liquidity/CreateAuction/components/HookTile'
import { RaiseCurrencySection } from '~/pages/Liquidity/CreateAuction/components/RaiseCurrencySection'
import { TokenSummaryCard, useTokenSummaryCardProps } from '~/pages/Liquidity/CreateAuction/components/TokenSummaryCard'
import { DEFAULT_POST_AUCTION_LIQUIDITY_PERCENT } from '~/pages/Liquidity/CreateAuction/store/createCreateAuctionStore'
import { AuctionType, type ConfigureAuctionFormState } from '~/pages/Liquidity/CreateAuction/types'
import { amountToPercent, percentOfAmount } from '~/pages/Liquidity/CreateAuction/utils'

export function ConfigureAuctionStep() {
  const { t } = useTranslation()
  const tokenSummaryCardProps = useTokenSummaryCardProps()
  const configureAuction: ConfigureAuctionFormState = useCreateAuctionStore((state) => state.configureAuction)

  const {
    goToPreviousStep,
    goToNextStep,
    setAuctionType,
    setAuctionConfig,
    setStartTime,
    setMaxDurationDays,
    setRaiseCurrency,
    setFloorPrice,
  } = useCreateAuctionStoreActions()

  const { startTime, maxDurationDays, committed, raiseCurrency, floorPrice } = configureAuction

  const handleBootstrapLiquidity = useCallback(() => setAuctionType(AuctionType.BOOTSTRAP_LIQUIDITY), [setAuctionType])
  const handleFundraise = useCallback(() => setAuctionType(AuctionType.FUNDRAISE), [setAuctionType])
  const handleStartTimeChange = useCallback((date: Date | undefined) => setStartTime(date), [setStartTime])
  const handleDecrement = useCallback(
    () => setMaxDurationDays(Math.max(1, maxDurationDays - 1)),
    [setMaxDurationDays, maxDurationDays],
  )
  const handleIncrement = useCallback(
    () => setMaxDurationDays(maxDurationDays + 1),
    [setMaxDurationDays, maxDurationDays],
  )

  const handleBootstrapSupplyPercentChange = useCallback(
    (percent: number) => {
      if (!committed) {
        return
      }
      const newAuctionSupply = percentOfAmount(committed.totalSupply, percent)
      setAuctionConfig({ auctionType: AuctionType.BOOTSTRAP_LIQUIDITY, auctionSupplyAmount: newAuctionSupply })
    },
    [committed, setAuctionConfig],
  )

  const handleFundraiseSupplyPercentChange = useCallback(
    (percent: number) => {
      if (!committed) {
        return
      }
      const { totalSupply, fundraise } = committed
      const newAuctionSupply = percentOfAmount(totalSupply, percent)

      const newLiquidity = newAuctionSupply.equalTo(0)
        ? newAuctionSupply
        : fundraise.auctionSupplyAmount.equalTo(0)
          ? // Previous auction supply was 0 so there's no meaningful ratio to preserve;
            // initialize LP amount using the default percentage instead.
            newAuctionSupply.multiply(DEFAULT_POST_AUCTION_LIQUIDITY_PERCENT)
          : fundraise.postAuctionLiquidityAmount.multiply(
              new Fraction(newAuctionSupply.quotient, fundraise.auctionSupplyAmount.quotient),
            )

      setAuctionConfig({
        auctionType: AuctionType.FUNDRAISE,
        auctionSupplyAmount: newAuctionSupply,
        postAuctionLiquidityAmount: newLiquidity,
      })
    },
    [committed, setAuctionConfig],
  )

  const handlePostAuctionLiquidityPercentChange = useCallback(
    (percent: number) => {
      if (!committed) {
        return
      }
      const { totalSupply, fundraise } = committed
      const maxAuctionPercent = 100 / (1 + percent / 100)
      const currentAuctionPercent = amountToPercent(totalSupply, fundraise.auctionSupplyAmount)

      if (currentAuctionPercent > maxAuctionPercent) {
        const clampedAuction = percentOfAmount(totalSupply, maxAuctionPercent)
        setAuctionConfig({
          auctionType: AuctionType.FUNDRAISE,
          auctionSupplyAmount: clampedAuction,
          postAuctionLiquidityAmount: percentOfAmount(clampedAuction, percent),
        })
      } else {
        setAuctionConfig({
          auctionType: AuctionType.FUNDRAISE,
          auctionSupplyAmount: fundraise.auctionSupplyAmount,
          postAuctionLiquidityAmount: percentOfAmount(fundraise.auctionSupplyAmount, percent),
        })
      }
    },
    [committed, setAuctionConfig],
  )

  if (!committed) {
    return null
  }

  const { totalSupply, activeAuctionType, bootstrap, fundraise } = committed
  const chainId = totalSupply.currency.chainId
  const tokenSymbol = totalSupply.currency.symbol ?? ''

  const activeConfig = activeAuctionType === AuctionType.BOOTSTRAP_LIQUIDITY ? bootstrap : fundraise
  const auctionSupplyPercent = amountToPercent(totalSupply, activeConfig.auctionSupplyAmount)
  const minStartTime = getMinStartTime()
  const isStartTimeValid = startTime && startTime.getTime() >= minStartTime.getTime()
  const isNextStepDisabled = !isStartTimeValid || activeConfig.auctionSupplyAmount.equalTo(0) || !floorPrice

  return (
    <Flex gap="$spacing16">
      <TokenSummaryCard {...tokenSummaryCardProps} onEdit={goToPreviousStep} />

      <Flex row gap="$spacing12">
        <HookTile
          selected={activeAuctionType === AuctionType.BOOTSTRAP_LIQUIDITY}
          title={t('toucan.createAuction.step.configureAuction.auctionType.bootstrapLiquidity')}
          titleVariant="buttonLabel2"
          description={t('toucan.createAuction.step.configureAuction.auctionType.bootstrapLiquidity.description')}
          descriptionVariant="body3"
          onPress={handleBootstrapLiquidity}
        />
        <HookTile
          selected={activeAuctionType === AuctionType.FUNDRAISE}
          title={t('toucan.createAuction.step.configureAuction.auctionType.fundraise')}
          titleVariant="buttonLabel2"
          description={t('toucan.createAuction.step.configureAuction.auctionType.fundraise.description')}
          descriptionVariant="body3"
          onPress={handleFundraise}
        />
      </Flex>

      <Flex
        backgroundColor="$surface1"
        borderWidth="$spacing1"
        borderColor="$surface3"
        borderRadius="$rounded20"
        p="$spacing24"
        gap="$spacing24"
      >
        <Flex borderBottomWidth={1} borderBottomColor="$surface3" pb="$spacing12">
          <Text variant="heading3" color="$neutral1">
            {t('toucan.createAuction.step.configureAuction.title')}
          </Text>
        </Flex>

        <Flex gap="$spacing40">
          <DurationSection
            maxDurationDays={maxDurationDays}
            startTime={startTime}
            onStartTimeChange={handleStartTimeChange}
            onDecrement={handleDecrement}
            onIncrement={handleIncrement}
          />

          <RaiseCurrencySection raiseCurrency={raiseCurrency} onSelect={setRaiseCurrency} />

          <FloorPriceSection
            chainId={chainId}
            floorPrice={floorPrice}
            raiseCurrency={raiseCurrency}
            tokenTotalSupply={totalSupply}
            onFloorPriceChange={setFloorPrice}
          />

          {activeAuctionType === AuctionType.BOOTSTRAP_LIQUIDITY && (
            <BootstrapAuctionSupplySection
              auctionSupplyPercent={auctionSupplyPercent}
              totalTokenSupply={totalSupply}
              tokenSymbol={tokenSymbol}
              onSelectPercent={handleBootstrapSupplyPercentChange}
            />
          )}

          {activeAuctionType === AuctionType.FUNDRAISE && (
            <FundraiseAuctionSupplySection
              auctionSupplyPercent={auctionSupplyPercent}
              auctionSupplyAmount={fundraise.auctionSupplyAmount}
              tokenTotalSupply={totalSupply}
              tokenSymbol={tokenSymbol}
              postAuctionLiquidityPercent={amountToPercent(
                fundraise.auctionSupplyAmount,
                fundraise.postAuctionLiquidityAmount,
              )}
              postAuctionLiquidityAmount={fundraise.postAuctionLiquidityAmount}
              onSelectAuctionSupplyPercent={handleFundraiseSupplyPercentChange}
              onSelectPostAuctionLiquidityPercent={handlePostAuctionLiquidityPercentChange}
            />
          )}
        </Flex>
        <AdvancedSettingsRow />
      </Flex>

      <Flex row>
        <Button size="medium" emphasis="primary" onPress={goToNextStep} isDisabled={isNextStepDisabled} fill>
          {t('common.button.continue')}
        </Button>
      </Flex>
    </Flex>
  )
}
