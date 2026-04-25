import '@l.x/lx/src/i18n/locales/@types/i18next'

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enUS from '@l.x/lx/src/i18n/locales/source/en-US.json'
import esES from '@l.x/lx/src/i18n/locales/translations/es-ES.json'
import frFR from '@l.x/lx/src/i18n/locales/translations/fr-FR.json'
import idID from '@l.x/lx/src/i18n/locales/translations/id-ID.json'
import jaJP from '@l.x/lx/src/i18n/locales/translations/ja-JP.json'
import nlNL from '@l.x/lx/src/i18n/locales/translations/nl-NL.json'
import ptPT from '@l.x/lx/src/i18n/locales/translations/pt-PT.json'
import ruRU from '@l.x/lx/src/i18n/locales/translations/ru-RU.json'
import trTR from '@l.x/lx/src/i18n/locales/translations/tr-TR.json'
import viVN from '@l.x/lx/src/i18n/locales/translations/vi-VN.json'
import zhCN from '@l.x/lx/src/i18n/locales/translations/zh-CN.json'
import zhTW from '@l.x/lx/src/i18n/locales/translations/zh-TW.json'
import { MissingI18nInterpolationError } from '@l.x/lx/src/i18n/shared'
import { getWalletDeviceLocale } from '@l.x/lx/src/i18n/utils'
import { logger } from '@l.x/utils/src/logger/logger'

// `localeKey` is the canonical locale identifier used as a lookup key in
// feature-flag payload translation tables (e.g. force-upgrade copy).
const resources = {
  'zh-Hans': { translation: zhCN, localeKey: 'zh-CN' },
  'zh-Hant': { translation: zhTW, localeKey: 'zh-TW' },
  'nl-NL': { translation: nlNL, localeKey: 'nl-NL' },
  'en-US': { translation: enUS, localeKey: 'en-US' },
  'fr-FR': { translation: frFR, localeKey: 'fr-FR' },
  'id-ID': { translation: idID, localeKey: 'id-ID' },
  'ja-JP': { translation: jaJP, localeKey: 'ja-JP' },
  'pt-PT': { translation: ptPT, localeKey: 'pt-PT' },
  'ru-RU': { translation: ruRU, localeKey: 'ru-RU' },
  // Spanish locales that use `,` as the decimal separator
  'es-419': { translation: esES, localeKey: 'es-ES' },
  'es-BZ': { translation: esES, localeKey: 'es-ES' },
  'es-CU': { translation: esES, localeKey: 'es-ES' },
  'es-DO': { translation: esES, localeKey: 'es-ES' },
  'es-GT': { translation: esES, localeKey: 'es-ES' },
  'es-HN': { translation: esES, localeKey: 'es-ES' },
  'es-MX': { translation: esES, localeKey: 'es-ES' },
  'es-NI': { translation: esES, localeKey: 'es-ES' },
  'es-PA': { translation: esES, localeKey: 'es-ES' },
  'es-PE': { translation: esES, localeKey: 'es-ES' },
  'es-PR': { translation: esES, localeKey: 'es-ES' },
  'es-SV': { translation: esES, localeKey: 'es-ES' },
  'es-US': { translation: esES, localeKey: 'es-ES' },
  // Spanish locales that use `.` as the decimal separator
  'es-AR': { translation: esES, localeKey: 'es-ES' },
  'es-BO': { translation: esES, localeKey: 'es-ES' },
  'es-CL': { translation: esES, localeKey: 'es-ES' },
  'es-CO': { translation: esES, localeKey: 'es-ES' },
  'es-CR': { translation: esES, localeKey: 'es-ES' },
  'es-EC': { translation: esES, localeKey: 'es-ES' },
  'es-ES': { translation: esES, localeKey: 'es-ES' },
  'es-PY': { translation: esES, localeKey: 'es-ES' },
  'es-UY': { translation: esES, localeKey: 'es-ES' },
  'es-VE': { translation: esES, localeKey: 'es-ES' },
  'tr-TR': { translation: trTR, localeKey: 'tr-TR' },
  'vi-VN': { translation: viVN, localeKey: 'vi-VN' },
}

const defaultNS = 'translation'

i18n
  .use(initReactI18next)
  .init({
    defaultNS,
    lng: getWalletDeviceLocale(),
    fallbackLng: 'en-US',
    resources,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    react: {
      transSupportBasicHtmlNodes: false, // disabling since this breaks for mobile
    },
    missingInterpolationHandler: (text) => {
      logger.error(new MissingI18nInterpolationError(`Missing i18n interpolation value: ${text}`), {
        tags: {
          file: 'i18n-setup.tsx',
          function: 'init',
        },
      })
      return '' // Using empty string for missing interpolation
    },
  })
  .catch(() => undefined)

// eslint-disable-next-line max-params
i18n.on('missingKey', (_lngs, _ns, key, _res) => {
  logger.error(new Error(`Missing i18n string key ${key} for language ${i18n.language}`), {
    tags: {
      file: 'i18n-setup.tsx',
      function: 'onMissingKey',
    },
  })
})
