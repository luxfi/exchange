import { getChromeWithThrow } from '@l.x/utils/src/chrome/chrome'
import { DEFAULT_LANGUAGE_CODE, DEFAULT_LANGUAGE_TAG, DeviceLocale } from '@l.x/utils/src/device/constants'
import { logger } from '@l.x/utils/src/logger/logger'

export function getDeviceLocales(): DeviceLocale[] {
  try {
    const chrome = getChromeWithThrow()
    const language = chrome.i18n.getUILanguage()
    return [{ languageCode: language, languageTag: language }]
  } catch (e) {
    logger.error(e, {
      level: 'warn',
      tags: { file: 'utils.ts', function: 'getDeviceLocales' },
    })
  }
  return [
    {
      languageCode: DEFAULT_LANGUAGE_CODE,
      languageTag: DEFAULT_LANGUAGE_TAG,
    },
  ]
}
