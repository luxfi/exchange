<<<<<<< HEAD
import { Language } from 'lx/src/features/language/constants'
import { useCurrentLanguage } from 'lx/src/features/language/hooks'
=======
import { Language } from 'uniswap/src/features/language/constants'
import { useCurrentLanguage } from 'uniswap/src/features/language/hooks'
>>>>>>> upstream/main

// For special Vietnamese characters that extend beyond the text frame,
// we do not apply line height to avoid truncating the text.
export function useRegionalizedLineHeight(): 'unset' | undefined {
  const currentLanguage = useCurrentLanguage()
  return currentLanguage === Language.Vietnamese ? 'unset' : undefined
}
