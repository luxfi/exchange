/**
 * Brand theme overlay — merges `brand.theme.{light,dark}` color overrides over
 * the default Tamagui theme tokens at runtime.
 *
 * Why this exists:
 * - The default themes ship with hard-coded accent/surface/neutral colors
 *   (`pkgs/ui/src/theme/themes.ts`). White-label deployments need these to
 *   come from `brand.theme` in the runtime config.
 * - On web, Tamagui themes also compile down to CSS custom properties; brand.ts
 *   already overrides `--accent1`, `--surface1`, etc. on `document.documentElement`.
 *   This helper covers the JS path so any code that reads theme tokens directly
 *   (useSporeColors, useTheme, etc.) sees the brand values too.
 *
 * Call once after `loadBrandConfig()` resolves and before Tamagui mounts.
 */
import { themes } from '@l.x/ui/src/theme/themes'

// Local copy of the BrandTheme shape to avoid a runtime dependency on @l.x/config
// (which itself does not depend on @l.x/ui — keep it that way).
export interface BrandTheme {
  accent1?: string
  accent1Hovered?: string
  accent2?: string
  accent3?: string
  surface1?: string
  surface2?: string
  surface3?: string
  neutral1?: string
  neutral2?: string
  neutral3?: string
  neutralContrast?: string
  background?: string
  statusSuccess?: string
  statusCritical?: string
  statusWarning?: string
  scrim?: string
}

const TOKEN_KEYS = [
  'accent1',
  'accent1Hovered',
  'accent2',
  'accent3',
  'surface1',
  'surface2',
  'surface3',
  'neutral1',
  'neutral2',
  'neutral3',
  'statusSuccess',
  'statusCritical',
  'statusWarning',
  'scrim',
] as const satisfies readonly (keyof BrandTheme)[]

function overlayTheme(target: Record<string, unknown>, overrides?: BrandTheme): void {
  if (!overrides) {
    return
  }
  for (const key of TOKEN_KEYS) {
    const value = overrides[key]
    if (typeof value === 'string' && value.length > 0) {
      target[key] = value
    }
  }
  // Derived: page background falls back to surface1
  const bg = overrides.background ?? overrides.surface1
  if (bg) {
    target['background'] = bg
  }
  // Derived: hover/press/focus follow surface2 unless explicitly set
  const bgHover = overrides.surface2
  if (bgHover) {
    target['backgroundHover'] = bgHover
    target['backgroundPress'] = bgHover
    target['backgroundFocus'] = bgHover
  }
  // Color tokens (Tamagui's `color` etc.) follow neutral1/accent1
  if (overrides.neutral1) {
    target['color'] = overrides.neutral1
  }
  if (overrides.accent1) {
    target['colorHover'] = overrides.accent1
    target['colorPress'] = overrides.accent1
    target['colorFocus'] = overrides.accent1
  }
}

export function brandThemeOverlay(theme?: { light?: BrandTheme; dark?: BrandTheme }): void {
  if (!theme) {
    return
  }
  overlayTheme(themes.light as Record<string, unknown>, theme.light)
  overlayTheme(themes.dark as Record<string, unknown>, theme.dark)
}
