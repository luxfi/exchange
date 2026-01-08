import { forwardRef } from 'react'
import type { GetProps } from 'tamagui'
import { styled, XStack } from 'tamagui'

type InputSize = 'sm' | 'md' | 'lg'

const InputFrame = styled(XStack, {
  name: 'InputFrame',
  alignItems: 'center',
  backgroundColor: '$surface2',
  borderRadius: '$rounded12',
  borderWidth: 1,
  borderColor: '$surface3',
  px: '$spacing12',
  height: 48,
  gap: '$spacing8',

  focusWithinStyle: {
    borderColor: '$accent1',
  },
})

const sizeStyles: Record<InputSize, { height: number; px: number }> = {
  sm: { height: 36, px: 8 },
  md: { height: 48, px: 12 },
  lg: { height: 56, px: 16 },
}

export type InputProps = Omit<GetProps<typeof InputFrame>, 'onChange'> & {
  value?: string
  onChangeText?: (text: string) => void
  placeholder?: string
  type?: 'text' | 'number' | 'password'
  leftElement?: React.ReactNode
  rightElement?: React.ReactNode
  size?: InputSize
  error?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { value, onChangeText, placeholder, type = 'text', leftElement, rightElement, size = 'md', error, ...props },
    ref
  ) => {
    const sizeStyle = sizeStyles[size]

    return (
      <InputFrame
        height={sizeStyle.height}
        px={sizeStyle.px}
        borderColor={error ? '$statusCritical' : '$surface3'}
        {...props}
      >
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

export type InputRef = HTMLInputElement
