import type { StackProps, TextProps } from 'tamagui'
import { Stack, styled, Text } from 'tamagui'

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'outline'
type BadgeSize = 'sm' | 'md' | 'lg'

const BadgeFrame = styled(Stack, {
  name: 'Badge',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  px: '$spacing8',
  py: '$spacing4',
  borderRadius: '$rounded8',
})

const BadgeText = styled(Text, {
  name: 'BadgeText',
  fontSize: 12,
  fontWeight: '500',
})

const variantStyles: Record<BadgeVariant, { bg: StackProps['backgroundColor']; textColor: TextProps['color'] }> = {
  default: { bg: '$surface2', textColor: '$neutral1' },
  primary: { bg: '$accent1', textColor: '$surface1' },
  success: { bg: '$statusSuccess', textColor: '$surface1' },
  warning: { bg: '$statusWarning', textColor: '$surface1' },
  error: { bg: '$statusCritical', textColor: '$surface1' },
  outline: { bg: 'transparent', textColor: '$neutral1' },
}

const sizeStyles: Record<BadgeSize, { px: number; py: number }> = {
  sm: { px: 6, py: 2 },
  md: { px: 8, py: 4 },
  lg: { px: 12, py: 6 },
}

export interface BadgeProps extends Omit<StackProps, 'children'> {
  children: React.ReactNode
  variant?: BadgeVariant
  size?: BadgeSize
}

export function Badge({ children, variant = 'default', size = 'md', ...props }: BadgeProps) {
  const variantStyle = variantStyles[variant]
  const sizeStyle = sizeStyles[size]

  return (
    <BadgeFrame
      backgroundColor={variantStyle.bg}
      px={sizeStyle.px}
      py={sizeStyle.py}
      borderWidth={variant === 'outline' ? 1 : 0}
      borderColor={variant === 'outline' ? '$surface3' : undefined}
      {...props}
    >
      <BadgeText color={variantStyle.textColor}>{children}</BadgeText>
    </BadgeFrame>
  )
}
