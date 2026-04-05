import { memo } from 'react'
<<<<<<< HEAD
import { Flex, Text } from '@l.x/ui/src'
import { CurrencyLogo } from '@l.x/lx/src/components/CurrencyLogo/CurrencyLogo'
import { useCurrencyInfo } from '@l.x/lx/src/features/tokens/useCurrencyInfo'
=======
import { Flex, Text } from 'ui/src'
import { CurrencyLogo } from 'uniswap/src/components/CurrencyLogo/CurrencyLogo'
import { useCurrencyInfo } from 'uniswap/src/features/tokens/useCurrencyInfo'
>>>>>>> upstream/main

interface TokenAmountDisplayProps {
  currencyInfo: ReturnType<typeof useCurrencyInfo>
  formattedAmount: string | null
  usdValue: string | null
}

<<<<<<< HEAD
function _TokenAmountDisplay({ currencyInfo, formattedAmount, usdValue }: TokenAmountDisplayProps) {
=======
function TokenAmountDisplayInner({ currencyInfo, formattedAmount, usdValue }: TokenAmountDisplayProps) {
>>>>>>> upstream/main
  if (!currencyInfo || !formattedAmount) {
    return null
  }

  return (
    <Flex row alignItems="center" gap="$gap8">
      <CurrencyLogo currencyInfo={currencyInfo} size={32} />
      <Flex gap="$gap2">
        <Text variant="body3" fontWeight="500">
          {formattedAmount}
        </Text>
        {usdValue && (
          <Text variant="body3" color="$neutral2">
            {usdValue}
          </Text>
        )}
      </Flex>
    </Flex>
  )
}

<<<<<<< HEAD
export const TokenAmountDisplay = memo(_TokenAmountDisplay)
=======
export const TokenAmountDisplay = memo(TokenAmountDisplayInner)
>>>>>>> upstream/main
