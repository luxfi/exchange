<<<<<<< HEAD
import { FeatureFlags, useFeatureFlag } from '@luxfi/gating'
=======
import { FeatureFlags, useFeatureFlag } from '@universe/gating'
>>>>>>> upstream/main

export function useIsExtensionPasskeyImportEnabled(): boolean {
  return useFeatureFlag(FeatureFlags.EmbeddedWallet)
}
