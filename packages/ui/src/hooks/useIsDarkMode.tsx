// until the web app needs all of gui, avoid heavy imports there
// biome-ignore lint/style/noRestrictedImports: until the web app needs all of gui, avoid heavy imports there
import { useThemeName } from '@hanzogui/core'

export function useIsDarkMode(): boolean {
  const themeName = useThemeName()
  return themeName.startsWith('dark')
}
