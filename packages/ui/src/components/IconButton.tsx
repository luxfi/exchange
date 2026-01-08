import type { StackProps } from 'tamagui'
import { Stack, styled } from 'tamagui'

type IconButtonVariant = 'default' | 'filled' | 'outline'
type IconButtonSize = 'sm' | 'md' | 'lg'

const IconButtonFrame = styled(Stack, {
  name: 'IconButton',
  tag: 'button',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '$rounded8',
  cursor: 'pointer',
  pressStyle: {
    opacity: 0.8,
    scale: 0.95,
  },
  hoverStyle: {
    backgroundColor: '$surface2',
  },
  focusStyle: {
    outlineWidth: 2,
    outlineColor: '$accent1',
    outlineStyle: 'solid',
  },
  disabledStyle: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
})

interface VariantStyle {
  bg: StackProps['backgroundColor']
  borderWidth?: number
  borderColor?: StackProps['borderColor']
}

const variantStyles: Record<IconButtonVariant, VariantStyle> = {
  default: {
    bg: 'transparent',
  },
  filled: {
    bg: '$surface2',
  },
  outline: {
    bg: 'transparent',
    borderWidth: 1,
    borderColor: '$surface3',
  },
}

const sizeStyles: Record<IconButtonSize, { width: number; height: number }> = {
  sm: { width: 28, height: 28 },
  md: { width: 36, height: 36 },
  lg: { width: 44, height: 44 },
}

export interface IconButtonProps extends Omit<StackProps, 'size'> {
  variant?: IconButtonVariant
  size?: IconButtonSize
  circular?: boolean
  children?: React.ReactNode
}

export function IconButton({
  variant = 'default',
  size = 'md',
  circular = false,
  children,
  ...props
}: IconButtonProps) {
  const variantStyle = variantStyles[variant]
  const sizeStyle = sizeStyles[size]

  return (
    <IconButtonFrame
      backgroundColor={variantStyle.bg}
      borderWidth={variantStyle.borderWidth}
      borderColor={variantStyle.borderColor}
      width={sizeStyle.width}
      height={sizeStyle.height}
      borderRadius={circular ? 1000 : '$rounded8'}
      {...props}
    >
      {children}
    </IconButtonFrame>
  )
}
