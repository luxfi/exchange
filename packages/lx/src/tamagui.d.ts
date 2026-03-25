import { config, GuiGroupNames } from 'ui/src/gui.config'
import { shorthands } from 'ui/src/theme/shorthands'

type Conf = typeof config

// Explicit shorthand mappings for Gui type system
type ShorthandMap = typeof shorthands

declare module 'gui' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface GuiCustomConfig extends Conf {
    shorthands: ShorthandMap
  }

  interface TypeOverride {
    groupNames(): GuiGroupNames
  }
}

declare module '@hanzogui/core' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface GuiCustomConfig extends Conf {
    shorthands: ShorthandMap
  }

  interface TypeOverride {
    groupNames(): GuiGroupNames
  }
}

declare module '@hanzogui/web' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface GuiCustomConfig extends Conf {
    shorthands: ShorthandMap
  }

  interface TypeOverride {
    groupNames(): GuiGroupNames
  }
}
