import { toast } from 'sonner'
import { PopupContent } from '~/components/Popups/types'

<<<<<<< HEAD
=======
// oxlint-disable-next-line max-params -- biome-parity: oxlint is stricter here
>>>>>>> upstream/main
type PopupListener = (content: PopupContent, key: string, removeAfterMs?: number) => string | number

class PopupRegistry {
  private listener: PopupListener | undefined
  private popupKeyToId = new Map<string, string | number>()

<<<<<<< HEAD
  // eslint-disable-next-line max-params
=======
  // oxlint-disable-next-line max-params
>>>>>>> upstream/main
  addPopup(content: PopupContent, key: string, removeAfterMs?: number): void {
    if (this.popupKeyToId.has(key)) {
      return
    }
    const toastId = this.listener?.(content, key, removeAfterMs)
    if (toastId) {
      this.popupKeyToId.set(key, toastId)
    }
  }

  addListener(listener: PopupListener): () => void {
    this.listener = listener
    return () => (this.listener = undefined)
  }

  removePopup(key: string): void {
    toast.dismiss(this.popupKeyToId.get(key))
    this.popupKeyToId.delete(key)
  }
}

export const popupRegistry = new PopupRegistry()
