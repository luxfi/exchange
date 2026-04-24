import { useMemo } from 'react'
// biome-ignore lint/style/noRestrictedImports: legacy import will be migrated
import { useDeviceInsets } from '@l.x/ui/src/hooks/useDeviceInsets'
import { useTestnetModeBannerHeight } from '@l.x/lx/src/features/settings/hooks'

export const useAppInsets = (): {
  top: number
  right: number
  bottom: number
  left: number
} => {
  const insets = useDeviceInsets()
  const testnetBannerInset = useTestnetModeBannerHeight()

  return useMemo(
    () => ({
      right: insets.right,
      bottom: insets.bottom,
      left: insets.left,
      top: insets.top + testnetBannerInset,
    }),
    [insets.top, insets.right, insets.bottom, insets.left, testnetBannerInset],
  )
}
