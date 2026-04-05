import React, { useCallback, useEffect, useState } from 'react'
import { RecipientSelect } from 'src/components/RecipientSelect/RecipientSelect'
import { SEND_CONTENT_RENDER_DELAY_MS } from 'src/features/send/constants'
<<<<<<< HEAD
import { Spacer } from '@l.x/ui/src'
import { UniverseChainId } from '@l.x/lx/src/features/chains/types'
import { TransactionModalInnerContainer } from '@l.x/lx/src/features/transactions/components/TransactionModal/TransactionModal'
import { useTransactionModalContext } from '@l.x/lx/src/features/transactions/components/TransactionModal/TransactionModalContext'
import { useSendContext } from '@luxfi/wallet/src/features/transactions/contexts/SendContext'
=======
import { Spacer } from 'ui/src'
import { UniverseChainId } from 'uniswap/src/features/chains/types'
import { TransactionModalInnerContainer } from 'uniswap/src/features/transactions/components/TransactionModal/TransactionModal'
import { useTransactionModalContext } from 'uniswap/src/features/transactions/components/TransactionModal/TransactionModalContext'
import { useSendContext } from 'wallet/src/features/transactions/contexts/SendContext'
>>>>>>> upstream/main

// We add a short hardcoded delay to allow the sheet to animate quickly both on first render and when going back from Review -> Form.
export function SendRecipientSelectFullScreen(): JSX.Element {
  const [hideContent, setHideContent] = useState(true)
  useEffect(() => {
    setTimeout(() => setHideContent(false), SEND_CONTENT_RENDER_DELAY_MS)
  }, [])

  return <SendRecipientSelectFullScreenContent hideContent={hideContent} />
}

function SendRecipientSelectFullScreenContent({ hideContent }: { hideContent: boolean }): JSX.Element {
  const { bottomSheetViewStyles } = useTransactionModalContext()
  const { recipient, derivedSendInfo, updateSendForm } = useSendContext()

  const onSelectRecipient = useCallback(
    (newRecipient: string) => {
      updateSendForm({ recipient: newRecipient, showRecipientSelector: false })
    },
    [updateSendForm],
  )

  const onHideRecipientSelector = useCallback(() => {
    updateSendForm({ showRecipientSelector: false })
  }, [updateSendForm])

  return (
    <TransactionModalInnerContainer fullscreen bottomSheetViewStyles={bottomSheetViewStyles}>
      {!hideContent && (
        <>
          <Spacer size="$spacing12" />
          <RecipientSelect
            chainId={derivedSendInfo.chainId as UniverseChainId}
            recipient={recipient}
            onHideRecipientSelector={onHideRecipientSelector}
            onSelectRecipient={onSelectRecipient}
          />
        </>
      )}
    </TransactionModalInnerContainer>
  )
}
