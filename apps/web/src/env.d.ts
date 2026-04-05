<<<<<<< HEAD
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../index.d.ts" />
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../pkgs/lx/src/react-native-dotenv.d.ts" />
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../pkgs/ui/src/env.d.ts" />

import { config, GuiGroupNames } from '~/gui.config'

type Conf = typeof config

declare module 'gui' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface GuiCustomConfig extends Conf {}

  interface TypeOverride {
    groupNames(): GuiGroupNames
=======
// oxlint-disable-next-line typescript/triple-slash-reference
/// <reference path="../../../index.d.ts" />
// oxlint-disable-next-line typescript/triple-slash-reference
/// <reference path="../../../packages/uniswap/src/react-native-dotenv.d.ts" />
// oxlint-disable-next-line typescript/triple-slash-reference
/// <reference path="../../../packages/ui/src/env.d.ts" />

import { config, TamaguiGroupNames } from '~/tamagui.config'

type Conf = typeof config

declare module 'tamagui' {
  // oxlint-disable-next-line typescript/no-empty-interface
  interface TamaguiCustomConfig extends Conf {}

  interface TypeOverride {
    groupNames(): TamaguiGroupNames
>>>>>>> upstream/main
  }
}
