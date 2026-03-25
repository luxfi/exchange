import { Stack, styled, Text } from '@hanzo/gui'
import type { ReactNode } from 'react'

const PrimaryFrame = styled(Stack, {
  name: 'ActionButton',
  tag: 'button',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  paddingVertical: 18,
  borderRadius: '$rounded16',
  cursor: 'pointer',
  animation: 'quick',
  variants: {
    variant: {
      primary: {
        backgroundColor: '#fff',
        hoverStyle: {
          backgroundColor: 'rgba(255,255,255,0.92)',
          transform: [{ translateY: -1 }],
        },
        pressStyle: {
          backgroundColor: 'rgba(255,255,255,0.85)',
          transform: [{ translateY: 0 }],
        },
      },
      connect: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        hoverStyle: {
          backgroundColor: 'rgba(255,255,255,0.04)',
          borderColor: 'rgba(255,255,255,0.18)',
          transform: [{ translateY: -1 }],
        },
        pressStyle: {
          transform: [{ translateY: 0 }],
        },
      },
      disabled: {
        backgroundColor: 'rgba(255,255,255,0.04)',
        cursor: 'not-allowed',
      },
    },
  } as const,
  defaultVariants: {
    variant: 'primary',
  },
})

const ButtonLabel = styled(Text, {
  name: 'ActionButtonLabel',
  fontSize: 16,
  fontWeight: '600',
  letterSpacing: -0.2,
  variants: {
    variant: {
      primary: { color: '#000' },
      connect: { color: '#fff' },
      disabled: { color: 'rgba(255,255,255,0.2)' },
    },
  } as const,
  defaultVariants: {
    variant: 'primary',
  },
})

export interface ActionButtonProps {
  variant?: 'primary' | 'connect' | 'disabled'
  onPress?: () => void
  children: ReactNode
}

export function ActionButton({ variant = 'primary', onPress, children }: ActionButtonProps) {
  return (
    <PrimaryFrame variant={variant} onPress={variant !== 'disabled' ? onPress : undefined}>
      <ButtonLabel variant={variant}>{children}</ButtonLabel>
    </PrimaryFrame>
  )
}
