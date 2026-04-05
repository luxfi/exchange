// oxlint-disable-next-line typescript/triple-slash-reference
/// <reference path="../../../index.d.ts" />

/* oxlint-disable typescript/no-namespace -- required to define process.env type */

declare global {
  namespace NodeJS {
    // All process.env values used by this package should be listed here
    interface ProcessEnv {
      NODE_ENV?: 'development' | 'production' | 'test'
    }
  }
}

import { config } from 'ui/src/tamagui.config'

type Conf = typeof config

declare module 'tamagui' {
  // oxlint-disable-next-line typescript/no-empty-interface
  interface TamaguiCustomConfig extends Conf {}

  interface TypeOverride {
    groupNames(): 'item' | 'card'
  }
}

export {}
