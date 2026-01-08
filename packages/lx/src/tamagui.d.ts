import { config, TamaguiGroupNames } from 'ui/src/tamagui.config'
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
    groupNames(): TamaguiGroupNames
  }
}

declare module '@tamagui/core' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface TamaguiCustomConfig extends Conf {
    shorthands: ShorthandMap
  }

  interface TypeOverride {
    groupNames(): TamaguiGroupNames
  }
}

declare module '@tamagui/web' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface TamaguiCustomConfig extends Conf {
    shorthands: ShorthandMap
  }

  interface TypeOverride {
    groupNames(): TamaguiGroupNames
  }
}
