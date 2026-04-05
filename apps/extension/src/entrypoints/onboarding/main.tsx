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

import React from 'react'
import { createRoot } from 'react-dom/client'
import OnboardingApp from 'src/app/core/OnboardingApp'
import { ExtensionAppLocation, StoreSynchronization } from 'src/store/storeSynchronization'
<<<<<<< HEAD
// biome-ignore lint/suspicious/noExplicitAny: Global polyfill cleanup requires any type for runtime modification
=======
// oxlint-disable-next-line typescript/no-explicit-any -- Global polyfill cleanup requires any type for runtime modification
>>>>>>> upstream/main
;(globalThis as any).regeneratorRuntime = undefined

function makeOnboarding(): void {
  function initOnboarding() {
<<<<<<< HEAD
    // biome-ignore lint/style/noNonNullAssertion: DOM onboarding root element guaranteed to exist in extension
=======
    // oxlint-disable-next-line typescript/no-non-null-assertion -- DOM onboarding root element guaranteed to exist in extension
>>>>>>> upstream/main
    const container = document.getElementById('onboarding-root')!
    const root = createRoot(container)

    root.render(
      <React.StrictMode>
        <OnboardingApp />
      </React.StrictMode>,
    )
  }

  StoreSynchronization.init(ExtensionAppLocation.Tab)
  initOnboarding()
}

makeOnboarding()
