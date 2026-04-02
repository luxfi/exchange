// until the web app needs all of gui, avoid heavy imports there
// biome-ignore lint/style/noRestrictedImports: until the web app needs all of gui, avoid heavy imports there
import type { CreateTamaguiProps as CreateGuiProps } from '@hanzogui/core'
import { allFonts } from '@l.x/ui/src/theme/fonts'
import { media } from '@l.x/ui/src/theme/media'
import { shorthands } from '@l.x/ui/src/theme/shorthands'
import { themes } from '@l.x/ui/src/theme/themes'
import { tokens } from '@l.x/ui/src/theme/tokens'

/**
 * Exporting without animations here since we are diverging the drivers between apps
 */

export const configWithoutAnimations = {
  shorthands,
  fonts: allFonts,
  themes,
  tokens,
  media,
  settings: {
    shouldAddPrefersColorThemes: true,
    themeClassNameOnRoot: true,
    disableSSR: true,
    onlyAllowShorthands: true,
    allowedStyleValues: 'somewhat-strict-web',
    autocompleteSpecificTokens: 'except-special',
    fastSchemeChange: true,
  },
} satisfies CreateGuiProps

export type GuiGroupNames = 'item' | 'card'
