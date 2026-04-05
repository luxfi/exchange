import { FeatureFlags, useFeatureFlag } from '@universe/gating'
import { atom, useAtom } from 'jotai'
import { useCallback, useEffect, useState } from 'react'
import { AnimatedPager, Flex } from 'ui/src'
import { Modal } from 'uniswap/src/components/modals/Modal'
import { ModalName } from 'uniswap/src/features/telemetry/constants'
import { TestID } from 'uniswap/src/test/fixtures/testIDs'
import { ChooseUnitagModal } from '~/components/NavBar/DownloadApp/Modal/ChooseUnitag'
import { DownloadAppsModal } from '~/components/NavBar/DownloadApp/Modal/DownloadApps'
import { KeyManagementModal } from '~/components/NavBar/DownloadApp/Modal/KeyManagement'
import { PasskeyGenerationModal } from '~/components/NavBar/DownloadApp/Modal/PasskeyGeneration'
import { useModalState } from '~/hooks/useModalState'

export enum Page {
  DownloadApp = 0,
  ChooseUnitag = 1,
  KeyManagement = 2,
  PasskeyGeneration = 3,
}

export const downloadAppModalPageAtom = atom<Page>(Page.DownloadApp)

export function GetTheAppModal() {
  const isEmbeddedWalletEnabled = useFeatureFlag(FeatureFlags.EmbeddedWallet)
  const initialPage = isEmbeddedWalletEnabled ? Page.ChooseUnitag : Page.DownloadApp

  const [page, setPage] = useAtom(downloadAppModalPageAtom)
  const { isOpen, closeModal } = useModalState(ModalName.GetTheApp)
  const close = useCallback(() => {
    closeModal()
    setTimeout(() => setPage(initialPage), 500)
  }, [closeModal, setPage, initialPage])

  const [unitag, setUnitag] = useState('')
  useEffect(() => {
    setPage(initialPage)
  }, [initialPage, setPage])

  return (
    <Modal
      skipLogImpression
      name={ModalName.DownloadApp}
      isModalOpen={isOpen}
      maxWidth="fit-content"
      mx="auto"
      onClose={close}
      padding={0}
    >
      <Flex data-testid={TestID.DownloadUniswapModal} position="relative" userSelect="none">
        {/* The Page enum value corresponds to the modal page's index */}
        <AnimatedPager currentIndex={page}>
          <DownloadAppsModal onClose={close} />
          <ChooseUnitagModal
            setUnitag={setUnitag}
            goBack={isEmbeddedWalletEnabled ? undefined : () => setPage(Page.DownloadApp)}
            onClose={close}
            setPage={setPage}
          />
          <KeyManagementModal goBack={() => setPage(Page.ChooseUnitag)} onClose={close} setPage={setPage} />
          <PasskeyGenerationModal
            unitag={unitag}
            goBack={() => setPage(Page.KeyManagement)}
            onClose={close}
            setPage={setPage}
          />
        </AnimatedPager>
      </Flex>
    </Modal>
  )
}
