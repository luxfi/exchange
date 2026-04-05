<<<<<<< HEAD
import { useMedia } from '@l.x/ui/src'
=======
import { useMedia } from 'ui/src'
>>>>>>> upstream/main

export function useIsMobile(): boolean {
  const media = useMedia()
  return media.md
}
