/**
 * Native implementation of hashcash worker channel factory.
 * Web Workers are not available in React Native.
 */

import type {
  CreateHashcashWorkerChannelContext,
  HashcashWorkerChannel,
} from '@l.x/sessions/src/challenge-solvers/hashcash/worker/types'
import { NotImplementedError } from '@l.x/utils/src/errors'

function createHashcashWorkerChannel(_ctx: CreateHashcashWorkerChannelContext): HashcashWorkerChannel {
  throw new NotImplementedError('createHashcashWorkerChannel')
}

export { createHashcashWorkerChannel }
