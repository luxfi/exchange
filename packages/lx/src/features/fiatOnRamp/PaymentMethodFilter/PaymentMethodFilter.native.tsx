import { FlatList } from 'react-native'
import {
  PaymentMethodFilterProps,
  useEnabledPaymentMethodFilters,
  useRenderPaymentMethod,
  useTogglePaymentMethod,
} from 'lx/src/features/fiatOnRamp/PaymentMethodFilter/utils'
import { FORFilters } from 'lx/src/features/fiatOnRamp/types'
import { FiatOffRampEventName, FiatOnRampEventName } from 'lx/src/features/telemetry/constants'
import { sendAnalyticsEvent } from 'lx/src/features/telemetry/send'

export function PaymentMethodFilter({
  quotes,
  paymentMethod,
  setPaymentMethod,
  isOffRamp,
}: PaymentMethodFilterProps): JSX.Element {
  const enabledPaymentMethodFilters = useEnabledPaymentMethodFilters(quotes)
  const handleTogglePaymentMethod = useTogglePaymentMethod(paymentMethod, setPaymentMethod)
  const handleOnPress = (filter: FORFilters): void => {
    handleTogglePaymentMethod(filter)
    if (isOffRamp) {
      sendAnalyticsEvent(FiatOffRampEventName.FiatOffRampPaymentMethodFilterSelected, { paymentMethodFilter: filter })
    } else {
      sendAnalyticsEvent(FiatOnRampEventName.FiatOnRampPaymentMethodFilterSelected, { paymentMethodFilter: filter })
    }
  }
  const renderPaymentMethod = useRenderPaymentMethod(paymentMethod, handleOnPress)

  return (
    <FlatList
      horizontal
      data={enabledPaymentMethodFilters}
      renderItem={renderPaymentMethod}
      keyExtractor={(item) => item.filter}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingHorizontal: 24 }}
    />
  )
}
