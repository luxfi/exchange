import { isExtensionApp } from '@l.x/utils/src/platform'

export const getVersionHeader = (): string => {
  if (isExtensionApp) {
    return process.env.VERSION ?? ''
  } else {
    // unimplemented for interface
    return ''
  }
}
