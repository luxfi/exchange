import { GuiProvider as OGGuiProvider, GuiProviderProps } from '@l.x/ui/src'
import config from '@l.x/ui/src/gui.config'
import { useSelectedColorScheme } from '@l.x/lx/src/features/appearance/hooks'

export { GuiProvider as TamaguiProvider }
export function GuiProvider({ children, ...rest }: Omit<GuiProviderProps, 'config'>): JSX.Element {
  const darkMode = useSelectedColorScheme() === 'dark'
  return (
    <OGGuiProvider config={config} defaultTheme={darkMode ? 'dark' : 'light'} {...rest}>
      {children}
    </OGGuiProvider>
  )
}
