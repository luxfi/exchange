import { ProtocolVersion } from '@luxamm/client-data-api/dist/data/v1/poolTypes_pb'
import { type Currency, Token } from '@luxamm/sdk-core'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Flex, Separator, Text } from '@luxfi/ui/src'
import { Search } from '@luxfi/ui/src/components/icons/Search'
import { useSporeColors } from '@luxfi/ui/src/hooks/useSporeColors'
import { ZERO_ADDRESS } from 'lx/src/constants/misc'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { useCurrentLocale } from 'lx/src/features/language/hooks'
import { useLocalizationContext } from 'lx/src/features/language/LocalizationContext'
import { Platform } from 'lx/src/features/platforms/types/Platform'
import { NumberType } from '@luxfi/utilities/src/format/types'
import { AdvancedButton } from '~/components/Liquidity/Create/AdvancedButton'
import { getSortedCurrenciesForProtocol } from '~/components/Liquidity/Create/hooks/useDerivedPositionInfo'
import { FeeTierSearchModal } from '~/components/Liquidity/FeeTierSearchModal'
import { FeeTierSelector } from '~/components/Liquidity/FeeTierSelector'
import { useAllFeeTierPoolData } from '~/components/Liquidity/hooks/useAllFeeTierPoolData'
import { getDefaultFeeTiersWithData } from '~/components/Liquidity/utils/feeTiers'
import { useActiveAddress } from '~/features/accounts/store/hooks'
import {
  useCreateAuctionStore,
  useCreateAuctionStoreActions,
} from '~/pages/Liquidity/CreateAuction/CreateAuctionContext'
import { isValidPoolOwner, PoolOwnerSection } from '~/pages/Liquidity/CreateAuction/components/PoolOwnerSection'
import { PriceRangeStrategySelector } from '~/pages/Liquidity/CreateAuction/components/PriceRangeStrategySelector'
import { MIN_LOCK_DURATION_DAYS, TimeLockSection } from '~/pages/Liquidity/CreateAuction/components/TimeLockSection'
import { TokenSummaryCard, useTokenSummaryCardProps } from '~/pages/Liquidity/CreateAuction/components/TokenSummaryCard'
import {
  AuctionType,
  CreateAuctionStep,
  NEW_TOKEN_DECIMALS,
  NEW_TOKEN_PLACEHOLDER_ADDRESS,
  TokenMode,
} from '~/pages/Liquidity/CreateAuction/types'
import { getRaiseCurrencyAsCurrency } from '~/pages/Liquidity/CreateAuction/utils'

const MS_PER_DAY = 24 * 60 * 60 * 1000

export function CustomizePoolStep() {
  const { t } = useTranslation()
  const colors = useSporeColors()
  const { formatNumberOrString } = useLocalizationContext()
  const {
    goToNextStep,
    setStep,
    setFee,
    setPriceRangeStrategy,
    setPoolOwner,
    setTimeLockEnabled,
    setTimeLockDurationDays,
  } = useCreateAuctionStoreActions()
  const locale = useCurrentLocale()
  const [feeTierSearchModalOpen, setFeeTierSearchModalOpen] = useState(false)
  const tokenSummaryCardProps = useTokenSummaryCardProps()
  const activeAddress = useActiveAddress(Platform.EVM)
  const configureAuction = useCreateAuctionStore((state) => state.configureAuction)
  const customizePool = useCreateAuctionStore((state) => state.customizePool)
  const tokenForm = useCreateAuctionStore((state) => state.tokenForm)

  const handleEditToken = useCallback(() => setStep(CreateAuctionStep.ADD_TOKEN_INFO), [setStep])
  const handleEditAuction = useCallback(() => setStep(CreateAuctionStep.CONFIGURE_AUCTION), [setStep])

  const chainId: UniverseChainId =
    tokenForm.mode === TokenMode.CREATE_NEW
      ? tokenForm.network
      : (tokenForm.existingTokenCurrencyInfo?.currency.chainId ?? UniverseChainId.Unichain)

  const token0: Currency | undefined = useMemo(() => {
    if (tokenForm.mode === TokenMode.CREATE_NEW) {
      return new Token(
        tokenForm.network,
        NEW_TOKEN_PLACEHOLDER_ADDRESS,
        NEW_TOKEN_DECIMALS,
        tokenForm.symbol,
        tokenForm.name,
      )
    }
    return tokenForm.existingTokenCurrencyInfo?.currency
  }, [tokenForm])

  const token1 = useMemo(
    () => getRaiseCurrencyAsCurrency(configureAuction.raiseCurrency, chainId),
    [configureAuction.raiseCurrency, chainId],
  )

  const sortedCurrencies = useMemo(
    () => getSortedCurrenciesForProtocol({ a: token0, b: token1, protocolVersion: ProtocolVersion.V4 }),
    [token0, token1],
  )

  const { feeTierData } = useAllFeeTierPoolData({
    chainId,
    protocolVersion: ProtocolVersion.V4,
    sdkCurrencies: sortedCurrencies,
    hook: ZERO_ADDRESS,
  })

  const defaultFeeTiers = useMemo(
    () => getDefaultFeeTiersWithData({ chainId, feeTierData, protocolVersion: ProtocolVersion.V4 }),
    [chainId, feeTierData],
  )

  const { committed, startTime, maxDurationDays } = configureAuction
  const { timeLockEnabled, timeLockDurationDays } = customizePool

  const auctionEndDate = useMemo(() => {
    const ref = startTime ?? new Date()
    return new Date(ref.getTime() + maxDurationDays * MS_PER_DAY)
  }, [startTime, maxDurationDays])

  const minUnlockDate = useMemo(() => new Date(auctionEndDate.getTime() + MS_PER_DAY), [auctionEndDate])

  const unlockDate = useMemo(
    () => new Date(auctionEndDate.getTime() + timeLockDurationDays * MS_PER_DAY),
    [auctionEndDate, timeLockDurationDays],
  )

  const handleTimeLockDecrement = useCallback(() => {
    setTimeLockDurationDays(Math.max(MIN_LOCK_DURATION_DAYS, timeLockDurationDays - 1))
  }, [setTimeLockDurationDays, timeLockDurationDays])

  const handleTimeLockIncrement = useCallback(() => {
    setTimeLockDurationDays(timeLockDurationDays + 1)
  }, [setTimeLockDurationDays, timeLockDurationDays])

  const handleUnlockDateChange = useCallback(
    (date: Date | undefined) => {
      if (!date) {
        return
      }
      const days = Math.ceil((date.getTime() - auctionEndDate.getTime()) / MS_PER_DAY)
      setTimeLockDurationDays(Math.max(MIN_LOCK_DURATION_DAYS, days))
    },
    [auctionEndDate, setTimeLockDurationDays],
  )

  if (!committed || !startTime) {
    return null
  }

  const { activeAuctionType: committedAuctionType, bootstrap } = committed
  const activeConfig = committedAuctionType === AuctionType.BOOTSTRAP_LIQUIDITY ? bootstrap : committed.fundraise
  const auctionSupplyText = t('toucan.createAuction.tokenSummaryCard.auctioning', {
    amount: formatNumberOrString({
      value: activeConfig.auctionSupplyAmount.toExact(),
      type: NumberType.TokenNonTx,
      placeholder: '0',
    }),
  })
  const launchText = t('toucan.createAuction.tokenSummaryCard.launching', {
    date: startTime.toLocaleDateString(locale, { month: '2-digit', day: '2-digit', year: '2-digit' }),
    count: maxDurationDays,
  })

  const auctionSummary = { auctionSupplyText, launchText, onEdit: handleEditAuction }

  return (
    <Flex gap="$spacing16">
      <TokenSummaryCard {...tokenSummaryCardProps} onEdit={handleEditToken} auctionSummary={auctionSummary} />

      <Flex
        backgroundColor="$surface1"
        borderWidth="$spacing1"
        borderColor="$surface3"
        borderRadius="$rounded20"
        px="$spacing20"
        py="$spacing12"
        gap="$spacing20"
      >
        <Flex>
          <Text variant="heading3" color="$neutral1" py="$spacing12">
            {t('toucan.createAuction.step.customizePool.title')}
          </Text>
          <Separator />
        </Flex>
        <Flex>
          <Flex pb="$spacing16">
            <Text variant="subheading1" color="$neutral1">
              {t('fee.tier')}
            </Text>
            <Text variant="body3" color="$neutral2">
              {t('fee.tier.description')}
            </Text>
          </Flex>
          <FeeTierSelector
            selectedFee={customizePool.fee}
            onFeeSelect={setFee}
            feeTiers={defaultFeeTiers}
            expandedFooterContent={
              <AdvancedButton
                title={t('fee.tier.search')}
                Icon={Search}
                onPress={() => setFeeTierSearchModalOpen(true)}
              />
            }
          />
          <FeeTierSearchModal
            isOpen={feeTierSearchModalOpen}
            onClose={() => setFeeTierSearchModalOpen(false)}
            chainId={chainId}
            protocolVersion={ProtocolVersion.V4}
            hook={ZERO_ADDRESS}
            sdkCurrencies={sortedCurrencies}
            selectedFee={customizePool.fee}
            onSelectFee={setFee}
            createDescription={t('toucan.createAuction.step.customizePool.feeTier.createDescription')}
          />
        </Flex>

        <Flex>
          <Flex pb="$spacing16">
            <Text variant="subheading1" color="$neutral1">
              {t('toucan.createAuction.step.customizePool.priceRange.title')}
            </Text>
            <Text variant="body3" color="$neutral2">
              {t('toucan.createAuction.step.customizePool.priceRange.description')}
            </Text>
          </Flex>
          <PriceRangeStrategySelector
            selectedStrategy={customizePool.priceRangeStrategy}
            onStrategySelect={setPriceRangeStrategy}
            auctionType={committed.activeAuctionType}
            histogramBarColor={colors.statusSuccess.val}
          />
        </Flex>

        <PoolOwnerSection
          value={customizePool.poolOwner}
          onValueChange={setPoolOwner}
          activeAddress={activeAddress ?? null}
        />

        <TimeLockSection
          enabled={timeLockEnabled}
          onEnabledChange={setTimeLockEnabled}
          lockDurationDays={timeLockDurationDays}
          onLockDurationDecrement={handleTimeLockDecrement}
          onLockDurationIncrement={handleTimeLockIncrement}
          unlockDate={unlockDate}
          onUnlockDateChange={handleUnlockDateChange}
          minUnlockDate={minUnlockDate}
        />
      </Flex>
      <Flex row>
        <Button
          size="medium"
          emphasis="primary"
          onPress={goToNextStep}
          fill
          isDisabled={!isValidPoolOwner(customizePool.poolOwner)}
        >
          {t('toucan.createAuction.reviewLaunch')}
        </Button>
      </Flex>
    </Flex>
  )
}
