import { styled, GetProps } from '@tamagui/core'
import { Stack, Text } from 'tamagui'

const ButtonFrame = styled(Stack, {
  name: 'Button',
  tag: 'button',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row',
  gap: '$2',
  borderRadius: '$3',
  paddingHorizontal: '$4',
  paddingVertical: '$3',
  cursor: 'pointer',
  pressStyle: {
    opacity: 0.8,
    scale: 0.98,
  },
  hoverStyle: {
    opacity: 0.9,
  },
  focusStyle: {
    outlineWidth: 2,
    outlineColor: '$primary',
    outlineStyle: 'solid',
    outlineOffset: 2,
  },
  disabledStyle: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },

  variants: {
    variant: {
      primary: {
        backgroundColor: '$primary',
        color: 'white',
        hoverStyle: {
          backgroundColor: '$primaryHover',
        },
      },
      secondary: {
        backgroundColor: '$secondary',
        color: '$color',
        hoverStyle: {
          backgroundColor: '$secondaryHover',
        },
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '$borderColor',
        color: '$color',
        hoverStyle: {
          backgroundColor: '$backgroundHover',
        },
      },
      ghost: {
        backgroundColor: 'transparent',
        color: '$color',
        hoverStyle: {
          backgroundColor: '$backgroundHover',
        },
      },
      destructive: {
        backgroundColor: '$error',
        color: 'white',
        hoverStyle: {
          backgroundColor: '$errorDark' as any,
        },
      },
    },

    size: {
      sm: {
        paddingHorizontal: '$3',
        paddingVertical: '$2',
        height: 32,
      },
      md: {
        paddingHorizontal: '$4',
        paddingVertical: '$3',
        height: 40,
      },
      lg: {
        paddingHorizontal: '$5',
        paddingVertical: '$4',
        height: 48,
      },
      xl: {
        paddingHorizontal: '$6',
        paddingVertical: '$5',
        height: 56,
      },
    },

    fullWidth: {
      true: {
        width: '100%',
      },
    },

    circular: {
      true: {
        borderRadius: '$round',
        paddingHorizontal: 0,
        aspectRatio: 1,
      },
    },
  } as const,

  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

const ButtonText = styled(Text, {
  name: 'ButtonText',
  fontFamily: '$body',
  fontWeight: '600',
  color: 'inherit',

  variants: {
    size: {
      sm: { fontSize: 13 },
      md: { fontSize: 14 },
      lg: { fontSize: 16 },
      xl: { fontSize: 18 },
    },
  } as const,

  defaultVariants: {
    size: 'md',
  },
})

export type ButtonProps = GetProps<typeof ButtonFrame> & {
  children?: React.ReactNode
}

export function Button({ children, size, ...props }: ButtonProps) {
  return (
    <ButtonFrame size={size} {...props}>
      {typeof children === 'string' ? (
        <ButtonText size={size}>{children}</ButtonText>
      ) : (
        children
      )}
    </ButtonFrame>
  )
}

Button.displayName = 'Button'
