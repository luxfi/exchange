/**
 * Native stub for multi-worker hashcash channel factory.
 * Web Workers are not available in React Native.
 */

import type { HashcashWorkerChannel } from '@l.x/sessions/src/challenge-solvers/hashcash/worker/types'
import { NotImplementedError } from '@l.x/utils/src/errors'

/**
 * Configuration for multi-worker hashcash channel.
 */
interface MultiWorkerConfig {
  workerCount?: number
  getWorker: () => Worker
}

function createHashcashMultiWorkerChannel(_config: MultiWorkerConfig): HashcashWorkerChannel {
  throw new NotImplementedError('createHashcashMultiWorkerChannel')
}

export { createHashcashMultiWorkerChannel }
export type { MultiWorkerConfig }
