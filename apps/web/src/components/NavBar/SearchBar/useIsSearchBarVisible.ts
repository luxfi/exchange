import { useMedia } from '@luxfi/ui/src'

export function useIsSearchBarVisible() {
  const media = useMedia()
  return !media.xxl
}
