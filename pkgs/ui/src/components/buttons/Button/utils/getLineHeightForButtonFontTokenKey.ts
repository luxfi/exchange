import { getConfig } from '@hanzo/gui'
import { lineHeightFallbacks } from '@luxfi/ui/src/components/buttons/Button/constants'

export const getLineHeightForButtonFontTokenKey = (size: '$micro' | '$small' | '$medium' | '$large'): number => {
  try {
    const { fontsParsed } = getConfig()

    const maybeGuiVariable = fontsParsed['$button']?.lineHeight?.[size]

    if (typeof maybeGuiVariable === 'number') {
      return maybeGuiVariable
    }

    if (typeof maybeGuiVariable?.val === 'number') {
      return maybeGuiVariable.val
    }

    throw new Error(`[getLineHeightForButtonFontTokenKey] Cannot get lineHeight for size: '${size}'`)
  } catch {
    return lineHeightFallbacks[size]
  }
}
