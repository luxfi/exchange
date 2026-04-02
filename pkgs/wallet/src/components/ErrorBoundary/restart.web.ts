import { getChromeWithThrow } from '@l.x/utils/src/chrome/chrome'

export const restart = (): void => {
  const chrome = getChromeWithThrow()
  chrome.runtime.reload()
}
