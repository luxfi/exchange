import { FeatureFlags, useFeatureFlag } from '@luxfi/gating'

export function useIsExtensionPasskeyImportEnabled(): boolean {
  return useFeatureFlag(FeatureFlags.EmbeddedWallet)
}
