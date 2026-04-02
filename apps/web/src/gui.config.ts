import { createGui } from 'ui/src'
import { animations } from 'ui/src/theme/animations'
import { configWithoutAnimations, GuiGroupNames } from 'ui/src/theme/config'

const {
  // web has specific settings (see below)
  settings: _settings,
  ...defaultConfig
} = configWithoutAnimations

export const config = createGui({
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
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface GuiCustomConfig extends Conf {}

  interface TypeOverride {
    groupNames(): GuiGroupNames
  }
}

export default config
