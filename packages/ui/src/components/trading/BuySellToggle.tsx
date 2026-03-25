import { Stack, styled, Text } from '@hanzo/gui'
import { tradingColors, type TradingSide } from './theme'

const ToggleFrame = styled(Stack, {
  name: 'BuySellToggle',
  flexDirection: 'row',
  backgroundColor: 'rgba(255,255,255,0.04)',
  borderRadius: '$rounded12',
  padding: 3,
  gap: 2,
})

const ToggleButton = styled(Stack, {
  name: 'ToggleButton',
  tag: 'button',
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 6,
  paddingHorizontal: 16,
  borderRadius: '$rounded8',
  cursor: 'pointer',
  animation: 'quick',
})

const ToggleLabel = styled(Text, {
  name: 'ToggleLabel',
  fontSize: 13,
  fontWeight: '600',
})

export interface BuySellToggleProps {
  side: TradingSide
  onChange: (side: TradingSide) => void
}

export function BuySellToggle({ side, onChange }: BuySellToggleProps) {
  return (
    <ToggleFrame>
      <ToggleButton
        backgroundColor={side === 'buy' ? tradingColors.buyMuted : 'transparent'}
        onPress={() => onChange('buy')}
      >
        <ToggleLabel color={side === 'buy' ? tradingColors.buy : tradingColors.textTertiary}>
          Buy
        </ToggleLabel>
      </ToggleButton>
      <ToggleButton
        backgroundColor={side === 'sell' ? tradingColors.sellMuted : 'transparent'}
        onPress={() => onChange('sell')}
      >
        <ToggleLabel color={side === 'sell' ? tradingColors.sell : tradingColors.textTertiary}>
          Sell
        </ToggleLabel>
      </ToggleButton>
    </ToggleFrame>
  )
}
