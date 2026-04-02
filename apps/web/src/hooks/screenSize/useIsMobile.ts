import { useMedia } from '@l.x/ui/src'

export function useIsMobile(): boolean {
  const media = useMedia()
  return media.md
}
