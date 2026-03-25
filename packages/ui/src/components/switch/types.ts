import type { SwitchProps as GuiSwitchProps } from '@hanzo/gui'
import type { SporeComponentVariant } from 'ui/src/components/types'

export type SwitchProps = GuiSwitchProps & {
  variant: SporeComponentVariant
}
