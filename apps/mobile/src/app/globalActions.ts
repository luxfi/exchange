<<<<<<< HEAD
// Copied from https://github.com/Lux/interface/blob/main/src/state/global/actions.ts
=======
// Copied from https://github.com/Uniswap/interface/blob/main/src/state/global/actions.ts
>>>>>>> upstream/main

import { createAction } from '@reduxjs/toolkit'

// fired once when the app reloads but before the app renders
// allows any updates to be applied to store data loaded from localStorage
<<<<<<< HEAD
// eslint-disable-next-line import/no-unused-modules
=======
// oxlint-disable-next-line import/no-unused-modules
>>>>>>> upstream/main
export const updateVersion = createAction<void>('global/updateVersion')
