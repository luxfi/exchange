<<<<<<< HEAD
import { useMedia } from '@l.x/ui/src'
=======
import { useMedia } from 'ui/src'
>>>>>>> upstream/main

export function useIsSearchBarVisible() {
  const media = useMedia()
  return !media.xxl
}
