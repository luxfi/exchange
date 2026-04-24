import { useState } from 'react'
import { Flex } from '@l.x/ui/src'
import {
  TransactionModalContextProvider,
  TransactionScreen,
} from '@l.x/lx/src/features/transactions/components/TransactionModal/TransactionModalContext'
import {
  TransactionModalFooterContainerProps,
  TransactionModalInnerContainerProps,
  TransactionModalProps,
} from '@l.x/lx/src/features/transactions/components/TransactionModal/TransactionModalProps'
import { TransactionModalUpdateLogger } from '@l.x/lx/src/features/transactions/components/TransactionModal/TransactionModalUpdateLogger'

export function TransactionModal({
  children,
  onClose,
  onCurrencyChange,
  openWalletRestoreModal,
  walletNeedsRestore,
  swapRedirectCallback,
  passkeyAuthStatus,
  modalName,
}: TransactionModalProps): JSX.Element {
  const [screen, setScreen] = useState<TransactionScreen>(TransactionScreen.Form)

  return (
    <Flex fill justifyContent="flex-end">
      <TransactionModalContextProvider
        bottomSheetViewStyles={{}}
        openWalletRestoreModal={openWalletRestoreModal}
        walletNeedsRestore={walletNeedsRestore}
        screen={screen}
        passkeyAuthStatus={passkeyAuthStatus}
        setScreen={setScreen}
        swapRedirectCallback={swapRedirectCallback}
        onClose={onClose}
        onCurrencyChange={onCurrencyChange}
      >
        {children}
        <TransactionModalUpdateLogger modalName={modalName} />
      </TransactionModalContextProvider>
    </Flex>
  )
}

export function TransactionModalInnerContainer({
  fullscreen,
  children,
}: TransactionModalInnerContainerProps): JSX.Element {
  return <Flex fill={fullscreen}>{children}</Flex>
}

export function TransactionModalFooterContainer({ children }: TransactionModalFooterContainerProps): JSX.Element {
  return (
    <Flex animation="fast" animateEnter="fadeInDown" position="relative" pt="$spacing24">
      {children}
    </Flex>
  )
}
