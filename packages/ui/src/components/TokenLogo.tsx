import type { StackProps } from 'tamagui'
import { Image, Stack, styled, Text } from 'tamagui'

type TokenLogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const TokenLogoFrame = styled(Stack, {
  name: 'TokenLogo',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 1000,
  overflow: 'hidden',
  backgroundColor: '$surface2',
})

const TokenImage = styled(Image, {
  name: 'TokenImage',
  width: '100%',
  height: '100%',
})

const TokenFallback = styled(Text, {
  name: 'TokenFallback',
  fontWeight: '600',
  color: '$neutral2',
})

const sizeStyles: Record<TokenLogoSize, { width: number; height: number }> = {
  xs: { width: 20, height: 20 },
  sm: { width: 24, height: 24 },
  md: { width: 32, height: 32 },
  lg: { width: 40, height: 40 },
  xl: { width: 48, height: 48 },
}

const fontSizeStyles: Record<TokenLogoSize, number> = {
  xs: 8,
  sm: 10,
  md: 12,
  lg: 14,
  xl: 16,
}

export interface TokenLogoProps extends Omit<StackProps, 'size'> {
  symbol: string
  logoURI?: string
  size?: TokenLogoSize
}

export function TokenLogo({ symbol, logoURI, size = 'md', ...props }: TokenLogoProps) {
  const fallbackText = symbol.slice(0, 3).toUpperCase()
  const sizeStyle = sizeStyles[size]
  const fontSize = fontSizeStyles[size]

  return (
    <TokenLogoFrame width={sizeStyle.width} height={sizeStyle.height} {...props}>
      {logoURI ? (
        <TokenImage source={{ uri: logoURI }} />
      ) : (
        <TokenFallback fontSize={fontSize}>{fallbackText}</TokenFallback>
      )}
    </TokenLogoFrame>
  )
}

TokenLogo.displayName = 'TokenLogo'
