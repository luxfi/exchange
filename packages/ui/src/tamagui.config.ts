import { createTamagui } from 'tamagui'
import { animations } from './theme/animations'
import { configWithoutAnimations } from './theme/config'

export type { TamaguiGroupNames } from './theme/config'

export const config = createTamagui({
  animations,
  ...configWithoutAnimations,
})

export default config
