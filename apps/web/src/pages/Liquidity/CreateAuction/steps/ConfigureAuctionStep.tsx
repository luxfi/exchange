import { type Currency, type CurrencyAmount, Fraction } from '@uniswap/sdk-core'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Flex, Text } from 'ui/src'
import { AuctionAdvancedSettings } from '~/pages/Liquidity/CreateAuction/components/AuctionAdvancedSettings'
import { AuctionSupplySection } from '~/pages/Liquidity/CreateAuction/components/AuctionSupplySection'
import { DurationSection } from '~/pages/Liquidity/CreateAuction/components/DurationSection'
import { FloorPriceSection } from '~/pages/Liquidity/CreateAuction/components/FloorPriceSection'
import { HookTile } from '~/pages/Liquidity/CreateAuction/components/HookTile'
import { RaiseCurrencySection } from '~/pages/Liquidity/CreateAuction/components/RaiseCurrencySection'
import { TokenSummaryCard, useTokenSummaryCardProps } from '~/pages/Liquidity/CreateAuction/components/TokenSummaryCard'
import {
  useCreateAuctionStore,
  useCreateAuctionStoreActions,
} from '~/pages/Liquidity/CreateAuction/CreateAuctionContext'
import { useCreateAuctionTokenColor } from '~/pages/Liquidity/CreateAuction/hooks/useCreateAuctionTokenColor'
import { useIsStepValid } from '~/pages/Liquidity/CreateAuction/hooks/useIsStepValid'
import {
  BOOTSTRAP_POST_LIQUIDITY_PERCENT,
  FUNDRAISE_POST_LIQUIDITY_PERCENT,
} from '~/pages/Liquidity/CreateAuction/store/createCreateAuctionStore'
import { AuctionType, type ConfigureAuctionFormState, CreateAuctionStep } from '~/pages/Liquidity/CreateAuction/types'
import { percentOfAmount } from '~/pages/Liquidity/CreateAuction/utils'

export function ConfigureAuctionStep() {
  const { t } = useTranslation()
  const tokenColor = useCreateAuctionTokenColor()
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

  const { startTime, maxDurationDays, activeAuctionType, committed, raiseCurrency, floorPrice } = configureAuction
  const isNextStepDisabled = !useIsStepValid(CreateAuctionStep.CONFIGURE_AUCTION)

  const defaultLpPercent = useMemo(
    () =>
      activeAuctionType === AuctionType.BOOTSTRAP_LIQUIDITY
        ? BOOTSTRAP_POST_LIQUIDITY_PERCENT
        : FUNDRAISE_POST_LIQUIDITY_PERCENT,
    [activeAuctionType],
  )

  /** Compute new LP amount that preserves the ratio to auction supply, or falls back to the default. */
  const computeNewLiquidity = useCallback(
    (newAuctionSupply: CurrencyAmount<Currency>): CurrencyAmount<Currency> => {
      if (!committed || newAuctionSupply.equalTo(0)) {
        return newAuctionSupply
      }
      // Previous auction supply was 0 — no meaningful ratio to preserve;
      // initialize LP amount using the default percentage instead.
      if (committed.auctionSupplyAmount.equalTo(0)) {
        return newAuctionSupply.multiply(defaultLpPercent)
      }
      return committed.postAuctionLiquidityAmount.multiply(
        new Fraction(newAuctionSupply.quotient, committed.auctionSupplyAmount.quotient),
      )
    },
    [committed, defaultLpPercent],
  )

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

  const handleAuctionSupplyPercentChange = useCallback(
    (percent: number) => {
      if (!committed) {
        return
      }
      const newAuctionSupply = percentOfAmount(committed.totalSupply, percent)
      setAuctionConfig({
        auctionSupplyAmount: newAuctionSupply,
        postAuctionLiquidityAmount: computeNewLiquidity(newAuctionSupply),
      })
    },
    [committed, computeNewLiquidity, setAuctionConfig],
  )

  const handleAuctionSupplyAmountChange = useCallback(
    (newAuctionSupply: CurrencyAmount<Currency>) => {
      if (!committed) {
        return
      }
      setAuctionConfig({
        auctionSupplyAmount: newAuctionSupply,
        postAuctionLiquidityAmount: computeNewLiquidity(newAuctionSupply),
      })
    },
    [committed, computeNewLiquidity, setAuctionConfig],
  )

  const handlePostAuctionLiquidityPercentChange = useCallback(
    (percent: number) => {
      if (!committed) {
        return
      }
      // Auction supply is fixed — LP is always a percentage of the auction supply amount
      setAuctionConfig({
        auctionSupplyAmount: committed.auctionSupplyAmount,
        postAuctionLiquidityAmount: percentOfAmount(committed.auctionSupplyAmount, percent),
      })
    },
    [committed, setAuctionConfig],
  )

  if (!committed) {
    return null
  }

  const { totalSupply, auctionSupplyAmount, postAuctionLiquidityAmount } = committed
  const chainId = totalSupply.currency.chainId
  const tokenSymbol = totalSupply.currency.symbol ?? ''

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

          <AuctionSupplySection
            auctionSupplyAmount={auctionSupplyAmount}
            tokenTotalSupply={totalSupply}
            tokenSymbol={tokenSymbol}
            raiseTokenSymbol={raiseCurrency}
            postAuctionLiquidityAmount={postAuctionLiquidityAmount}
            onSelectAuctionSupplyPercent={handleAuctionSupplyPercentChange}
            onAuctionSupplyAmountChange={handleAuctionSupplyAmountChange}
            onSelectPostAuctionLiquidityPercent={handlePostAuctionLiquidityPercentChange}
            color={tokenColor}
          />
        </Flex>
        <AuctionAdvancedSettings />
      </Flex>

      <Flex row>
        <Button
          size="medium"
          emphasis="primary"
          onPress={goToNextStep}
          isDisabled={isNextStepDisabled}
          fill
          backgroundColor={tokenColor}
        >
          {t('common.button.continue')}
        </Button>
      </Flex>
    </Flex>
  )
}
