import { useSporeColors } from '@l.x/ui/src'

export function useBackgroundColor(): string {
  const {
    surface1: { val },
  } = useSporeColors()

  return val
}
