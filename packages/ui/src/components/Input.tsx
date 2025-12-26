import { styled, Stack, XStack } from 'tamagui'
import type { GetProps } from 'tamagui'
import { forwardRef } from 'react'

const InputFrame = styled(XStack, {
  name: 'InputFrame',
  alignItems: 'center',
  backgroundColor: '$backgroundHover',
  borderRadius: '$3',
  borderWidth: 1,
  borderColor: '$borderColor',
  paddingHorizontal: '$3',
  height: 48,
  gap: '$2',

  focusWithinStyle: {
    borderColor: '$primary',
  },

  variants: {
    size: {
      sm: {
        height: 36,
        paddingHorizontal: '$2',
      },
      md: {
        height: 48,
        paddingHorizontal: '$3',
      },
      lg: {
        height: 56,
        paddingHorizontal: '$4',
      },
    },
    error: {
      true: {
        borderColor: '$red10',
      },
    },
  } as const,

  defaultVariants: {
    size: 'md',
  },
})

export type InputProps = Omit<GetProps<typeof InputFrame>, 'onChange'> & {
  value?: string
  onChangeText?: (text: string) => void
  placeholder?: string
  type?: 'text' | 'number' | 'password'
  leftElement?: React.ReactNode
  rightElement?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ value, onChangeText, placeholder, type = 'text', leftElement, rightElement, size, error, ...props }, ref) => {
    return (
      <InputFrame size={size} error={error} {...props}>
        {leftElement}
        <input
          ref={ref}
          value={value}
          onChange={(e) => onChangeText?.(e.target.value)}
          placeholder={placeholder}
          type={type}
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: 16,
            color: 'inherit',
          }}
        />
        {rightElement}
      </InputFrame>
    )
  }
)

Input.displayName = 'Input'
