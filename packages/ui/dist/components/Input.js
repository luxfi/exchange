import { forwardRef } from 'react'
import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { styled, XStack } from 'tamagui'

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
  },
  defaultVariants: {
    size: 'md',
  },
})
export const Input = forwardRef(
  ({ value, onChangeText, placeholder, type = 'text', leftElement, rightElement, size, error, ...props }, ref) => {
    return _jsxs(InputFrame, {
      size: size,
      error: error,
      ...props,
      children: [
        leftElement,
        _jsx('input', {
          ref: ref,
          value: value,
          onChange: (e) => onChangeText?.(e.target.value),
          placeholder: placeholder,
          type: type,
          style: {
            flex: 1,
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: 16,
            color: 'inherit',
          },
        }),
        rightElement,
      ],
    })
  }
)
Input.displayName = 'Input'
