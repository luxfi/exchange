import { Stack, styled, Text, Input } from 'tamagui'
import { tradingColors } from './theme'
import { TokenPill } from './TokenPill'

const InputBlock = styled(Stack, {
  name: 'TokenInputBlock',
  padding: '$spacing16',
  backgroundColor: tradingColors.bgSecondary,
  borderWidth: 1,
  borderColor: tradingColors.border,
  borderRadius: '$rounded16',
  gap: '$spacing8',
  animation: 'quick',
  variants: {
    focused: {
      true: {
        borderColor: tradingColors.borderFocus,
      },
    },
  } as const,
})

const Label = styled(Text, {
  name: 'TokenInputLabel',
  fontSize: 13,
  color: tradingColors.textSecondary,
  fontWeight: '500',
})

const AmountInput = styled(Input, {
  name: 'TokenAmountInput',
  flex: 1,
  backgroundColor: 'transparent',
  borderWidth: 0,
  color: '#fff',
  fontSize: 28,
  fontWeight: '500',
  padding: 0,
  placeholderTextColor: tradingColors.textMuted,
})

const Row = styled(Stack, {
  flexDirection: 'row',
  alignItems: 'center',
  gap: '$spacing8',
})

export interface TokenInputProps {
  label: string
  value: string
  onChange?: (value: string) => void
  tokenSymbol: string
  readOnly?: boolean
  disabled?: boolean
  focused?: boolean
  onFocus?: () => void
  onBlur?: () => void
  onTokenPress?: () => void
}

export function TokenInput({
  label,
  value,
  onChange,
  tokenSymbol,
  readOnly,
  disabled,
  focused,
  onFocus,
  onBlur,
  onTokenPress,
}: TokenInputProps) {
  return (
    <InputBlock focused={focused}>
      <Label>{label}</Label>
      <Row>
        <AmountInput
          value={value}
          onChangeText={onChange}
          placeholder="0"
          inputMode="decimal"
          editable={!readOnly && !disabled}
          opacity={disabled && !value ? 0.2 : readOnly ? 0.8 : 1}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        <TokenPill symbol={tokenSymbol} onPress={onTokenPress} />
      </Row>
    </InputBlock>
  )
}
