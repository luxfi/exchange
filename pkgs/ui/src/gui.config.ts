import { createTamagui as createGui } from '@hanzo/gui'
import { animations } from '@luxfi/ui/src/theme/animations'
import { configWithoutAnimations } from '@luxfi/ui/src/theme/config'

export type { GuiGroupNames } from '@luxfi/ui/src/theme/config'

export const config = createGui({
  animations,
  ...configWithoutAnimations,
})

export default config
