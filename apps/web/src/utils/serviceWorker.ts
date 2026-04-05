<<<<<<< HEAD
import { logger } from '@l.x/utils/src/logger/logger'
=======
import { logger } from 'utilities/src/logger/logger'
>>>>>>> upstream/main

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister()
      })
      .catch((error) => {
        logger.warn('serviceWorker', 'unregister', 'Service worker unregister failed', error)
      })
  }
}
