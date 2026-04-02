import { config, GuiGroupNames } from '@luxfi/ui/src/gui.config'

type Conf = typeof config

declare module 'gui' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface GuiCustomConfig extends Conf {}

  interface TypeOverride {
    groupNames(): GuiGroupNames
  }
}
