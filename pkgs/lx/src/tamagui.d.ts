import { config, GuiGroupNames } from 'ui/src/gui.config'

type Conf = typeof config

declare module '@hanzo/gui' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface GuiCustomConfig extends Conf {}

  interface TypeOverride {
    groupNames(): GuiGroupNames
  }
}
