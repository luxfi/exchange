import { createGui } from '@hanzo/gui'
import { animations } from '@l.x/ui/src/theme/animations'
import { configWithoutAnimations } from '@l.x/ui/src/theme/config'

export type { GuiGroupNames } from '@l.x/ui/src/theme/config'

export const config = createGui({
  animations,
  ...configWithoutAnimations,
})

export default config
