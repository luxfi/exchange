import { useDispatch } from 'react-redux'
import { pushNotification } from '@l.x/lx/src/features/notifications/slice/slice'
import { AppNotificationType, CopyNotificationType } from '@l.x/lx/src/features/notifications/slice/types'
import { setClipboard } from '@luxfi/utilities/src/clipboard/clipboard'
import { useEvent } from '@luxfi/utilities/src/react/hooks'
import { CopyToClipboardFunction } from '@luxfi/wallet/src/components/copy/useCopyToClipboard'

/**
 * Hook for copying text to clipboard with notification
 * Native implementation using expo-clipboard
 */
export function useCopyToClipboard(): CopyToClipboardFunction {
  const dispatch = useDispatch()

  return useEvent(async ({ textToCopy, copyType }: { textToCopy: string; copyType: CopyNotificationType }) => {
    try {
      await setClipboard(textToCopy)

      dispatch(
        pushNotification({
          type: AppNotificationType.Copied,
          copyType,
        }),
      )
    } catch (_e) {
      dispatch(
        pushNotification({
          type: AppNotificationType.CopyFailed,
          copyType,
        }),
      )
    }
  })
}
