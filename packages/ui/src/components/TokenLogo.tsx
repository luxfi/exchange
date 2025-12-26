import { styled, GetProps } from '@tamagui/core'
import { Stack, Image, Text } from 'tamagui'

const TokenLogoFrame = styled(Stack, {
  name: 'TokenLogo',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '$round',
  overflow: 'hidden',
  backgroundColor: '$muted',

  variants: {
    size: {
      xs: { width: 20, height: 20 },
      sm: { width: 24, height: 24 },
      md: { width: 32, height: 32 },
      lg: { width: 40, height: 40 },
      xl: { width: 48, height: 48 },
    },
  } as const,

  defaultVariants: {
    size: 'md',
  },
})

const TokenImage = styled(Image, {
  name: 'TokenImage',
  width: '100%',
  height: '100%',
})

const TokenFallback = styled(Text, {
  name: 'TokenFallback',
  fontWeight: '600',
  color: '$mutedForeground',

  variants: {
    size: {
      xs: { fontSize: 8 },
      sm: { fontSize: 10 },
      md: { fontSize: 12 },
      lg: { fontSize: 14 },
      xl: { fontSize: 16 },
    },
  } as const,

  defaultVariants: {
    size: 'md',
  },
})

export type TokenLogoProps = GetProps<typeof TokenLogoFrame> & {
  symbol: string
  logoURI?: string
}

export function TokenLogo({ symbol, logoURI, size, ...props }: TokenLogoProps) {
  const fallbackText = symbol.slice(0, 3).toUpperCase()

  return (
    <TokenLogoFrame size={size} {...props}>
      {logoURI ? (
        <TokenImage source={{ uri: logoURI }} />
      ) : (
        <TokenFallback size={size}>{fallbackText}</TokenFallback>
      )}
    </TokenLogoFrame>
  )
}

TokenLogo.displayName = 'TokenLogo'
