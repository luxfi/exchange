import { createTamagui } from '@l.x/ui/src'
import { animations } from '@l.x/ui/src/theme/animations'
import { configWithoutAnimations, TamaguiGroupNames } from '@l.x/ui/src/theme/config'

const {
  // web has specific settings (see below)
  settings: _settings,
  ...defaultConfig
} = configWithoutAnimations

export const config = createTamagui({
  ...defaultConfig,
  animations,
  settings: {
    // leaving out allowedStyleValues - we want looser string values for most
    // styles (so you can use "1rem", "calc(...)" and other CSS goodies):
    autocompleteSpecificTokens: 'except-special',
  },
})

type Conf = typeof config

declare module '@hanzogui/core' {
  // oxlint-disable-next-line typescript/no-empty-interface
  interface TamaguiCustomConfig extends Conf {}

  interface TypeOverride {
    groupNames(): TamaguiGroupNames
  }
}

export default config
