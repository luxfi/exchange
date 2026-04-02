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

import { config } from '@luxfi/ui/src/gui.config'

type Conf = typeof config

declare module '@hanzo/gui' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface GuiCustomConfig extends Conf {}

  interface TypeOverride {
    groupNames(): 'item' | 'card'
  }
}

export {}
