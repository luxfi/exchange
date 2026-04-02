import { useMedia } from '@luxfi/ui/src'

export function useIsMobile(): boolean {
  const media = useMedia()
  return media.md
}
