<<<<<<< HEAD
import { GuiProvider as OGGuiProvider, GuiProviderProps } from '@l.x/ui/src'
import config from '@l.x/ui/src/gui.config'
import { useSelectedColorScheme } from '@l.x/lx/src/features/appearance/hooks'

export function GuiProvider({ children, ...rest }: Omit<GuiProviderProps, 'config'>): JSX.Element {
  const darkMode = useSelectedColorScheme() === 'dark'
  return (
    <OGGuiProvider config={config} defaultTheme={darkMode ? 'dark' : 'light'} {...rest}>
      {children}
    </OGGuiProvider>
=======
import { TamaguiProvider as OGTamaguiProvider, TamaguiProviderProps } from 'ui/src'
import config from 'ui/src/tamagui.config'
import { useSelectedColorScheme } from 'uniswap/src/features/appearance/hooks'

export function TamaguiProvider({ children, ...rest }: Omit<TamaguiProviderProps, 'config'>): JSX.Element {
  const darkMode = useSelectedColorScheme() === 'dark'
  return (
    <OGTamaguiProvider config={config} defaultTheme={darkMode ? 'dark' : 'light'} {...rest}>
      {children}
    </OGTamaguiProvider>
>>>>>>> upstream/main
  )
}
