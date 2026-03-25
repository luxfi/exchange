import { createGui } from '@hanzo/gui'
import { animations } from './theme/animations'
import { configWithoutAnimations } from './theme/config'

export type { GuiGroupNames } from './theme/config'

export const config = createGui({
  animations,
  ...configWithoutAnimations,
})

export default config
