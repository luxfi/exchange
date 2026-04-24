import { KeyboardLayout } from '@l.x/lx/src/utils/useKeyboardLayout'
import { NotImplementedError } from '@l.x/utils/src/errors'

export function useKeyboardLayout(): KeyboardLayout {
  throw new NotImplementedError('useKeyboardLayout')
}
