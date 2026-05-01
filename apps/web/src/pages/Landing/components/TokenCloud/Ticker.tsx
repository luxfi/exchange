// `@l.x/api` import dropped — its npm publish ships unresolved __generated__/* files
// which break the TokenCloud chunk's dynamic import at runtime. We stub the
// useTokenPromoQuery hook with a no-op that returns no price data — the cloud
// still renders the logos; only the price-delta badge stays empty.
const useTokenPromoQuery = (_args: any) => ({ data: undefined as any, loading: false, error: undefined })
import { useMemo } from 'react'
import { Flex, Text } from '@l.x/ui/src'
import { ItemPoint } from '@l.x/lx/src/components/IconCloud/IconCloud'
import { useLocalizationContext } from '@l.x/lx/src/features/language/LocalizationContext'
import { DeltaArrow } from '~/components/DeltaArrow/DeltaArrow'
import { NATIVE_CHAIN_ID } from '~/constants/tokens'
import { InteractiveToken } from '~/pages/Landing/assets/approvedTokens'

export function Ticker({ itemPoint }: { itemPoint: ItemPoint<InteractiveToken> }) {
  const { formatPercent } = useLocalizationContext()

  const { color, size, floatingElementPosition, itemData } = itemPoint
  const { address, chain, symbol } = itemData

  const tokenPromoQuery = useTokenPromoQuery({
    variables: {
      address: address !== NATIVE_CHAIN_ID ? address : undefined,
      chain,
    },
  })

  const pricePercentChange = useMemo(() => {
    return tokenPromoQuery.data?.token?.market?.pricePercentChange?.value ?? 0
  }, [tokenPromoQuery.data?.token?.market?.pricePercentChange?.value])

  return (
    <Flex
      position="absolute"
      flex={1}
      row
      opacity={0}
      x={0}
      transition="all 0.1s ease-in-out"
      gap={20}
      $group-item-hover={{
        opacity: 1,
        x: 8,
      }}
      {...(floatingElementPosition === 'right' ? { left: size * 1.25 } : { right: size * 0.6 })}
    >
      <Flex justifyContent="center">
        <Text
          fontSize={14}
          fontWeight="$medium"
          color={color}
          textAlign={floatingElementPosition === 'right' ? 'left' : 'right'}
        >
          {symbol}
        </Text>
        <Flex row alignItems="center">
          <DeltaArrow delta={pricePercentChange} formattedDelta={formatPercent(Math.abs(pricePercentChange))} />
          <Text variant="body2">{formatPercent(Math.abs(pricePercentChange))}</Text>
        </Flex>
      </Flex>
    </Flex>
  )
}
