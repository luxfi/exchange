// oxlint-disable-next-line typescript/triple-slash-reference
/// <reference path="../../../index.d.ts" />
// oxlint-disable-next-line typescript/triple-slash-reference
/// <reference path="../../../pkgs/lx/src/react-native-dotenv.d.ts" />
// oxlint-disable-next-line typescript/triple-slash-reference
/// <reference path="../../../pkgs/ui/src/env.d.ts" />

import { config, GuiGroupNames } from '~/gui.config'

type Conf = typeof config

declare module '@hanzogui/core' {
  // oxlint-disable-next-line typescript/no-empty-interface
  interface GuiCustomConfig extends Conf {}

  interface TypeOverride {
    groupNames(): GuiGroupNames
  }
}
