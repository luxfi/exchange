import { styled, GetProps } from '@tamagui/core'
import { Stack, Text, H3 } from 'tamagui'

export const Card = styled(Stack, {
  name: 'Card',
  backgroundColor: '$card',
  borderRadius: '$4',
  borderWidth: 1,
  borderColor: '$borderColor',
  padding: '$4',
  gap: '$3',

  variants: {
    variant: {
      default: {},
      elevated: {
        shadowColor: '$black',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '$borderColor',
      },
      ghost: {
        backgroundColor: 'transparent',
        borderWidth: 0,
      },
    },

    size: {
      sm: {
        padding: '$3',
        gap: '$2',
      },
      md: {
        padding: '$4',
        gap: '$3',
      },
      lg: {
        padding: '$5',
        gap: '$4',
      },
    },

    hoverable: {
      true: {
        cursor: 'pointer',
        hoverStyle: {
          backgroundColor: '$cardHover',
        },
        pressStyle: {
          opacity: 0.9,
        },
      },
    },
  } as const,

  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
})

export const CardHeader = styled(Stack, {
  name: 'CardHeader',
  gap: '$2',
})

export const CardTitle = styled(H3, {
  name: 'CardTitle',
  fontWeight: '600',
})

export const CardDescription = styled(Text, {
  name: 'CardDescription',
  color: '$mutedForeground',
  fontSize: 14,
})

export const CardContent = styled(Stack, {
  name: 'CardContent',
  gap: '$3',
})

export const CardFooter = styled(Stack, {
  name: 'CardFooter',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '$2',
  paddingTop: '$3',
})

export type CardProps = GetProps<typeof Card>
