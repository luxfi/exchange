import { GuiProvider as OGGuiProvider, GuiProviderProps } from 'ui/src'
import { config } from 'ui/src/gui.config'
import { useSelectedColorScheme } from 'lx/src/features/appearance/hooks'
import { isTestEnv } from 'utilities/src/environment/env'

// without <NavigationProvider>
// this exported Provider is useful for tests

export function GuiProvider({ children, ...rest }: Omit<GuiProviderProps, 'config'>): JSX.Element {
  // because we don't always want to wrap all of redux for visual tests, make it default to false if in test mode
  // this should be done better but release needs hotfix so for now it works
  const userSelectedColorScheme = useSelectedColorScheme()
  const isDark = isTestEnv() ? false : userSelectedColorScheme === 'dark'

  return (
    <OGGuiProvider config={config} defaultTheme={isDark ? 'dark' : 'light'} {...rest}>
      {children}
    </OGGuiProvider>
  )
}
