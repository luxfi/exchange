// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../index.d.ts" />

/** biome-ignore-all lint/style/noNamespace: required to define process.env type */

declare global {
  namespace NodeJS {
    // All process.env values used by this package should be listed here
    interface ProcessEnv {
      NODE_ENV?: 'development' | 'production' | 'test'
    }
  }
}

import { config } from 'ui/src/gui.config'
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
    groupNames(): 'item' | 'card'
  }
}

declare module '@hanzogui/core' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface GuiCustomConfig extends Conf {
    shorthands: ShorthandMap
  }

  interface TypeOverride {
    groupNames(): 'item' | 'card'
  }
}

declare module '@hanzogui/web' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface GuiCustomConfig extends Conf {
    shorthands: ShorthandMap
  }

  interface TypeOverride {
    groupNames(): 'item' | 'card'
  }
}

export {}
