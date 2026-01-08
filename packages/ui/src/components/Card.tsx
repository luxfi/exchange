import type { GetProps, StackProps } from 'tamagui'
import { H3, Stack, styled, Text } from 'tamagui'

type CardVariant = 'default' | 'elevated' | 'outline' | 'ghost'
type CardSize = 'sm' | 'md' | 'lg'

const CardFrame = styled(Stack, {
  name: 'Card',
  backgroundColor: '$surface2',
  borderRadius: '$rounded16',
  borderWidth: 1,
  borderColor: '$surface3',
  p: '$spacing16',
  gap: '$spacing12',
})

interface VariantStyle {
  bg: StackProps['backgroundColor']
  borderWidth: number
  borderColor: StackProps['borderColor']
  shadow?: boolean
}

const variantStyles: Record<CardVariant, VariantStyle> = {
  default: { bg: '$surface2', borderWidth: 1, borderColor: '$surface3' },
  elevated: { bg: '$surface2', borderWidth: 0, borderColor: 'transparent', shadow: true },
  outline: { bg: 'transparent', borderWidth: 1, borderColor: '$surface3' },
  ghost: { bg: 'transparent', borderWidth: 0, borderColor: 'transparent' },
}

interface SizeStyle {
  p: number
  gap: number
}

const sizeStyles: Record<CardSize, SizeStyle> = {
  sm: { p: 12, gap: 8 },
  md: { p: 16, gap: 12 },
  lg: { p: 20, gap: 16 },
}

export interface CardProps extends StackProps {
  variant?: CardVariant
  size?: CardSize
  hoverable?: boolean
}

export function Card({ variant = 'default', size = 'md', hoverable, ...props }: CardProps) {
  const variantStyle = variantStyles[variant]
  const sizeStyle = sizeStyles[size]

  return (
    <CardFrame
      backgroundColor={variantStyle.bg}
      borderWidth={variantStyle.borderWidth}
      borderColor={variantStyle.borderColor}
      p={sizeStyle.p}
      gap={sizeStyle.gap}
      cursor={hoverable ? 'pointer' : undefined}
      hoverStyle={hoverable ? { backgroundColor: '$surface3' } : undefined}
      pressStyle={hoverable ? { opacity: 0.9 } : undefined}
      {...(variantStyle.shadow
        ? {
            shadowColor: '$black',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
          }
        : {})}
      {...props}
    />
  )
}

export const CardHeader = styled(Stack, {
  name: 'CardHeader',
  gap: '$spacing8',
})

export const CardTitle = styled(H3, {
  name: 'CardTitle',
  fontWeight: '600',
})

export const CardDescription = styled(Text, {
  name: 'CardDescription',
  color: '$neutral2',
  fontSize: 14,
})

export const CardContent = styled(Stack, {
  name: 'CardContent',
  gap: '$spacing12',
})

export const CardFooter = styled(Stack, {
  name: 'CardFooter',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '$spacing8',
  pt: '$spacing12',
})

export type CardFrameProps = GetProps<typeof CardFrame>
