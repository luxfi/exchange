import { TamaguiProvider as OGGuiProvider, TamaguiProviderProps as GuiProviderProps } from '@hanzo/gui'
import { config } from '@luxfi/ui/src/gui.config'

/**
 * Helper component to wrap tests in a provider for tests.
 */
export function SharedUILuxProvider({ children }: Pick<GuiProviderProps, 'children'>): JSX.Element {
  return (
    <OGGuiProvider config={config} defaultTheme="dark">
      {children}
    </OGGuiProvider>
  )
}
