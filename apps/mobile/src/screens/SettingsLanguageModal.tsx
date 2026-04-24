import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { SettingsListModal } from 'src/components/Settings/lists/SettingsListModal'
import { Language, mapLanguageToLocale, WALLET_SUPPORTED_LANGUAGES } from '@l.x/lx/src/features/language/constants'
import { getLanguageInfo, useCurrentLanguage } from '@l.x/lx/src/features/language/hooks'
import { setCurrentLanguage } from '@l.x/lx/src/features/settings/slice'
import { ModalName } from '@l.x/lx/src/features/telemetry/constants'
import { changeLanguage } from '@l.x/lx/src/i18n'
import { useEvent } from '@l.x/utils/src/react/hooks'

export function SettingsLanguageModal(): JSX.Element {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const selectedLanguage = useCurrentLanguage()

  const getLanguageTitle = useCallback(
    (language: Language) => {
      return getLanguageInfo(t, language).displayName
    },
    [t],
  )

  const onSelectLanguageOption = useEvent(async (language: Language) => {
    await changeLanguage(mapLanguageToLocale[language])
    dispatch(setCurrentLanguage(language))
  })

  return (
    <SettingsListModal
      modalName={ModalName.LanguageSelector}
      title={t('settings.setting.language.title')}
      selectedItem={selectedLanguage}
      options={WALLET_SUPPORTED_LANGUAGES}
      getItemTitle={getLanguageTitle}
      onSelectItem={onSelectLanguageOption}
    />
  )
}
