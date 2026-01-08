import type { StackProps, TextProps } from 'tamagui'
import { Stack, styled, Text } from 'tamagui'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'

const ButtonFrame = styled(Stack, {
  name: 'Button',
  tag: 'button',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row',
  gap: '$spacing8',
  borderRadius: '$rounded12',
  cursor: 'pointer',
  pressStyle: {
    opacity: 0.8,
    scale: 0.98,
  },
  hoverStyle: {
    opacity: 0.9,
  },
  disabledStyle: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
})

const ButtonText = styled(Text, {
  name: 'ButtonText',
  fontFamily: '$body',
  fontWeight: '600',
})

interface VariantStyle {
  bg: StackProps['backgroundColor']
  textColor: TextProps['color']
  borderWidth?: number
  borderColor?: StackProps['borderColor']
}

const variantStyles: Record<ButtonVariant, VariantStyle> = {
  primary: { bg: '$accent1', textColor: '$surface1' },
  secondary: { bg: '$surface2', textColor: '$neutral1' },
  outline: { bg: 'transparent', textColor: '$neutral1', borderWidth: 1, borderColor: '$surface3' },
  ghost: { bg: 'transparent', textColor: '$neutral1' },
  destructive: { bg: '$statusCritical', textColor: '$surface1' },
}

interface SizeStyle {
  px: number
  py: number
  height: number
  fontSize: number
}

const sizeStyles: Record<ButtonSize, SizeStyle> = {
  sm: { px: 12, py: 8, height: 32, fontSize: 13 },
  md: { px: 16, py: 12, height: 40, fontSize: 14 },
  lg: { px: 20, py: 16, height: 48, fontSize: 16 },
  xl: { px: 24, py: 20, height: 56, fontSize: 18 },
}

export interface ButtonProps extends Omit<StackProps, 'children'> {
  children?: React.ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  circular?: boolean
  disabled?: boolean
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth,
  circular,
  disabled,
  ...props
}: ButtonProps) {
  const variantStyle = variantStyles[variant]
  const sizeStyle = sizeStyles[size]

  return (
    <ButtonFrame
      backgroundColor={variantStyle.bg}
      borderWidth={variantStyle.borderWidth ?? 0}
      borderColor={variantStyle.borderColor}
      px={circular ? 0 : sizeStyle.px}
      py={sizeStyle.py}
      height={sizeStyle.height}
      width={fullWidth ? '100%' : undefined}
      borderRadius={circular ? '$roundedFull' : '$rounded12'}
      aspectRatio={circular ? 1 : undefined}
      opacity={disabled ? 0.5 : 1}
      cursor={disabled ? 'not-allowed' : 'pointer'}
      pointerEvents={disabled ? 'none' : 'auto'}
      {...props}
    >
      {typeof children === 'string' ? (
        <ButtonText color={variantStyle.textColor} fontSize={sizeStyle.fontSize}>
          {children}
        </ButtonText>
      ) : (
        children
      )}
    </ButtonFrame>
  )
}

Button.displayName = 'Button'
