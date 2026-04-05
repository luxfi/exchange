<<<<<<< HEAD
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../../../index.d.ts" />
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
=======
// oxlint-disable-next-line typescript/triple-slash-reference
/// <reference path="../../../../../index.d.ts" />
// oxlint-disable-next-line typescript/triple-slash-reference
>>>>>>> upstream/main
/// <reference path="../../../.wxt/wxt.d.ts" />

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import UnitagClaimApp from 'src/app/core/UnitagClaimApp'
import { initializeReduxStore } from 'src/store/store'
<<<<<<< HEAD
// biome-ignore lint/suspicious/noExplicitAny: Global polyfill cleanup requires any type for runtime modification
=======
// oxlint-disable-next-line typescript/no-explicit-any -- Global polyfill cleanup requires any type for runtime modification
>>>>>>> upstream/main
;(globalThis as any).regeneratorRuntime = undefined

function makeUnitagClaim(): void {
  function initUnitagClaim(): void {
<<<<<<< HEAD
    // biome-ignore lint/style/noNonNullAssertion: DOM unitag claim root element guaranteed to exist in extension
=======
    // oxlint-disable-next-line typescript/no-non-null-assertion -- DOM unitag claim root element guaranteed to exist in extension
>>>>>>> upstream/main
    const container = document.getElementById('unitag-claim-root')!
    const root = createRoot(container)

    root.render(
      <StrictMode>
        <UnitagClaimApp />
      </StrictMode>,
    )
  }

  initializeReduxStore({ readOnly: true })
  initUnitagClaim()
}

makeUnitagClaim()
