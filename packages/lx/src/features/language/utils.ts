import { Language, mapLocaleToLanguage } from 'lx/src/features/language/constants'
import { navigatorLocale } from 'lx/src/features/language/hooks'

// Determines the current language based on the user's locale settings, falling back to English if no mapping exists.
export function getCurrentLanguageFromNavigator(): Language {
  const locale = navigatorLocale()
  return locale ? mapLocaleToLanguage[locale] : Language.English
}
