import { styled, Stack, Text } from 'tamagui'
import type { GetProps } from 'tamagui'

const BadgeFrame = styled(Stack, {
  name: 'Badge',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: '$2',
  paddingVertical: '$1',
  borderRadius: '$2',

  variants: {
    variant: {
      default: {
        backgroundColor: '$backgroundHover',
      },
      primary: {
        backgroundColor: '$primary',
      },
      success: {
        backgroundColor: '$success',
      },
      warning: {
        backgroundColor: '$warning',
      },
      error: {
        backgroundColor: '$error',
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '$borderColor',
      },
    },
    size: {
      sm: {
        paddingHorizontal: '$1.5',
        paddingVertical: 2,
      },
      md: {
        paddingHorizontal: '$2',
        paddingVertical: '$1',
      },
      lg: {
        paddingHorizontal: '$3',
        paddingVertical: '$1.5',
      },
    },
  } as const,

  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
})

const BadgeText = styled(Text, {
  name: 'BadgeText',
  fontSize: 12,
  fontWeight: '500',

  variants: {
    variant: {
      default: {
        color: '$color',
      },
      primary: {
        color: 'white',
      },
      success: {
        color: 'white',
      },
      warning: {
        color: 'white',
      },
      error: {
        color: 'white',
      },
      outline: {
        color: '$color',
      },
    },
  } as const,

  defaultVariants: {
    variant: 'default',
  },
})

export type BadgeProps = GetProps<typeof BadgeFrame> & {
  children: React.ReactNode
}

export function Badge({ children, variant = 'default', ...props }: BadgeProps) {
  return (
    <BadgeFrame variant={variant} {...props}>
      <BadgeText variant={variant}>{children}</BadgeText>
    </BadgeFrame>
  )
}
