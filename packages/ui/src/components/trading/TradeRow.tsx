import { Stack, styled, Text } from 'tamagui'
import { tradingColors } from './theme'

const Row = styled(Stack, {
  name: 'TradeRow',
  flexDirection: 'row',
  paddingVertical: 4,
  paddingHorizontal: '$spacing16',
  animation: 'quick',
  hoverStyle: {
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
})

const Cell = styled(Text, {
  name: 'TradeCell',
  fontSize: 12,
  fontFamily: '$monospace',
  fontVariant: ['tabular-nums'],
})

export interface TradeRowProps {
  price: string
  amount: string
  time: string
  isSell?: boolean
}

export function TradeRow({ price, amount, time, isSell }: TradeRowProps) {
  return (
    <Row>
      <Cell flex={1} color={isSell ? tradingColors.sell : tradingColors.buy}>
        {price}
      </Cell>
      <Cell flex={1} textAlign="right" color={tradingColors.textSecondary}>
        {amount}
      </Cell>
      <Cell width={52} textAlign="right" color={tradingColors.textTertiary}>
        {time}
      </Cell>
    </Row>
  )
}
