// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../index.d.ts" />
import { config } from 'ui/src/tamagui.config'
import { shorthands } from 'ui/src/theme/shorthands'

type Conf = typeof config

// Explicit shorthand mappings for Tamagui type system
type ShorthandMap = typeof shorthands

declare module 'tamagui' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface TamaguiCustomConfig extends Conf {
    shorthands: ShorthandMap
  }

  interface TypeOverride {
    groupNames(): 'item' | 'card'
  }
}

declare module '@tamagui/core' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface TamaguiCustomConfig extends Conf {
    shorthands: ShorthandMap
  }

  interface TypeOverride {
    groupNames(): 'item' | 'card'
  }
}

declare module '@tamagui/web' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface TamaguiCustomConfig extends Conf {
    shorthands: ShorthandMap
  }

  interface TypeOverride {
    groupNames(): 'item' | 'card'
  }
}
