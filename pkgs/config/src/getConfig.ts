import { Config } from '@l.x/config/src/config-types'
import { PlatformSplitStubError } from '@l.x/utils/src/errors'

export function getConfig(): Config {
  throw new PlatformSplitStubError('Use the correct getConfig for your platform')
}
