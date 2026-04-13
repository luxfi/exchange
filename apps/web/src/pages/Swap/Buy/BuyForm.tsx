import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router'
import { Flex, styled, Text } from 'ui/src'
import { useDynamicFontSizing } from 'ui/src/hooks/useDynamicFontSizing'
import { nativeOnChain } from 'uniswap/src/constants/tokens'
import { useUrlContext } from 'uniswap/src/contexts/UrlContext'
import { normalizeCurrencyIdForMapLookup } from 'uniswap/src/data/cache'
import { TradeableAsset } from 'uniswap/src/entities/assets'
import { UniverseChainId } from 'uniswap/src/features/chains/types'
import { usePortfolioBalances } from 'uniswap/src/features/dataApi/balances/balances'
import { useAppFiatCurrency, useFiatCurrencyComponents } from 'uniswap/src/features/fiatCurrency/hooks'
import { FiatOnRampCountryPicker } from 'uniswap/src/features/fiatOnRamp/FiatOnRampCountryPicker'
import { useFiatOnRampAggregatorGetCountryQuery } from 'uniswap/src/features/fiatOnRamp/hooks/useFiatOnRampQueries'
import { FiatOnRampCurrency, RampDirection } from 'uniswap/src/features/fiatOnRamp/types'
import UnsupportedTokenModal from 'uniswap/src/features/fiatOnRamp/UnsupportedTokenModal'
import { useLocalizationContext } from 'uniswap/src/features/language/LocalizationContext'
import { FiatOffRampEventName, FiatOnRampEventName, InterfacePageName } from 'uniswap/src/features/telemetry/constants'
import { sendAnalyticsEvent } from 'uniswap/src/features/telemetry/send'
import Trace from 'uniswap/src/features/telemetry/Trace'
import { TestID } from 'uniswap/src/test/fixtures/testIDs'
import { currencyId } from 'uniswap/src/utils/currencyId'
import useResizeObserver from 'use-resize-observer'
import { isSafeNumber } from 'utilities/src/primitives/integer'
import { usePrevious } from 'utilities/src/react/hooks'
import { popupRegistry } from '~/components/Popups/registry'
import { SwitchNetworkAction } from '~/components/Popups/types'
import { PAGE_WRAPPER_MAX_WIDTH } from '~/components/swap/styled'
import { NATIVE_CHAIN_ID } from '~/constants/tokens'
import { useActiveAddresses } from '~/features/accounts/store/hooks'
import { useAccount } from '~/hooks/useAccount'
import { BuyFormButton } from '~/pages/Swap/Buy/BuyFormButton'
import { BuyFormContextProvider, useBuyFormContext } from '~/pages/Swap/Buy/BuyFormContext'
import { ChooseProviderModal } from '~/pages/Swap/Buy/ChooseProviderModal'
import { CountryListModal } from '~/pages/Swap/Buy/CountryListModal'
import { FiatOnRampCurrencyModal } from '~/pages/Swap/Buy/FiatOnRampCurrencyModal'
import { fallbackCurrencyInfo, useOffRampTransferDetailsRequest } from '~/pages/Swap/Buy/hooks'
import { OffRampConfirmTransferModal } from '~/pages/Swap/Buy/OffRampConfirmTransferModal'
import { PredefinedAmount } from '~/pages/Swap/Buy/PredefinedAmount'
import { formatFiatOnRampFiatAmount, getCountryFromLocale } from '~/pages/Swap/Buy/shared'
import { AlternateCurrencyDisplay } from '~/pages/Swap/common/AlternateCurrencyDisplay'
import { SelectTokenPanel } from '~/pages/Swap/common/SelectTokenPanel'
import {
  NumericalInputMimic,
  NumericalInputSymbolContainer,
  NumericalInputWrapper,
  StyledNumericalInput,
} from '~/pages/Swap/common/shared'
import { getChainUrlParam } from '~/utils/chainParams'
import { showSwitchNetworkNotification } from '~/utils/showSwitchNetworkNotification'

const InputWrapper = styled(Flex, {
  backgroundColor: '$surface1',
  p: '$spacing16',
  pt: '$spacing12',
  pb: 52,
  height: 264,
  alignItems: 'center',
  borderRadius: '$rounded20',
  justifyContent: 'space-between',
  overflow: 'hidden',
  gap: '$spacing8',
  borderWidth: 1,
  borderColor: '$surface3',
})

const HeaderRow = styled(Flex, {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
})

const DEFAULT_FIAT_DECIMALS = 2
const PREDEFINED_AMOUNTS = [100, 300, 1000]
const PREDEFINED_PERCENTAGES = [25, 50, 75, 100]
const CHAR_WIDTH = 45
const MAX_FONT_SIZE = 70
const MIN_FONT_SIZE = 24

type BuyFormProps = {
  disabled?: boolean
  initialCurrency?: TradeableAsset | null
}

function BuyFormInner({ disabled, initialCurrency }: BuyFormProps) {
  const account = useAccount()
  const addresses = useActiveAddresses()
  const { t } = useTranslation()
  const { convertFiatAmount } = useLocalizationContext()
  const fiatCurrency = useAppFiatCurrency()
  const { symbol: fiatSymbol } = useFiatCurrencyComponents(fiatCurrency)
  const [, setSearchParams] = useSearchParams()

  const { buyFormState, setBuyFormState, derivedBuyFormInfo } = useBuyFormContext()
  const {
    inputAmount,
    inputInFiat,
    selectedCountry,
    quoteCurrency,
    currencyModalOpen,
    countryModalOpen,
    providerModalOpen,
    rampDirection,
    selectedUnsupportedCurrency,
  } = buyFormState
  const { supportedTokens, countryOptionsResult, error, amountOut, meldSupportedFiatCurrency } = derivedBuyFormInfo
  const navigate = useNavigate()

  const prevQuoteCurrency = usePrevious(quoteCurrency)
  const postWidthAdjustedDisplayValue = useWidthAdjustedDisplayValue(inputAmount)
