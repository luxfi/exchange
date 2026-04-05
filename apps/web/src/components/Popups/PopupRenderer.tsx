import { useEffect } from 'react'
import { Toaster, toast } from 'sonner'
<<<<<<< HEAD
import { spacing } from '@l.x/ui/src/theme'
=======
import { spacing } from 'ui/src/theme'
>>>>>>> upstream/main
import { PopupItem } from '~/components/Popups/PopupItem'
import { popupRegistry } from '~/components/Popups/registry'
import { PopupContent } from '~/components/Popups/types'
import { DEFAULT_TXN_DISMISS_MS } from '~/constants/misc'

export function PopupRenderer() {
  useEffect(() => {
<<<<<<< HEAD
    // eslint-disable-next-line max-params
=======
    // oxlint-disable-next-line max-params
>>>>>>> upstream/main
    const unsubscribe = popupRegistry.addListener((content: PopupContent, key: string, removeAfterMs?: number) => {
      const toastId = toast(
        <PopupItem key={key} content={content} onClose={() => popupRegistry.removePopup(key)} popKey={key} />,
        {
          duration: removeAfterMs ?? DEFAULT_TXN_DISMISS_MS,
          onDismiss: () => {
            popupRegistry.removePopup(key)
          },
          onAutoClose: () => {
            popupRegistry.removePopup(key)
          },
        },
      )
      return toastId
    })

    return unsubscribe
  }, [])

  return (
    <Toaster
<<<<<<< HEAD
      position="bottom-right"
      pauseWhenPageIsHidden
      expand
      style={{
        marginBottom: spacing.spacing32,
=======
      position="top-right"
      pauseWhenPageIsHidden
      expand
      style={{
        marginTop: spacing.spacing32,
>>>>>>> upstream/main
      }}
      toastOptions={{
        style: {
          padding: 0,
          margin: 0,
          background: 'transparent',
          border: 'none',
          boxShadow: 'none',
          display: 'flex',
          justifyContent: 'flex-end',
        },
      }}
    />
  )
}
