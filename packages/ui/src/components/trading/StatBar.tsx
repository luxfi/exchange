import { Stack, styled, Text } from '@hanzo/gui'
import { tradingColors } from './theme'

const BarFrame = styled(Stack, {
  name: 'StatBar',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '$spacing24',
  paddingHorizontal: '$spacing20',
  height: 52,
  borderBottomWidth: 1,
  borderBottomColor: tradingColors.border,
})

const StatGroup = styled(Stack, {
  name: 'StatGroup',
  gap: 1,
})

const Label = styled(Text, {
  fontSize: 10,
  color: tradingColors.textTertiary,
  textTransform: 'uppercase',
  letterSpacing: 0.8,
  fontWeight: '500',
})

const Value = styled(Text, {
  fontSize: 13,
  fontWeight: '600',
  fontVariant: ['tabular-nums'],
  letterSpacing: -0.1,
})

export interface StatItem {
  label: string
  value: string
  color?: string
}

export interface StatBarProps {
  stats: StatItem[]
  trailing?: React.ReactNode
}

export function StatBar({ stats, trailing }: StatBarProps) {
  return (
    <BarFrame>
      {stats.map((stat) => (
        <StatGroup key={stat.label}>
          <Label>{stat.label}</Label>
          <Value color={stat.color || 'rgba(255,255,255,0.8)'}>{stat.value}</Value>
        </StatGroup>
      ))}
      {trailing && <Stack flex={1} alignItems="flex-end">{trailing}</Stack>}
    </BarFrame>
  )
}
