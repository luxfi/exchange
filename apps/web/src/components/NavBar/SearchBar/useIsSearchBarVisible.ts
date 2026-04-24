import { useMedia } from '@l.x/ui/src'

export function useIsSearchBarVisible() {
  const media = useMedia()
  return !media.xxl
}
