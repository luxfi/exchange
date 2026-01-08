import type { StackProps } from 'tamagui'
import { Stack, styled } from 'tamagui'

type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl'

const SpinnerFrame = styled(Stack, {
  name: 'Spinner',
  borderWidth: 2,
  borderColor: '$surface3',
  borderTopColor: '$accent1',
  borderRadius: 1000,
  animation: 'lazy',
  rotate: '0deg',
})

const sizeStyles: Record<SpinnerSize, { width: number; height: number; borderWidth: number }> = {
  sm: { width: 16, height: 16, borderWidth: 2 },
  md: { width: 24, height: 24, borderWidth: 2 },
  lg: { width: 32, height: 32, borderWidth: 3 },
  xl: { width: 48, height: 48, borderWidth: 4 },
}

export interface SpinnerProps extends Omit<StackProps, 'size'> {
  size?: SpinnerSize
}

export function Spinner({ size = 'md', ...props }: SpinnerProps) {
  const sizeStyle = sizeStyles[size]

  return (
    <SpinnerFrame width={sizeStyle.width} height={sizeStyle.height} borderWidth={sizeStyle.borderWidth} {...props} />
  )
}
