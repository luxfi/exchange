import { Stack, styled } from 'tamagui'
export const Skeleton = styled(Stack, {
  name: 'Skeleton',
  backgroundColor: '$backgroundHover',
  borderRadius: '$2',
  animation: 'lazy',
  // Pulse animation via opacity
  animateOnly: ['opacity'],
  opacity: 1,
  enterStyle: {
    opacity: 0.5,
  },
  variants: {
    variant: {
      text: {
        height: 16,
        width: '100%',
      },
      circular: {
        borderRadius: 1000,
      },
      rectangular: {
        borderRadius: '$2',
      },
    },
    width: {
      sm: { width: 60 },
      md: { width: 100 },
      lg: { width: 160 },
      full: { width: '100%' },
    },
    height: {
      sm: { height: 16 },
      md: { height: 24 },
      lg: { height: 40 },
      xl: { height: 60 },
    },
  },
  defaultVariants: {
    variant: 'rectangular',
    width: 'full',
    height: 'md',
  },
})
