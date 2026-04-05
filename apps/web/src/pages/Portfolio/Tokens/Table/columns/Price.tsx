import { memo, useMemo } from 'react'
<<<<<<< HEAD
import { useLocalizationContext } from '@l.x/lx/src/features/language/LocalizationContext'
import { NumberType } from '@l.x/utils/src/format/types'
=======
import { useLocalizationContext } from 'uniswap/src/features/language/LocalizationContext'
import { NumberType } from 'utilities/src/format/types'
>>>>>>> upstream/main
import { ValueWithFadedDecimals } from '~/pages/Portfolio/components/ValueWithFadedDecimals/ValueWithFadedDecimals'
import { EmptyTableCell } from '~/pages/Portfolio/EmptyTableCell'
import type { TokenData } from '~/pages/Portfolio/Tokens/hooks/useTransformTokenTableData'

export const Price = memo(function Price({ price }: { price: TokenData['price'] }) {
  const { convertFiatAmountFormatted } = useLocalizationContext()

  const formattedPrice = useMemo(() => {
    return convertFiatAmountFormatted(price, NumberType.FiatTokenPrice)
  }, [price, convertFiatAmountFormatted])

  if (!price && price !== 0) {
    return <EmptyTableCell />
  }

  return <ValueWithFadedDecimals value={formattedPrice} />
})
Price.displayName = 'Price'
