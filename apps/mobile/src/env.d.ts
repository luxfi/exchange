<<<<<<< HEAD
import { config, GuiGroupNames } from '@l.x/ui/src/gui.config'

type Conf = typeof config

declare module 'gui' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface GuiCustomConfig extends Conf {}

  interface TypeOverride {
    groupNames(): GuiGroupNames
=======
import { config, TamaguiGroupNames } from 'ui/src/tamagui.config'

type Conf = typeof config

declare module 'tamagui' {
  // oxlint-disable-next-line typescript/no-empty-interface
  interface TamaguiCustomConfig extends Conf {}

  interface TypeOverride {
    groupNames(): TamaguiGroupNames
>>>>>>> upstream/main
  }
}
