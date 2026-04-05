<<<<<<< HEAD
import { Flex, styled } from '@l.x/ui/src'
import { fonts, TextVariantTokens } from '@l.x/ui/src/theme'
=======
import { Flex, styled } from 'ui/src'
import { fonts, TextVariantTokens } from 'ui/src/theme'
>>>>>>> upstream/main

const LOADER_PADDING = 2
export function TextLoader({ variant, width }: { variant: TextVariantTokens; width: number }) {
  const height = fonts[variant].lineHeight

  return (
    <Flex
      backgroundColor="$surface3"
      borderRadius="$rounded6"
      width={width}
      height={height - LOADER_PADDING * 2}
      my={LOADER_PADDING}
    />
  )
}

export const LoadingRow = styled(Flex, {
  my: '$spacing16',
})
