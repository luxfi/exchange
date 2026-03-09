import { Stack, styled, Text } from 'tamagui'

const PillFrame = styled(Stack, {
  name: 'TokenPill',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '$spacing6',
  paddingVertical: 8,
  paddingHorizontal: 14,
  backgroundColor: 'rgba(255,255,255,0.06)',
  borderRadius: '$roundedFull',
  flexShrink: 0,
  hoverStyle: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
})

const PillLabel = styled(Text, {
  name: 'TokenPillLabel',
  fontSize: 15,
  fontWeight: '700',
  color: '#fff',
})

export interface TokenPillProps {
  symbol: string
  onPress?: () => void
}

export function TokenPill({ symbol, onPress }: TokenPillProps) {
  return (
    <PillFrame onPress={onPress} cursor={onPress ? 'pointer' : 'default'}>
      <PillLabel>{symbol}</PillLabel>
    </PillFrame>
  )
}
