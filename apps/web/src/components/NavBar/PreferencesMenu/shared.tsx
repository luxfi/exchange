import { Flex, styled } from '@luxfi/ui/src'

export enum PreferencesView {
  SETTINGS = 'Settings',
  LANGUAGE = 'Language',
  CURRENCY = 'Currency',
}

export const SettingsColumn = styled(Flex, {
  width: '100%',
})
