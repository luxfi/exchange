import { FeatureFlags, useFeatureFlag } from '@luxfi/gating'
import { MenuStateVariant, useSetMenuCallback } from 'components/AccountDrawer/menuState'
import { CompactWalletModal } from 'components/WalletModal/CompactWalletModal'
import { EmbeddedWalletModal } from 'components/WalletModal/EmbeddedWalletModal'
import { StandardWalletModal } from 'components/WalletModal/StandardWalletModal'
import { SwitchWalletModal } from 'components/WalletModal/SwitchWalletModal'
import { useAtom } from 'jotai'
import { useEffect, useMemo } from 'react'
import { lastFullWalletModalShownAtom, shouldShowFullWalletModal } from 'state/application/atoms'
import { Platform } from 'lx/src/features/platforms/types/Platform'

export default function WalletModal({ connectOnPlatform }: { connectOnPlatform?: Platform | 'any' }) {
  const isEmbeddedWalletEnabled = useFeatureFlag(FeatureFlags.EmbeddedWallet)
  const onClose = useSetMenuCallback(MenuStateVariant.MAIN)
  const [lastShown, setLastShown] = useAtom(lastFullWalletModalShownAtom)

  // Determine if we should show the full modal or compact version
  const showFullModal = useMemo(() => shouldShowFullWalletModal(lastShown as number | null), [lastShown])

  // Update timestamp when showing full modal
  useEffect(() => {
    if (showFullModal) {
      setLastShown(Date.now())
    }
  }, [showFullModal, setLastShown])

  if (connectOnPlatform) {
    return <SwitchWalletModal connectOnPlatform={connectOnPlatform} onClose={onClose} />
  }

  // Show compact modal if full modal was shown within the last hour
  if (!showFullModal) {
    return <CompactWalletModal />
  }

  return isEmbeddedWalletEnabled ? <EmbeddedWalletModal /> : <StandardWalletModal />
}
