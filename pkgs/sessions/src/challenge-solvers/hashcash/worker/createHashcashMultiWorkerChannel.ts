/**
 * Base stub for multi-worker hashcash channel factory.
 * Platform-specific implementations override this file.
 */

import type { HashcashWorkerChannel } from '@l.x/sessions/src/challenge-solvers/hashcash/worker/types'
import { PlatformSplitStubError } from 'utilities/src/errors'

/**
 * Configuration for multi-worker hashcash channel.
 */
interface MultiWorkerConfig {
  workerCount?: number
  getWorker: () => Worker
}

function createHashcashMultiWorkerChannel(_config: MultiWorkerConfig): HashcashWorkerChannel {
  throw new PlatformSplitStubError('createHashcashMultiWorkerChannel')
}

export { createHashcashMultiWorkerChannel }
export type { MultiWorkerConfig }
