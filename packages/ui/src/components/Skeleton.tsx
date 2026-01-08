import type { StackProps } from 'tamagui'
import { Stack, styled } from 'tamagui'

type SkeletonVariant = 'text' | 'circular' | 'rectangular'
type SkeletonWidth = 'sm' | 'md' | 'lg' | 'full'
type SkeletonHeight = 'sm' | 'md' | 'lg' | 'xl'

const SkeletonFrame = styled(Stack, {
  name: 'Skeleton',
  backgroundColor: '$surface2',
  borderRadius: '$rounded8',
  animation: 'lazy',

  // Pulse animation via opacity
  animateOnly: ['opacity'],
  opacity: 1,
  enterStyle: {
    opacity: 0.5,
  },
})

interface VariantStyle {
  borderRadius?: number
  height?: number
  width?: number
  fullWidth?: boolean
}

const variantStyles: Record<SkeletonVariant, VariantStyle> = {
  text: {
    height: 16,
    fullWidth: true,
  },
  circular: {
    borderRadius: 1000,
  },
  rectangular: {
    // Uses default borderRadius from SkeletonFrame
  },
}

const widthMap: Record<Exclude<SkeletonWidth, 'full'>, number> = {
  sm: 60,
  md: 100,
  lg: 160,
}

const heightMap: Record<SkeletonHeight, number> = {
  sm: 16,
  md: 24,
  lg: 40,
  xl: 60,
}

export interface SkeletonProps extends Omit<StackProps, 'width' | 'height'> {
  variant?: SkeletonVariant
  width?: SkeletonWidth | number
  height?: SkeletonHeight | number
}

export function Skeleton({ variant = 'rectangular', width = 'full', height = 'md', ...props }: SkeletonProps) {
  const variantStyle = variantStyles[variant]

  const isFullWidth = width === 'full' || variantStyle.fullWidth

  const resolvedWidth: number | undefined =
    typeof width === 'number' ? width : width !== 'full' ? widthMap[width] : undefined

  const resolvedHeight: number = typeof height === 'number' ? height : heightMap[height]

  return (
    <SkeletonFrame
      width={variantStyle.width ?? resolvedWidth}
      height={variantStyle.height ?? resolvedHeight}
      borderRadius={variantStyle.borderRadius}
      flex={isFullWidth ? 1 : undefined}
      alignSelf={isFullWidth ? 'stretch' : undefined}
      {...props}
    />
  )
}
