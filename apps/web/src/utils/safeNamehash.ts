import { namehash } from '@ethersproject/hash'
<<<<<<< HEAD
import { logger } from '@l.x/utils/src/logger/logger'
=======
import { logger } from 'utilities/src/logger/logger'
>>>>>>> upstream/main

export function safeNamehash(name?: string): string | undefined {
  if (name === undefined) {
    return undefined
  }

  try {
    return namehash(name)
  } catch (error) {
    logger.info('safeNamehash', 'safeNamehash', 'error', error, { name })
    return undefined
  }
}
